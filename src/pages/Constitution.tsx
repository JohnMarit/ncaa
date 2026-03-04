import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Constitution = () => {
    const constitutionSections = [
        {
            title: "Preamble",
            content: "We, the General Assembly of Nyan cit Arialbeek, shall be a girl(s) youth based body under the umbrella of Twic East Youth Nyan Cit Arialbeek in Juba (TEYA) and are hereby recalling back to the historical and cultural background and the general outlook of the Twic Community."
        },
        {
            title: "Vision Statement",
            content: "To innovate and invest in education, peaceful cohesion and unity of purpose as the leading girl(s) social activities of the NYAN CIT ARIALBEEK in the community."
        },
        {
            title: "Mission Statement",
            content: "To raise and strengthen girl(s) social activities for peace, cohesion, unity of purpose with the neighbours and beyond."
        },
        {
            title: "Name and Legal Status",
            content: "The organization shall be known as Nyan Cit Arialbeek (NCAA), a non-political, non-profit making body dedicated to educating and supporting girls from Twic East County."
        },
        {
            title: "Registered Office",
            content: "The Registered Office of the Nyan Cit Arialbeek shall be situated in Juba, Central Equatoria State, South Sudan."
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
                                    <BookOpen className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                NCAA Constitution
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                The foundational document governing Nyan Cit Arialbeek Association (NCAA)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Constitution Content */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            {/* Introduction */}
                            <div className="mb-12 rounded-xl border border-border bg-muted/50 p-8">
                                <h2 className="mb-4 font-heading text-2xl font-bold">
                                    About This Document
                                </h2>
                                <p className="mb-4 text-muted-foreground leading-relaxed">
                                    The Constitution of Twic East Youth Nyan Cit Arialbeek establishes the 
                                    framework for democratic governance, member rights, and organizational structure. 
                                    This living document guides our operations and ensures transparency, accountability, 
                                    and integrity in all our activities.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Full Constitution
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href="/documents/regulations">View Regulations</a>
                                    </Button>
                                </div>
                            </div>

                            {/* Constitution Sections */}
                            <div className="space-y-6">
                                {constitutionSections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="mb-3 flex items-start gap-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                <ChevronRight className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="mb-2 font-heading text-xl font-bold">
                                                    {section.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Key Principles */}
                            <div className="mt-12 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                                <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                                    Guiding Principles
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                                        <p className="text-sm">Democratic governance and transparent elections</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                                        <p className="text-sm">Equal rights and voting privileges for all members</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                                        <p className="text-sm">Accountability and financial transparency</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                                        <p className="text-sm">Unity, peace, and social cohesion</p>
                                    </div>
                                </div>
                            </div>

                            {/* Amendment Process */}
                            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">
                                    Constitutional Amendments
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    This Constitution may be amended by a two-thirds majority vote of the 
                                    General Assembly's registered members present at a duly convened meeting. 
                                    Proposed amendments must be published and made available to members at least 
                                    one month prior to the voting session.
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

export default Constitution;

