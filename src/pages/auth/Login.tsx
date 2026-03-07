import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// ── OTP length ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;
// ── Countdown duration in seconds ───────────────────────────────────────────
const OTP_TTL = 120;

const Login = () => {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { requestOtp, verifyOtp } = useAuth();

    const from = (location.state as { from?: string })?.from || "/admin";

    // ── Countdown timer ──────────────────────────────────────────────────────
    const startCountdown = () => {
        setCountdown(OTP_TTL);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const formatCountdown = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    // ── Step 1: send OTP ─────────────────────────────────────────────────────
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await requestOtp(email);
        setIsLoading(false);

        if (result.success) {
            setStep("otp");
            setOtpDigits(Array(OTP_LENGTH).fill(""));
            startCountdown();
            toast({ title: "Code sent!", description: `A 6-digit code was sent to ${email}` });
            // Focus first OTP box after render
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } else {
            setError(result.error ?? "Failed to send code.");
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    // ── Step 2: verify OTP ───────────────────────────────────────────────────
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const otp = otpDigits.join("");
        if (otp.length < OTP_LENGTH) {
            setError("Please enter all 6 digits.");
            return;
        }
        setIsLoading(true);
        const result = await verifyOtp(email, otp);
        setIsLoading(false);

        if (result.success) {
            toast({ title: "Login successful", description: "Welcome back!" });
            navigate(from, { replace: true });
        } else {
            setError(result.error ?? "Verification failed.");
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    // ── Resend code ──────────────────────────────────────────────────────────
    const handleResend = async () => {
        setError("");
        setIsLoading(true);
        const result = await requestOtp(email);
        setIsLoading(false);
        if (result.success) {
            setOtpDigits(Array(OTP_LENGTH).fill(""));
            startCountdown();
            toast({ title: "Code resent!", description: `A new code was sent to ${email}` });
        } else {
            setError(result.error ?? "Failed to resend code.");
        }
    };

    // ── OTP digit input handler ──────────────────────────────────────────────
    const handleOtpChange = (value: string, idx: number) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const updated = [...otpDigits];
        updated[idx] = digit;
        setOtpDigits(updated);
        if (digit && idx < OTP_LENGTH - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (text.length === OTP_LENGTH) {
            setOtpDigits(text.split(""));
            inputRefs.current[OTP_LENGTH - 1]?.focus();
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            {step === "email" ? (
                                <Mail className="h-7 w-7 text-primary" />
                            ) : (
                                <ShieldCheck className="h-7 w-7 text-primary" />
                            )}
                        </div>
                        <h1 className="mb-2 font-heading text-3xl font-bold">
                            {step === "email" ? "Admin Login" : "Enter Login Code"}
                        </h1>
                        <p className="text-muted-foreground">
                            {step === "email"
                                ? "Enter your admin email to receive a login code"
                                : `We sent a 6-digit code to ${email}`}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                        {/* ── STEP 1: Email ── */}
                        {step === "email" && (
                            <form onSubmit={handleSendCode} className="space-y-6">
                                {error && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Admin Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="johndoe@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        "Sending code..."
                                    ) : (
                                        <>
                                            Send Login Code
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* ── STEP 2: OTP ── */}
                        {step === "otp" && (
                            <form onSubmit={handleVerify} className="space-y-6">
                                {error && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                {/* OTP digit boxes */}
                                <div className="space-y-2">
                                    <Label>6-Digit Code</Label>
                                    <div className="flex gap-2 justify-center">
                                        {otpDigits.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => { inputRefs.current[idx] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                                onPaste={idx === 0 ? handleOtpPaste : undefined}
                                                className="w-11 h-14 text-center text-2xl font-bold rounded-lg border border-border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Countdown */}
                                {countdown > 0 ? (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Code expires in{" "}
                                        <span className={`font-mono font-semibold ${countdown <= 30 ? "text-destructive" : "text-primary"}`}>
                                            {formatCountdown(countdown)}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-center text-sm text-destructive font-medium">
                                        Code expired.
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || countdown === 0}
                                >
                                    {isLoading ? "Verifying..." : (
                                        <>
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Verify & Log In
                                        </>
                                    )}
                                </Button>

                                {/* Resend / back */}
                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={() => { setStep("email"); setError(""); }}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        ← Change email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Resend code
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Info box */}
                    <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Need help? Contact{" "}
                            <a href="mailto:info@ncaa.org.ss" className="text-primary hover:underline">
                                info@ncaa.org.ss
                            </a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
