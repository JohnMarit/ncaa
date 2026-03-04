import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, Heart, Target, Award } from "lucide-react";
import { aboutData } from "@/data/about";

const About = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                About NCAA
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Nyan Cit Arialbeek Association (NCAA)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="mb-8 text-center font-heading text-3xl font-bold md:text-4xl">
                                {aboutData.mission.heading}
                            </h2>
                            {aboutData.mission.paragraphs.map((paragraph, index) => (
                                <p 
                                    key={index} 
                                    className={`text-lg leading-relaxed text-muted-foreground ${index < aboutData.mission.paragraphs.length - 1 ? 'mb-6' : ''}`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-muted/50 py-16 md:py-24">
                    <div className="container">
                        <h2 className="mb-12 text-center font-heading text-3xl font-bold md:text-4xl">
                            Our Values
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-background p-6 text-center shadow-sm">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Unity</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bringing together girls from Twic East across the world
                                </p>
                            </div>
                            <div className="rounded-xl bg-background p-6 text-center shadow-sm">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Heart className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Support</h3>
                                <p className="text-sm text-muted-foreground">
                                    Caring for the welfare and wellbeing of our members
                                </p>
                            </div>
                            <div className="rounded-xl bg-background p-6 text-center shadow-sm">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Target className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Empowerment</h3>
                                <p className="text-sm text-muted-foreground">
                                    Championing education and opportunities for all
                                </p>
                            </div>
                            <div className="rounded-xl bg-background p-6 text-center shadow-sm">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Award className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold">Excellence</h3>
                                <p className="text-sm text-muted-foreground">
                                    Maintaining high standards in governance and service
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* History Section */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="mb-8 text-center font-heading text-3xl font-bold md:text-4xl">
                                Our History
                            </h2>
                            <div className="space-y-6">
                                <div className="rounded-lg border border-border bg-card p-6">
                                    <h3 className="mb-2 font-heading text-xl font-semibold">2023 - Foundation</h3>
                                    <p className="text-muted-foreground">
                                        NCAA was established to unite and empower girls from Twic East,
                                        creating a strong support network across South Sudan and the diaspora.
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-6">
                                    <h3 className="mb-2 font-heading text-xl font-semibold">Growth & Expansion</h3>
                                    <p className="text-muted-foreground">
                                        Over the years, we've grown to 2,500+ active members, established
                                        6 Payam chapters, and created robust governance structures to serve
                                        our community effectively.
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-6">
                                    <h3 className="mb-2 font-heading text-xl font-semibold">Today</h3>
                                    <p className="text-muted-foreground">
                                        NCAA continues to strengthen our community through transparent
                                        elections, educational programs, welfare support, and active
                                        engagement in the lives of our members.
                                    </p>
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

export default About;
