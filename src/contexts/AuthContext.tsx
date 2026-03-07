import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Firebase Functions API base URL ──────────────────────────────────────────
// In dev, Vite proxy or the deployed Function URL. We read from env or fallback.
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://us-central1-" +
    import.meta.env.VITE_FIREBASE_PROJECT_ID +
    ".cloudfunctions.net/apiV1";

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

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem("nca_admin_auth");
        const storedUser = localStorage.getItem("nca_admin_user");

        if (storedAuth === "true" && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ── Step 1: Request OTP ──────────────────────────────────────────────────
    const requestOtp = async (
        email: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
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
            const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    otp: otp.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error ?? "Verification failed." };
            }

            // Mark as authenticated
            const userEmail = email.trim().toLowerCase();
            setIsAuthenticated(true);
            setUser({ email: userEmail });
            localStorage.setItem("nca_admin_auth", "true");
            localStorage.setItem("nca_admin_user", JSON.stringify({ email: userEmail }));

            return { success: true };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("nca_admin_auth");
        localStorage.removeItem("nca_admin_user");
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
