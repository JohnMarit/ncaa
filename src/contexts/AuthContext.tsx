import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    createUserWithEmailAndPassword,
    getIdTokenResult,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    registerAdmin: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            if (!fbUser?.email) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            try {
                const token = await getIdTokenResult(fbUser, true);
                const isAdmin = Boolean((token.claims as any)?.admin);
                if (!isAdmin) {
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }

                setIsAuthenticated(true);
                setUser({ email: fbUser.email.toLowerCase() });
            } catch {
                setIsAuthenticated(false);
                setUser(null);
            }
        });

        return () => unsub();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const normalizedEmail = email.trim().toLowerCase();

        try {
            const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            const token = await getIdTokenResult(cred.user, true);
            const isAdmin = Boolean((token.claims as any)?.admin);

            if (!isAdmin) {
                await signOut(auth);
                return false;
            }

            setIsAuthenticated(true);
            setUser({ email: normalizedEmail });
            return true;
        } catch {
            return false;
        }
    };

    const registerAdmin = async (
        email: string,
        password: string,
        name?: string
    ): Promise<{ success: boolean; error?: string }> => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            return { success: false, error: "Email and password are required." };
        }
        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters." };
        }

        try {
            await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            return { success: true };
        } catch (e: any) {
            const msg = typeof e?.message === "string" ? e.message : "Could not create account.";
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        void signOut(auth);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, registerAdmin, user }}>
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

