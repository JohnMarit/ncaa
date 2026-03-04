import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreditCard, Shield, CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Payments = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement payment processing
        console.log("Payment form submitted");
    };

    const membershipFees = [
        { type: "Regular Membership", amount: "15,000 SSP", period: "Annual", description: "Full voting rights and benefits" },
        { type: "Executive Membership", amount: "50,000 SSP", period: "Annual", description: "All Regular Member benefits plus executive committee eligibility" },
    ];

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
                                    <CreditCard className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Pay Membership Dues
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Support NCAA's mission through secure online payments
                            </p>
                        </div>
                    </div>
                </section>

                {/* Payment Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
                            {/* Membership Fees Info */}
                            <div className="space-y-6 lg:col-span-1">
                                <div>
                                    <h2 className="mb-4 font-heading text-2xl font-bold">
                                        Membership Fees
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your membership type and make secure payments online
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {membershipFees.map((fee, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{fee.type}</CardTitle>
                                                <CardDescription>{fee.period}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="mb-2 font-heading text-3xl font-bold text-primary">
                                                    {fee.amount}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {fee.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Security Info */}
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-base">Secure Payments</CardTitle>
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
                                                PCI-DSS compliant
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                Your data is protected
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Payment Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment Information</CardTitle>
                                        <CardDescription>
                                            Enter your payment details below
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Member Information */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Member Information</h3>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="firstName">First Name *</Label>
                                                        <Input id="firstName" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="lastName">Last Name *</Label>
                                                        <Input id="lastName" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email *</Label>
                                                    <Input id="email" type="email" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number *</Label>
                                                    <Input id="phone" type="tel" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="membershipType">Membership Type *</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select membership type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="regular">Regular Membership (15,000 SSP/year)</SelectItem>
                                                            <SelectItem value="executive">Executive Membership (50,000 SSP/year)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Payment Method */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Payment Method</h3>
                                                <div className="space-y-2">
                                                    <Label htmlFor="paymentMethod">Select Payment Method *</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choose payment method" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="mobile">Mobile Money</SelectItem>
                                                            <SelectItem value="bank">Bank Transfer</SelectItem>
                                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="rounded-lg border border-border bg-muted/50 p-4">
                                                    <h4 className="mb-2 font-semibold text-sm">Bank Transfer Details</h4>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <p><strong>Bank:</strong> Commercial Bank of South Sudan</p>
                                                        <p><strong>Account Name:</strong> Nyan Cit Arialbeek</p>
                                                        <p><strong>Account Number:</strong> 1234567890</p>
                                                        <p className="mt-2 text-xs">
                                                            Please use your name as the payment reference
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit */}
                                            <div className="flex flex-col gap-4">
                                                <Button type="submit" size="lg" className="w-full">
                                                    <DollarSign className="mr-2 h-5 w-5" />
                                                    Process Payment
                                                </Button>
                                                <p className="text-center text-xs text-muted-foreground">
                                                    By submitting this form, you agree to our payment terms and conditions
                                                </p>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Help Text */}
                                <div className="mt-6 rounded-lg border border-border bg-card p-6">
                                    <h3 className="mb-3 font-semibold">Need Help?</h3>
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        If you encounter any issues with payment processing, please contact our
                                        finance team at:
                                    </p>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Email:</strong> info@ncaa.org.ss</p>
                                        <p><strong>Phone:</strong> +211 920 287 970</p>
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

export default Payments;

