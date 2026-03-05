import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const STORAGE_KEY_ADMIN_USERS = "nca_admin_users";

/** Stored admin account (created via Create Account on login page). */
interface StoredAdmin {
    email: string;
    password: string;
    name?: string;
}

function getStoredAdmins(): StoredAdmin[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as StoredAdmin[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveStoredAdmins(admins: StoredAdmin[]) {
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(admins));
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    registerAdmin: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Built-in demo admin (fallback). */
const DEMO_ADMIN = {
    email: "admin@ncatwiceast.org",
    password: "@Nyancitarialbeek143#",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const storedAuth = localStorage.getItem("nca_admin_auth");
        const storedUser = localStorage.getItem("nca_admin_user");

        if (storedAuth === "true" && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const normalizedEmail = email.trim().toLowerCase();
        const pwd = password;

        // 1) Check built-in demo admin
        if (normalizedEmail === DEMO_ADMIN.email && pwd === DEMO_ADMIN.password) {
            setIsAuthenticated(true);
            setUser({ email: normalizedEmail });
            localStorage.setItem("nca_admin_auth", "true");
            localStorage.setItem("nca_admin_user", JSON.stringify({ email: normalizedEmail }));
            return true;
        }

        // 2) Check admins created via "Create an account"
        const admins = getStoredAdmins();
        const match = admins.find(
            (a) => a.email.trim().toLowerCase() === normalizedEmail && a.password === pwd
        );
        if (match) {
            setIsAuthenticated(true);
            setUser({ email: normalizedEmail });
            localStorage.setItem("nca_admin_auth", "true");
            localStorage.setItem("nca_admin_user", JSON.stringify({ email: normalizedEmail }));
            return true;
        }

        return false;
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

        const admins = getStoredAdmins();
        if (admins.some((a) => a.email.trim().toLowerCase() === normalizedEmail)) {
            return { success: false, error: "An account with this email already exists." };
        }

        admins.push({ email: normalizedEmail, password, name });
        saveStoredAdmins(admins);
        return { success: true };
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("nca_admin_auth");
        localStorage.removeItem("nca_admin_user");
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

