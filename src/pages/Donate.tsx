import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, CreditCard, Shield, CheckCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Donate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [donorPhone, setDonorPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("paystack");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const amountInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const refFromQuery = params.get("reference")?.trim();
        let refFromSession: string | null = null;
        try {
            refFromSession = sessionStorage.getItem("paystack_reference");
        } catch {
        }

        const reference = refFromQuery || refFromSession || "";
        if (!reference) {
            return;
        }

        if (refFromQuery) {
            params.delete("reference");
            const search = params.toString();
            navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
        }

        try {
            sessionStorage.removeItem("paystack_reference");
        } catch {
        }

        setAmount("");
        setDonorName("");
        setDonorEmail("");
        setDonorPhone("");

        toast({
            title: "Donation completed",
            description: `Reference: ${reference}`,
        });

        navigate("/");
    }, [location.pathname, location.search, navigate, toast]);

    const initializePaystackAndRedirect = async (args: {
        amount: number;
        email: string;
        name: string;
        phone?: string;
        currency: "USD";
    }) => {
        setIsProcessing(true);
        try {
            const resp = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args),
            });

            const data = await resp.json().catch(() => null);
            if (!resp.ok) {
                toast({
                    title: "Payment setup failed",
                    description: data?.error ?? "Unable to initialize Paystack transaction.",
                    variant: "destructive",
                });
                return;
            }

            const authorizationUrl = data?.authorization_url as string | undefined;
            const reference = data?.reference as string | undefined;

            if (!authorizationUrl) {
                toast({
                    title: "Payment setup failed",
                    description: "Missing Paystack authorization URL.",
                    variant: "destructive",
                });
                return;
            }

            if (reference) {
                try {
                    sessionStorage.setItem("paystack_reference", reference);
                } catch {
                }
            }

            window.location.assign(authorizationUrl);
        } catch (e: any) {
            toast({
                title: "Payment setup failed",
                description: e?.message ?? "Network error.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const donationAmount = amount.replace(/,/g, "");
        const numericAmount = parseFloat(donationAmount);

        if (!donationAmount || isNaN(numericAmount) || numericAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid donation amount.",
                variant: "destructive",
            });
            return;
        }

        // Validate email
        if (!donorEmail || !donorEmail.includes("@")) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        // Validate name
        if (!donorName.trim()) {
            toast({
                title: "Name Required",
                description: "Please enter your full name.",
                variant: "destructive",
            });
            return;
        }

        // Handle Paystack payment
        if (paymentMethod === "paystack") {
            await initializePaystackAndRedirect({
                amount: numericAmount,
                email: donorEmail,
                name: donorName,
                phone: donorPhone || undefined,
                currency: "USD",
            });
            return;
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
                            <div className="mb-6 flex justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10">
                                    <Heart className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Support NCAA
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Your donation helps empower girls from Twic East through education, welfare, and community development
                            </p>
                        </div>
                    </div>
                </section>

                {/* Donation Form Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
                            {/* Donation Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gift className="h-5 w-5" />
                                            Make a Donation
                                        </CardTitle>
                                        <CardDescription>
                                            Fill in the details below to make your contribution
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Donation Amount */}
                                            <div className="space-y-4">
                                                <Label className="text-base font-semibold">Donation Amount *</Label>
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-2">
                                                        <Label htmlFor="donationAmount">Amount (USD)</Label>
                                                        <Input
                                                            id="donationAmount"
                                                            ref={amountInputRef}
                                                            type="text"
                                                            placeholder="Enter amount"
                                                            value={amount}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/[^\d.,]/g, "");
                                                                setAmount(value);
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Donor Information */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Your Information</h3>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="donorName">Full Name *</Label>
                                                        <Input
                                                            id="donorName"
                                                            placeholder="Your name"
                                                            value={donorName}
                                                            onChange={(e) => setDonorName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="donorEmail">Email *</Label>
                                                        <Input
                                                            id="donorEmail"
                                                            type="email"
                                                            placeholder="your.email@example.com"
                                                            value={donorEmail}
                                                            onChange={(e) => setDonorEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="donorPhone">Phone Number</Label>
                                                    <Input
                                                        id="donorPhone"
                                                        type="tel"
                                                        placeholder="+211 920 287 970"
                                                        value={donorPhone}
                                                        onChange={(e) => setDonorPhone(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Payment Method */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Payment Method *</h3>
                                                <RadioGroup value={paymentMethod} onValueChange={(value) => {
                                                    setPaymentMethod(value);
                                                }}>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-2 rounded-lg border border-border bg-card p-4">
                                                            <RadioGroupItem value="paystack" id="paystack" />
                                                            <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                                                                <div className="flex items-center gap-2">
                                                                    <CreditCard className="h-5 w-5" />
                                                                    <span className="font-medium">Card</span>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>

                                                {paymentMethod === "paystack" && (
                                                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                                        <p className="text-sm text-muted-foreground">
                                                            You will be redirected to Paystack&apos;s secure checkout to complete your donation.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                                                {isProcessing ? (
                                                    "Redirecting..."
                                                ) : (
                                                    <>
                                                        <Heart className="mr-2 h-5 w-5" />
                                                        Donate with Card
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Impact Card */}
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Your Impact</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-sm">Education Support</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Scholarships for girls' education
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-sm">Welfare Programs</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Support during emergencies and bereavement
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-sm">Community Development</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Building stronger communities together
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Security Card */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">Secure Donation</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                SSL encrypted transactions
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                Your information is protected
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                Transparent use of funds
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Contact Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Questions?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Have questions about donating? Contact us:
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Email:</strong> info@ncaa.org.ss</p>
                                            <p><strong>Phone:</strong> +211 920 287 970</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Donate;

