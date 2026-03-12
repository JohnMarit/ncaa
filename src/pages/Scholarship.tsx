import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, Calendar, ExternalLink, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAdminData } from "@/contexts/AdminDataContext";

const Scholarship = () => {
    const { scholars, testimonials } = useAdminData();
    const displayScholars = scholars;
    const displayTestimonials = testimonials;

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

                {/* Stories Section (Scholars + Testimonials) */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="container">
                        <div className="mx-auto max-w-6xl space-y-12">
                            {displayScholars.length > 0 && (
                                <div>
                                    <div className="mb-6 text-center">
                                        <h2 className="mb-2 font-heading text-3xl font-bold md:text-4xl">
                                            Meet Our Scholars
                                    </h2>
                                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                            Girls whose education is being supported through the NCAA scholarship fund.
                                    </p>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {displayScholars.map((s) => {
                                            const fullStory = typeof s.story === "string" ? s.story : "";
                                            const firstParagraph = fullStory.split(/\n{2,}/)[0] ?? "";
                                            const preview = firstParagraph.slice(0, 160);
                                            const showEllipsis = fullStory.length > preview.length;

                                            return (
                                                <Card
                                                    key={s.id}
                                                    className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                                                >
                                                    <div className="relative aspect-square w-20 sm:w-24 md:w-28 max-w-[112px] bg-muted rounded-xl overflow-hidden">
                                                        {s.photoUrl ? (
                                                            <img
                                                                src={s.photoUrl}
                                                                alt={s.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/20 to-primary/10 text-2xl font-bold text-primary">
                                                                {s.name
                                                                    .split(" ")
                                                                    .map((part) => part[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                        </div>
                                                        )}
                                                    </div>
                                                    <div className="text-center space-y-1">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {s.name}
                                                        </p>
                                                        {s.tagline && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {s.tagline}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {preview && (
                                                        <p className="text-[11px] leading-relaxed text-muted-foreground text-center line-clamp-3">
                                                            {preview}
                                                            {showEllipsis && "…"}
                                                        </p>
                                                    )}
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-1 h-8 px-3 text-xs"
                                                    >
                                                        <Link to={`/scholarship/scholar/${s.id}`}>
                                                            Read my story <ExternalLink className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </Card>
                                            );
                                        })}
                                                </div>

                                    {/* Full stories list */}
                                    <div className="mt-10 space-y-8">
                                        <h3 className="text-center font-heading text-2xl font-bold md:text-3xl">
                                            Full Stories
                                        </h3>
                                        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
                                            Take a moment to read how the scholarship is changing each girl&apos;s life in her
                                            own words.
                                        </p>
                                        <div className="space-y-6">
                                            {displayScholars.map((s) => {
                                                const rawStory = typeof s.story === "string" ? s.story : "";
                                                const paragraphs = rawStory
                                                    .split(/\n{2,}/)
                                                    .map((p) => p.trim())
                                                    .filter((p) => p.length > 0);

                                                return (
                                                    <Card key={`full-${s.id}`} className="border-border/80 bg-card/80">
                                                        <CardHeader>
                                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                                    <CardTitle className="text-xl md:text-2xl">
                                                                        {s.name}
                                                                    </CardTitle>
                                                                    {s.tagline && (
                                                                        <CardDescription>{s.tagline}</CardDescription>
                                                                    )}
                                                    </div>
                                                </div>
                                                        </CardHeader>
                                                        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                                                            {paragraphs.length === 0 ? (
                                                                <p>No story has been added yet.</p>
                                                            ) : (
                                                                paragraphs.map((p, idx) => (
                                                                    <p key={idx}>{p}</p>
                                                                ))
                                                            )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                            )}

                            {displayTestimonials.length > 0 && (
                                <div>
                                    <div className="mb-6 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                                <Quote className="h-4 w-4" />
                                                The Impact your Support Creates
                                            </p>
                                            <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                                                Voices from girls, parents &amp; community
                                </h2>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {displayTestimonials.map((t) => (
                                            <Card key={t.id} className="h-full border-border/70 bg-card/80">
                                                <CardContent className="flex h-full flex-col gap-3 p-5">
                                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                                        &ldquo;{t.quote}&rdquo;
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        {t.photoUrl ? (
                                                            <img
                                                                src={t.photoUrl}
                                                                alt={t.name}
                                                                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
                                                            />
                                                        ) : (
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold uppercase text-primary ring-2 ring-primary/20">
                                                                {t.name
                                                                    .split(" ")
                                                                    .map((p) => p[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {t.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                    </div>
                                </CardContent>
                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
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
