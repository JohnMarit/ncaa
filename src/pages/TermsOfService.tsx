import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, CheckCircle, AlertTriangle, Scale, Users, XCircle } from "lucide-react";

const TermsOfService = () => {
    const lastUpdated = "January 5, 2024";

    const termsSections = [
        {
            icon: Users,
            title: "Acceptance of Terms",
            content: "By accessing and using the Nyan Cit Arialbeek (NCAA) website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, members, and others who access or use our services."
        },
        {
            icon: CheckCircle,
            title: "Membership Terms",
            content: "Membership in NCAA is subject to approval by the Executive Committee. Members must be women from Twic East County aged 18 and above, pay annual membership dues, and commit to NCAA values and objectives as outlined in our Constitution and Regulations. Members are expected to participate in good faith and contribute positively to the community."
        },
        {
            icon: FileText,
            title: "Use of Services",
            content: "You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that could damage, disable, overburden, or impair our systems, or interfere with any other party's use of the services. Unauthorized access attempts are strictly prohibited."
        },
        {
            icon: Scale,
            title: "Intellectual Property",
            content: "All content on the NCAA website, including text, graphics, logos, images, and software, is the property of NCAA or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission."
        },
        {
            icon: AlertTriangle,
            title: "User Conduct",
            content: "Members and users must conduct themselves respectfully and professionally. Harassment, discrimination, hate speech, or any form of abusive behavior will not be tolerated. We reserve the right to suspend or terminate access to our services for violations of this policy or other inappropriate conduct."
        },
        {
            icon: XCircle,
            title: "Limitation of Liability",
            content: "NCAA and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. This includes, but is not limited to, damages for loss of profits, data, or other intangibles."
        }
    ];

    const additionalTerms = [
        {
            title: "Payment Terms",
            points: [
                "All membership dues and payments are non-refundable unless otherwise stated",
                "Members are responsible for ensuring timely payment of dues",
                "Failure to pay dues may result in suspension of membership privileges",
                "We accept payments via mobile money, bank transfer, and other approved methods"
            ]
        },
        {
            title: "Privacy and Data Protection",
            points: [
                "Your use of our services is also governed by our Privacy Policy",
                "We collect and process personal data in accordance with applicable laws",
                "Members have the right to access, correct, or delete their personal information",
                "We implement appropriate security measures to protect your data"
            ]
        },
        {
            title: "Event Participation",
            points: [
                "Event registration is subject to availability and may require payment",
                "Attendees must comply with event rules and code of conduct",
                "NCAA reserves the right to refuse entry or remove attendees for misconduct",
                "Photos and videos may be taken at events for promotional purposes"
            ]
        },
        {
            title: "Amendments and Modifications",
            points: [
                "We reserve the right to modify these Terms at any time",
                "Members will be notified of material changes via email or website notice",
                "Continued use of services after changes constitutes acceptance",
                "It is your responsibility to review these Terms periodically"
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
                                    <FileText className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Terms of Service
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Guidelines and conditions for using NCAA services
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
                                    Welcome to Nyan Cit Arialbeek (NCAA). These Terms of Service ("Terms") govern 
                                    your access to and use of our website, services, and programs. Please read these 
                                    Terms carefully before using our services.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Last Updated:</strong> {lastUpdated}
                                </p>
                            </div>

                            {/* Main Terms Sections */}
                            <div className="space-y-6">
                                {termsSections.map((section, index) => {
                                    const Icon = section.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-border bg-card p-6 shadow-sm"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="mb-3 font-heading text-xl font-bold">
                                                        {section.title}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {section.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Additional Terms */}
                            <div className="mt-12 space-y-6">
                                {additionalTerms.map((term, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-border bg-card p-6"
                                    >
                                        <h3 className="mb-4 font-heading text-lg font-bold">
                                            {term.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {term.points.map((point, pointIndex) => (
                                                <li key={pointIndex} className="flex items-start gap-2">
                                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {point}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Dispute Resolution */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Dispute Resolution</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Any disputes arising from these Terms or your use of our services shall be 
                                    resolved through good faith negotiation. If a resolution cannot be reached, 
                                    disputes shall be handled in accordance with the dispute resolution procedures 
                                    outlined in the NCAA Constitution and Regulations. The laws of South Sudan shall 
                                    govern these Terms.
                                </p>
                            </div>

                            {/* Severability */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Severability</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    If any provision of these Terms is found to be unenforceable or invalid, that 
                                    provision shall be limited or eliminated to the minimum extent necessary so that 
                                    these Terms shall otherwise remain in full force and effect and enforceable.
                                </p>
                            </div>

                            {/* Entire Agreement */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">Entire Agreement</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    These Terms, together with our Privacy Policy and any other legal notices 
                                    published by NCAA, constitute the entire agreement between you and NCAA concerning 
                                    your use of our services. No waiver of any term shall be deemed a further or 
                                    continuing waiver of such term or any other term.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-12 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                                <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                                    Questions About These Terms?
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed">
                                    If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;

