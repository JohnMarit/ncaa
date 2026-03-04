import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, CreditCard, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { membershipTiers } from "@/data/membership";
import { useToast } from "@/hooks/use-toast";

const Membership = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        payam: "",
        membershipType: "",
        termsAccepted: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || 
            !formData.phone || !formData.payam || !formData.membershipType || 
            !formData.termsAccepted) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields and accept the terms and conditions.",
                variant: "destructive",
            });
            return;
        }

        // Calculate amount based on membership type
        const amount = formData.membershipType === "regular" ? 15000 : 50000;
        const currency = "SSP";
        const memberName = `${formData.firstName} ${formData.lastName}`;

        // Navigate to payment page with form data
        navigate("/membership/payment", {
            state: {
                membershipType: formData.membershipType === "regular" ? "Regular Member" : "Executive Member",
                amount: amount,
                currency: currency,
                memberName: memberName,
                memberEmail: formData.email,
                memberPhone: formData.phone,
                firstName: formData.firstName,
                lastName: formData.lastName,
                payam: formData.payam,
            },
        });
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
                                Join NCAA
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Become part of our community and help empower girls from Twic East
                            </p>
                        </div>
                    </div>
                </section>

                {/* Membership Tiers */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <h2 className="mb-12 text-center font-heading text-3xl font-bold md:text-4xl">
                            Membership Options
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                            {membershipTiers.map((tier) => (
                                <div
                                    key={tier.name}
                                    className="rounded-xl border-2 border-border bg-card p-8 shadow-sm transition-all hover:border-primary"
                                >
                                    <div className="mb-6">
                                        <h3 className="mb-2 font-heading text-2xl font-bold">{tier.name}</h3>
                                        <p className="text-3xl font-bold text-primary">{tier.price}</p>
                                    </div>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Registration Form */}
                <section className="bg-muted/50 py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-2xl">
                            <h2 className="mb-8 text-center font-heading text-3xl font-bold">
                                Membership Application
                            </h2>
                            <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-heading text-xl font-semibold">Personal Information</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name *</Label>
                                                <Input 
                                                    id="firstName" 
                                                    required 
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name *</Label>
                                                <Input 
                                                    id="lastName" 
                                                    required 
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                required 
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input 
                                                id="phone" 
                                                type="tel" 
                                                required 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payam">Payam of Origin *</Label>
                                            <Select 
                                                value={formData.payam}
                                                onValueChange={(value) => setFormData({ ...formData, payam: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your Payam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ajuong">Ajuong Payam</SelectItem>
                                                    <SelectItem value="kongor">Kongor Payam</SelectItem>
                                                    <SelectItem value="lith">Lith Payam</SelectItem>
                                                    <SelectItem value="nyuak">Nyuak Payam</SelectItem>
                                                    <SelectItem value="pakeer">Pakeer Payam</SelectItem>
                                                    <SelectItem value="pawuoi">Pawuoi Payam</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Membership Type */}
                                    <div className="space-y-4">
                                        <h3 className="font-heading text-xl font-semibold">Membership Type</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="membershipType">Select Membership *</Label>
                                            <Select 
                                                value={formData.membershipType}
                                                onValueChange={(value) => setFormData({ ...formData, membershipType: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose membership tier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="regular">Regular Member (15,000 SSP/year)</SelectItem>
                                                    <SelectItem value="executive">Executive Member (50,000 SSP/year)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="flex items-start gap-2">
                                        <Checkbox 
                                            id="terms" 
                                            required 
                                            checked={formData.termsAccepted}
                                            onCheckedChange={(checked) => 
                                                setFormData({ ...formData, termsAccepted: checked as boolean })
                                            }
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm leading-relaxed text-muted-foreground"
                                        >
                                            I agree to the NCAA Constitution and regulations, and I understand
                                            that my application will be reviewed by the Executive Committee. *
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button type="submit" className="w-full" size="lg">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Submit Application & Proceed to Payment
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        Your application will be reviewed within 5-7 business days
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <h2 className="mb-12 text-center font-heading text-3xl font-bold md:text-4xl">
                            Why Join NCAA?
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Community</h3>
                                <p className="text-sm text-muted-foreground">
                                    Connect with 2,500+ girls from Twic East across the world
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Award className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Empowerment</h3>
                                <p className="text-sm text-muted-foreground">
                                    Access educational programs, welfare support, and leadership opportunities
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Check className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Governance</h3>
                                <p className="text-sm text-muted-foreground">
                                    Participate in transparent elections and democratic decision-making
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Membership;
