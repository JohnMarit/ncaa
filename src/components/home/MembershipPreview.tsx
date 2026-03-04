import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { membershipTiers } from "@/data/membership";

export const MembershipPreview = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="container">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                        Join NCAA
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Become part of our community and help empower girls from Twic East
                    </p>
                </div>

                {/* Membership Tiers */}
                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-12">
                    {membershipTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className="rounded-xl border-2 border-border bg-card p-8 shadow-sm transition-all hover:border-primary hover:shadow-lg"
                        >
                            <div className="mb-6">
                                <h3 className="mb-2 font-heading text-2xl font-bold">{tier.name}</h3>
                                <p className="text-3xl font-bold text-primary">{tier.price}</p>
                            </div>
                            <ul className="space-y-3">
                                {tier.features.slice(0, 4).map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                <div className="flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="group"
                        aria-label="Learn more about membership"
                    >
                        <Link to="/membership">
                            See More
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

