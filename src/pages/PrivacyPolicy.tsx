import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
    const lastUpdated = "January 5, 2024";

    const privacySections = [
        {
            icon: FileText,
            title: "Information We Collect",
            content: [
                "Personal identification information (name, email address, phone number, postal address)",
                "Membership details and payment information",
                "Event registration and attendance records",
                "Communication preferences and interaction history",
                "Technical data including IP address, browser type, and device information"
            ]
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: [
                "Process membership applications and maintain member records",
                "Facilitate payment processing for dues and contributions",
                "Send important communications about NCAA activities and events",
                "Improve our services and website functionality",
                "Comply with legal obligations and protect our rights"
            ]
        },
        {
            icon: Shield,
            title: "Information Protection",
            content: [
                "We implement appropriate security measures to protect your personal data",
                "Access to personal information is restricted to authorized personnel only",
                "We use SSL encryption for all data transmission",
                "Regular security audits and updates to our systems",
                "Secure storage of physical and digital records"
            ]
        },
        {
            icon: UserCheck,
            title: "Your Rights",
            content: [
                "Access your personal information and request corrections",
                "Request deletion of your data (subject to legal requirements)",
                "Opt-out of non-essential communications",
                "Object to processing of your data for specific purposes",
                "Lodge a complaint with relevant data protection authorities"
            ]
        },
        {
            icon: Eye,
            title: "Information Sharing",
            content: [
                "We do not sell, trade, or rent your personal information to third parties",
                "Information may be shared with service providers who assist our operations",
                "We may disclose information when required by law or to protect our rights",
                "Member directories may be shared within the NCAA community (with consent)",
                "Aggregate, anonymized data may be used for statistical purposes"
            ]
        },
        {
            icon: AlertCircle,
            title: "Cookies and Tracking",
            content: [
                "We use cookies to enhance your browsing experience",
                "Essential cookies are necessary for website functionality",
                "Analytics cookies help us understand how visitors use our site",
                "You can control cookie preferences through your browser settings",
                "Disabling cookies may affect certain website features"
            ]
        }
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
                                    <Shield className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Privacy Policy
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                How we collect, use, and protect your personal information
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            {/* Introduction */}
                            <div className="mb-12 rounded-xl border border-border bg-muted/50 p-8">
                                <p className="mb-4 text-muted-foreground leading-relaxed">
                                    Nyan Cit Arialbeek (NCAA) is committed to protecting your privacy and ensuring 
                                    the security of your personal information. This Privacy Policy explains how we 
                                    collect, use, disclose, and safeguard your information when you visit our website, 
                                    use our services, or interact with us as a member or supporter.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Last Updated:</strong> {lastUpdated}
                                </p>
                            </div>

                            {/* Privacy Sections */}
                            <div className="space-y-8">
                                {privacySections.map((section, index) => {
                                    const Icon = section.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                        >
                                            <div className="mb-4 flex items-start gap-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="mb-3 font-heading text-xl font-bold">
                                                        {section.title}
                                                    </h2>
                                                    <ul className="space-y-2">
                                                        {section.content.map((item, itemIndex) => (
                                                            <li key={itemIndex} className="flex items-start gap-2">
                                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                                                <span className="text-sm text-muted-foreground leading-relaxed">
                                                                    {item}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Data Retention */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Data Retention</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We retain your personal information for as long as necessary to fulfill the 
                                    purposes outlined in this Privacy Policy, unless a longer retention period is 
                                    required or permitted by law. When your information is no longer needed, we will 
                                    securely delete or anonymize it in accordance with our data retention policies.
                                </p>
                            </div>

                            {/* Third-Party Links */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Third-Party Links</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Our website may contain links to third-party websites. We are not responsible for 
                                    the privacy practices or content of these external sites. We encourage you to review 
                                    the privacy policies of any third-party sites you visit.
                                </p>
                            </div>

                            {/* Children's Privacy */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Children's Privacy</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Our services are intended for individuals aged 18 and above. We do not knowingly 
                                    collect personal information from children under 18. If you believe we have 
                                    inadvertently collected such information, please contact us immediately.
                                </p>
                            </div>

                            {/* Changes to Policy */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Changes to This Policy</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We may update this Privacy Policy from time to time to reflect changes in our 
                                    practices or legal requirements. We will notify members of any material changes 
                                    by email or through a prominent notice on our website. Your continued use of our 
                                    services after such modifications constitutes acceptance of the updated policy.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-12 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                                <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                                    Contact Us
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed">
                                    If you have questions about this Privacy Policy or wish to exercise your rights 
                                    regarding your personal information, please contact us:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> info@ncaa.org.ss</p>
                                    <p><strong>Phone:</strong> +211 920 287 970</p>
                                    <p><strong>Address:</strong> NCAA Hall, Juba, South Sudan</p>
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

export default PrivacyPolicy;

