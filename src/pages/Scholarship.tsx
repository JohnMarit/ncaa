import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, BookOpen, Award, Users, Heart, CheckCircle, FileText, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAdminData } from "@/contexts/AdminDataContext";

const Scholarship = () => {
    const { scholarships } = useAdminData();
    const scholarshipPrograms = [
        {
            title: "Primary School Scholarship",
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500",
            description: "Supporting young learners in their foundational education journey",
            eligibility: [
                "Child of NCAA member in good standing",
                "Currently enrolled in primary school (P1-P8)",
                "Demonstrated financial need",
                "Maintaining satisfactory academic performance"
            ],
            coverage: [
                "School fees and tuition",
                "Required textbooks and learning materials",
                "School uniform",
                "Examination fees"
            ]
        },
        {
            title: "Secondary School Scholarship",
            icon: GraduationCap,
            color: "from-purple-500 to-pink-500",
            description: "Empowering students to complete their secondary education",
            eligibility: [
                "Child of NCAA member in good standing",
                "Currently enrolled in secondary school (S1-S4)",
                "Demonstrated financial need",
                "Minimum average of 60% in previous academic year"
            ],
            coverage: [
                "Full or partial school fees",
                "Required textbooks and materials",
                "School uniform",
                "Examination fees (including national exams)"
            ]
        },
        {
            title: "TEYA Vocational Institute Scholarship",
            icon: Award,
            color: "from-orange-500 to-red-500",
            description: "Investing in practical skills and vocational training",
            eligibility: [
                "NCAA member or child of member",
                "Accepted or enrolled at TEYA Vocational Institute",
                "Demonstrated commitment to vocational training",
                "Demonstrated financial need"
            ],
            coverage: [
                "Training fees",
                "Required tools and materials",
                "Workshop supplies",
                "Certification fees"
            ]
        }
    ];

    const applicationProcess = [
        {
            step: "1",
            title: "Review Eligibility",
            description: "Ensure you meet all eligibility criteria for your desired scholarship program"
        },
        {
            step: "2",
            title: "Prepare Documents",
            description: "Gather required documents including academic records, proof of enrollment, and financial need documentation"
        },
        {
            step: "3",
            title: "Submit Application",
            description: "Complete and submit the scholarship application form before the deadline"
        },
        {
            step: "4",
            title: "Review Process",
            description: "Applications are reviewed by the Education Committee and Executive Board"
        },
        {
            step: "5",
            title: "Notification",
            description: "Successful applicants will be notified and awarded scholarships"
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
                                <div className="rounded-full bg-primary/10 p-4">
                                    <GraduationCap className="h-12 w-12 text-primary md:h-16 md:w-16" />
                                </div>
                            </div>
                            <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
                                NCAA Scholarship Programs
                            </h1>
                            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                                Investing in education, empowering our community's future leaders
                            </p>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="py-12 md:py-16">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Heart className="h-6 w-6 text-primary" />
                                        Our Commitment to Education
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        The Nyan Cit Arialbeek Association (NCAA) is dedicated to ensuring that financial
                                        constraints do not prevent our members' children from accessing quality education.
                                        Through our scholarship programs, we provide financial support for primary education,
                                        secondary education, and vocational training at TEYA Vocational Institute.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Admin-created scholarship posts */}
                {scholarships.length > 0 && (
                    <section className="py-12 md:py-16 bg-muted/30">
                        <div className="container">
                            <div className="mx-auto max-w-6xl">
                                <div className="mb-8 text-center">
                                    <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                                        Current Scholarship Opportunities
                                    </h2>
                                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                        Apply using the link below each opportunity.
                                    </p>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {scholarships.map((s) => (
                                        <Card key={s.id} className="flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="text-xl">{s.title}</CardTitle>
                                                <CardDescription className="line-clamp-3">{s.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-auto pt-0">
                                                <Button asChild className="w-full sm:w-auto">
                                                    <a href={s.applicationLink} target="_blank" rel="noopener noreferrer">
                                                        Apply for this scholarship <ExternalLink className="ml-2 h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Scholarship Programs Section */}
                <section className="py-12 md:py-20">
                    <div className="container">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                                    Available Scholarship Programs
                                </h2>
                                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                    Choose the program that matches your educational needs
                                </p>
                            </div>

                            <div className="space-y-8">
                                {scholarshipPrograms.map((program, index) => {
                                    const Icon = program.icon;
                                    return (
                                        <Card key={index} className="overflow-hidden">
                                            <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                                            <CardHeader>
                                                <div className="flex items-start gap-4">
                                                    <div className={`rounded-lg bg-gradient-to-br ${program.color} p-3`}>
                                                        <Icon className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-2xl">{program.title}</CardTitle>
                                                        <CardDescription className="mt-2 text-base">
                                                            {program.description}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div>
                                                        <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                                            <Users className="h-5 w-5 text-primary" />
                                                            Eligibility Requirements
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {program.eligibility.map((item, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                                            <Award className="h-5 w-5 text-primary" />
                                                            Scholarship Coverage
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {program.coverage.map((item, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Process Section */}
                <section className="bg-muted/30 py-12 md:py-20">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                                    Application Process
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Follow these steps to apply for a scholarship
                                </p>
                            </div>

                            <div className="space-y-6">
                                {applicationProcess.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-heading text-xl font-bold">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Required Documents Section */}
                <section className="py-12 md:py-20">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <FileText className="h-6 w-6 text-primary" />
                                        Required Documents
                                    </CardTitle>
                                    <CardDescription>
                                        Please prepare the following documents for your scholarship application
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Completed scholarship application form</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Proof of NCAA membership (parent or applicant)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Recent academic transcript or report card</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Letter of acceptance or current enrollment confirmation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Financial need statement or supporting documentation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                            <span>Two letters of recommendation (for secondary and vocational scholarships)</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Important Dates Section */}
                <section className="bg-muted/30 py-12 md:py-16">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <Card className="border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Calendar className="h-6 w-6 text-primary" />
                                        Important Dates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between border-b border-border pb-3">
                                            <span className="font-semibold">Application Opens:</span>
                                            <span className="text-muted-foreground">January 1st (Annually)</span>
                                        </div>
                                        <div className="flex items-start justify-between border-b border-border pb-3">
                                            <span className="font-semibold">Application Deadline:</span>
                                            <span className="text-muted-foreground">March 31st (Annually)</span>
                                        </div>
                                        <div className="flex items-start justify-between border-b border-border pb-3">
                                            <span className="font-semibold">Review Period:</span>
                                            <span className="text-muted-foreground">April 1st - April 30th</span>
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <span className="font-semibold">Award Notification:</span>
                                            <span className="text-muted-foreground">May 15th</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-20">
                    <div className="container">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                                Ready to Apply?
                            </h2>
                            <p className="mb-8 text-lg text-muted-foreground">
                                Submit your scholarship application online or contact us for more information
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button size="lg" asChild className="w-full sm:w-auto">
                                    <Link to="/scholarship/apply">Apply Online Now</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                                    <Link to="/contact">Contact Us</Link>
                                </Button>
                            </div>
                            <p className="mt-6 text-sm text-muted-foreground">
                                For inquiries: info@ncaa.org.ss
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Not an NCAA member yet?{" "}
                                <Link to="/membership" className="text-primary hover:underline">
                                    Join our community
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Scholarship;
