import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, Download, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Regulations = () => {
    const regulationChapters = [
        {
            chapter: "Chapter One: Name and Legal Status",
            sections: [
                {
                    title: "Title and Commencement",
                    content: "These Regulations shall be cited as the NYAN CIT ARIALBEEK Regulations and shall come into force upon approval by the General Assembly."
                },
                {
                    title: "Purpose",
                    content: "The purpose of these Regulations is to establish the organization's objectives, governance structures, functions, duties and rights of members."
                },
                {
                    title: "Registered Office",
                    content: "The Registered Office of Nyan Cit Arialbeek shall be situated in Juba, Central Equatoria State."
                }
            ]
        },
        {
            chapter: "Chapter Two: Aims and Objectives",
            sections: [
                {
                    title: "Primary Objectives",
                    content: "Promotion of peace, health, development for the improvement and advancement of members, upholding principles of peace, dialogue, reconciliation, transparency, accountability and integrity."
                },
                {
                    title: "Educational Goals",
                    content: "Solicit scholarships for girls who excel at all levels of education, encourage girls to join educational institutions, and provide proper enlightenment on socio-economic and political issues."
                },
                {
                    title: "Cultural Preservation",
                    content: "Promote social cohesion and preserve the rich cultural heritage through music, poetry, wrestling, peace building conferences, and public debates."
                }
            ]
        },
        {
            chapter: "Chapter Three: Membership",
            sections: [
                {
                    title: "Membership Categories",
                    content: "Full membership for girls from Twic East County aged 18 and above. Associate membership for supporters and friends of NCAA with endorsement by two full members."
                },
                {
                    title: "Rights and Privileges",
                    content: "Members have voting rights, eligibility to hold office, access to welfare support, educational scholarship opportunities, and participation in all NCAA events and programs."
                },
                {
                    title: "Obligations",
                    content: "Members must pay annual dues, attend meetings, uphold NCAA values, and actively participate in community development activities."
                }
            ]
        },
        {
            chapter: "Chapter Four: Organizational Structure",
            sections: [
                {
                    title: "General Assembly",
                    content: "The supreme and legislative organ of Nyan Cit Arialbeek, comprising all registered members with powers to elect leadership and approve major decisions."
                },
                {
                    title: "Executive Committee",
                    content: "Consists of 13 elected officers including Chairlady, Deputy Chairlady, Secretary General, Finance Secretary, and specialized secretaries for various portfolios."
                },
                {
                    title: "Council",
                    content: "The third organ of NCAA with functions defined in the regulations, providing advisory and oversight roles."
                }
            ]
        },
        {
            chapter: "Chapter Five: Financial Provisions",
            sections: [
                {
                    title: "Financial Year",
                    content: "The financial year runs from January 1st to December 31st annually."
                },
                {
                    title: "Sources of Funds",
                    content: "Membership dues, donations, fundraising events, grants, and other lawful sources approved by the General Assembly."
                },
                {
                    title: "Financial Management",
                    content: "Transparent accounting practices, regular financial reports to members, and annual audits by qualified auditors."
                }
            ]
        },
        {
            chapter: "Chapter Six: Elections",
            sections: [
                {
                    title: "Electoral Process",
                    content: "Free, fair, and transparent elections conducted every two (2) years. Independent Electoral Committee oversees nominations, campaigns, voting, and results announcement."
                },
                {
                    title: "Eligibility",
                    content: "All full members in good standing are eligible to vote and stand for election. Secret ballot ensures member privacy and freedom of choice."
                },
                {
                    title: "Tenure of Office",
                    content: "Elected officials serve a term of two (2) years and are eligible for re-election after the expiry of their first term."
                }
            ]
        },
        {
            chapter: "Chapter Seven: Miscellaneous Provisions",
            sections: [
                {
                    title: "Amendment Process",
                    content: "Regulations may be amended by two-thirds majority of General Assembly members present. Proposed amendments must be published one month prior to voting."
                },
                {
                    title: "Official Languages",
                    content: "The official languages of Nyan Cit Arialbeek are Dinka, English, and Arabic."
                },
                {
                    title: "Dissolution",
                    content: "The organization shall not be dissolved except by two-thirds majority vote of registered members at a General Assembly meeting."
                }
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
                                NCAA Regulations 2024
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Official regulations governing the operations of Nyan Cit Arialbeek
                            </p>
                        </div>
                    </div>
                </section>

                {/* Document Information */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            {/* Document Info Card */}
                            <div className="mb-12 rounded-xl border border-border bg-muted/50 p-8">
                                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="mb-2 font-heading text-2xl font-bold">
                                            Nyan Cit Arialbeek Regulations
                                        </h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Adopted: January 5, 2024
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4" />
                                                Status: Active
                                            </span>
                                        </div>
                                    </div>
                                    <Button>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download PDF
                                    </Button>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    These regulations were passed and adopted by the General Assembly in meeting 
                                    No. 2/2024 dated 5th of January, 2024. They supersede all previous constitutions, 
                                    by-laws, and provisional orders, establishing comprehensive guidelines for the 
                                    organization's governance, membership, operations, and elections.
                                </p>
                            </div>

                            {/* Regulations Content */}
                            <Accordion type="single" collapsible className="space-y-4">
                                {regulationChapters.map((chapter, chapterIndex) => (
                                    <AccordionItem 
                                        key={chapterIndex} 
                                        value={`chapter-${chapterIndex}`}
                                        className="rounded-xl border border-border bg-card shadow-sm"
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <span className="font-heading text-lg font-bold text-left">
                                                {chapter.chapter}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4">
                                            <div className="space-y-4">
                                                {chapter.sections.map((section, sectionIndex) => (
                                                    <div key={sectionIndex} className="rounded-lg bg-muted/50 p-4">
                                                        <h4 className="mb-2 font-semibold">
                                                            {section.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {section.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            {/* Certification */}
                            <div className="mt-12 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                                <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                                    Official Certification
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed">
                                    I hereby certify that Twic East Youth Nyan Cit Arialbeek has passed and adopted 
                                    the amendments to Twic East Youth Nyan Cit Arialbeek's Regulations, 2024 in its 
                                    General Assembly's meeting No. 2/2024 dated 5th of January, 2024.
                                </p>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-semibold">Moulana Korenilo Ajang Duot</p>
                                        <p className="text-muted-foreground">
                                            Chairman of the Regulations Review Committee
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-primary/20">
                                        <p className="font-semibold">Adau Ajok Kuer</p>
                                        <p className="text-muted-foreground">
                                            Chairlady, Nyan Cit Arialbeek
                                        </p>
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

export default Regulations;

