import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminData } from "@/contexts/AdminDataContext";

const Partner = () => {
  const { submitContactMessage } = useAdminData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email and partnership message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name,
        email,
        subject: `Partnership enquiry${organisation ? ` from ${organisation}` : ""}`,
        message,
      });
      setSuccess("Thank you for reaching out. An NCAA admin will follow up with you soon.");
      setName("");
      setEmail("");
      setOrganisation("");
      setMessage("");
    } catch {
      setError("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center text-primary-foreground">
              <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                Partner with NCAA
              </h1>
              <p className="text-sm md:text-base text-primary-foreground/90">
                Share a few details about yourself or your organisation and how you would
                like to partner with NCAA. An admin will review your note and get back to you.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container">
            <div className="mx-auto max-w-2xl rounded-xl border bg-card px-4 py-6 shadow-sm md:px-8 md:py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Your Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.org"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Organisation (optional)
                  </label>
                  <Input
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="School, NGO, church, company, etc."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    How would you like to partner with NCAA?
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Share how you would like to support girls in Twic East (e.g. scholarships, mentorship, vocational training, in‑kind support)."
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm font-medium text-emerald-600">
                    {success}
                  </p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? "Sending…" : "Submit partnership interest"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partner;

