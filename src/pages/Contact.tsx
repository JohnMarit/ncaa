import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactInformation } from "@/data/contact";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useState } from "react";

const Contact = () => {
    const { submitContactMessage } = useAdminData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            setIsSubmitting(true);
            await submitContactMessage(data);
            setIsSuccess(true);
            form.reset();
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error("Failed to submit contact message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Contact Us
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Get in touch with the NCAA leadership team
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Form & Info Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="grid gap-12 lg:grid-cols-2">
                            {/* Contact Form */}
                            <div>
                                <h2 className="mb-6 font-heading text-2xl font-bold">Send us a Message</h2>
                                {isSuccess && (
                                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <p className="font-medium">Message sent successfully! We'll get back to you soon.</p>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" placeholder="Your name" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="your.email@example.com" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" name="subject" placeholder="What is this about?" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Your message..."
                                            rows={6}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                        <Send className="mr-2 h-4 w-4" />
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="mb-6 font-heading text-2xl font-bold">Contact Information</h2>
                                <div className="space-y-6">
                                    {contactInformation.map((contact, index) => {
                                        const Icon = contact.icon;
                                        return (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 font-semibold">{contact.title}</h3>
                                                    {contact.link ? (
                                                        <a
                                                            href={contact.link}
                                                            className="text-muted-foreground hover:text-primary"
                                                        >
                                                            {contact.value}
                                                        </a>
                                                    ) : (
                                                        <p className="text-muted-foreground">
                                                            {contact.value}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Leadership Contacts */}
                                <div className="mt-12">
                                    <h3 className="mb-4 font-heading text-xl font-semibold">Leadership Team</h3>
                                    <div className="space-y-4">
                                        <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="font-semibold">Office</h4>
                                            <p className="text-sm text-muted-foreground">info@ncaa.org.ss</p>
                                        </div>
                                        <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="font-semibold">Chairlady</h4>
                                            <p className="text-sm text-muted-foreground">chair@ncaa.org.ss</p>
                                        </div>
                                        <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="font-semibold">Secretary General</h4>
                                            <p className="text-sm text-muted-foreground">sec@ncaa.org.ss</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
