import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ─── Firebase Functions API base URL ──────────────────────────────────────────
// In dev, Vite proxy or the deployed Function URL. We read from env or fallback.
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (PROJECT_ID
        ? "https://us-central1-" + PROJECT_ID + ".cloudfunctions.net/apiV1"
        : "");

interface AuthContextType {
    isAuthenticated: boolean;
    user: { email: string } | null;
    requestOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const scheduleAutoLogout = (expiresAtMs: number) => {
        clearLogoutTimer();
        const delay = expiresAtMs - Date.now();
        if (delay <= 0) return;
        logoutTimerRef.current = setTimeout(() => {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("nca_admin_auth");
            localStorage.removeItem("nca_admin_user");
            localStorage.removeItem("nca_admin_expires_at");
        }, delay);
    };

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem("nca_admin_auth");
        const storedUser = localStorage.getItem("nca_admin_user");
        const storedExpiresAt = localStorage.getItem("nca_admin_expires_at");
        const storedFirebaseToken = localStorage.getItem("nca_admin_firebase_token");

        const expiresAtMs = storedExpiresAt ? Number(storedExpiresAt) : NaN;
        const isExpired = !Number.isFinite(expiresAtMs) || Date.now() >= expiresAtMs;

        if (storedAuth === "true" && isExpired) {
            localStorage.removeItem("nca_admin_auth");
            localStorage.removeItem("nca_admin_user");
            localStorage.removeItem("nca_admin_expires_at");
            return;
        }

        if (storedAuth === "true" && storedUser) {
            try {
                const parsed = JSON.parse(storedUser) as { email?: unknown };
                if (parsed && typeof parsed === "object" && typeof parsed.email === "string") {
                    setIsAuthenticated(true);
                    setUser({ email: parsed.email });
                    if (Number.isFinite(expiresAtMs)) scheduleAutoLogout(expiresAtMs);

                    // Ensure Firebase Auth session exists for Firestore writes.
                    // If it doesn't, reuse the last custom token (valid for sign-in) when present.
                    if (!auth.currentUser && storedFirebaseToken && !isExpired) {
                        signInWithCustomToken(auth, storedFirebaseToken).catch(() => {
                            // Ignore: admin will be prompted to login again when needed.
                        });
                    }
                } else {
                    localStorage.removeItem("nca_admin_auth");
                    localStorage.removeItem("nca_admin_user");
                    localStorage.removeItem("nca_admin_expires_at");
                    localStorage.removeItem("nca_admin_firebase_token");
                }
            } catch {
                localStorage.removeItem("nca_admin_auth");
                localStorage.removeItem("nca_admin_user");
                localStorage.removeItem("nca_admin_expires_at");
                localStorage.removeItem("nca_admin_firebase_token");
            }
        }
        return () => {
            clearLogoutTimer();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Step 1: Request OTP ──────────────────────────────────────────────────
    const requestOtp = async (
        email: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!API_BASE) {
                return {
                    success: false,
                    error: "Missing API configuration (VITE_FIREBASE_PROJECT_ID or VITE_API_BASE_URL).",
                };
            }
            const res = await fetch(`${API_BASE}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error ?? "Failed to send code." };
            }

            return { success: true };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    // ── Step 2: Verify OTP ───────────────────────────────────────────────────
    const verifyOtp = async (
        email: string,
        otp: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!API_BASE) {
                return {
                    success: false,
                    error: "Missing API configuration (VITE_FIREBASE_PROJECT_ID or VITE_API_BASE_URL).",
                };
            }
            const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    otp: otp.trim(),
                }),
            });

            const rawText = await res.text();
            let data: any = null;
            try {
                data = rawText ? JSON.parse(rawText) : null;
            } catch {
                data = null;
            }

            if (!res.ok) {
                const errorFromBody = data && typeof data === "object" ? (data.error as unknown) : undefined;
                return {
                    success: false,
                    error:
                        (typeof errorFromBody === "string" && errorFromBody) ||
                        `Verification failed (HTTP ${res.status}).`,
                };
            }

            if (!data || typeof data !== "object" || !data.firebaseToken || typeof data.firebaseToken !== "string") {
                const snippet = rawText.length > 300 ? rawText.slice(0, 300) + "…" : rawText;
                console.error("verify-otp did not return firebaseToken", {
                    url: `${API_BASE}/auth/verify-otp`,
                    status: res.status,
                    responseSnippet: snippet,
                });
                return {
                    success: false,
                    error: "Missing Firebase token. Please try again.",
                };
            }

            // Sign into Firebase Auth so we can write to Firestore with admin rules.
            try {
                await signInWithCustomToken(auth, data.firebaseToken);
                localStorage.setItem("nca_admin_firebase_token", data.firebaseToken);
            } catch {
                return { success: false, error: "Failed to start admin session. Please try again." };
            }

            // Mark as authenticated
            const userEmail = email.trim().toLowerCase();
            setIsAuthenticated(true);
            setUser({ email: userEmail });
            localStorage.setItem("nca_admin_auth", "true");
            localStorage.setItem("nca_admin_user", JSON.stringify({ email: userEmail }));
            const expiresAt = Date.now() + 3 * 60 * 60 * 1000;
            localStorage.setItem("nca_admin_expires_at", String(expiresAt));
            scheduleAutoLogout(expiresAt);

            return { success: true };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const logout = () => {
        clearLogoutTimer();
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("nca_admin_auth");
        localStorage.removeItem("nca_admin_user");
        localStorage.removeItem("nca_admin_expires_at");
        localStorage.removeItem("nca_admin_firebase_token");
        signOut(auth).catch(() => {
            // ignore
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, requestOtp, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
