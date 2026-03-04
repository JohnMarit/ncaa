import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@ncatwiceast.org";
const ADMIN_PASSWORD_HINT = "@Nyancitarialbeek143#";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app this would call your auth backend or Firebase to send a reset email.
      // For this demo, we surface the current admin demo credentials in a professional way.
      if (trimmedEmail === ADMIN_EMAIL) {
        toast({
          title: "Admin access reminder",
          description:
            "For now, the admin dashboard uses demo credentials. Use the email admin@ncatwiceast.org with the current admin password shown on the login page.",
        });
      } else {
        toast({
          title: "If this account exists…",
          description:
            "If an account exists for this email, password reset instructions will be sent. For additional help, contact info@ncaa.org.ss.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-heading text-3xl font-bold">
              Reset your password
            </h1>
            <p className="text-muted-foreground">
              Enter the email associated with your admin account.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Admin email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ncatwiceast.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing…" : "Send reset instructions"}
              </Button>
            </form>

            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <p>
                For the current demo setup, the admin login uses a fixed email
                address. If you&apos;re the site owner, you can later wire this
                page to your real authentication provider (Firebase, custom API,
                etc.).
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

