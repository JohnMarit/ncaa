import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Quote } from "lucide-react";

const ScholarStory = () => {
    const { scholarId } = useParams<{ scholarId: string }>();
    const { scholars } = useAdminData();

    const scholar = scholars.find((s) => s.id === scholarId);

    const renderBody = () => {
        if (!scholarId && scholars.length === 0) {
            return (
                <p className="text-center text-muted-foreground">
                    Loading scholar story...
                </p>
            );
        }

        if (!scholar) {
            return (
                <div className="space-y-4 text-center">
                    <p className="text-lg font-semibold">Scholar not found</p>
                    <p className="text-muted-foreground">
                        The story you&apos;re looking for is no longer available or the link is incorrect.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/scholarship">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Scholarship page
                        </Link>
                    </Button>
                </div>
            );
        }

        const storyParagraphs = scholar.story.split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 0);

        return (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:items-start">
                <div>
                    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div className="relative h-72 w-full bg-muted md:h-96">
                            {scholar.photoUrl ? (
                                <img
                                    src={scholar.photoUrl}
                                    alt={scholar.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/20 to-primary/10 text-5xl font-bold text-primary">
                                    {scholar.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                                NCAA Scholar
                            </p>
                            <h1 className="font-heading text-3xl font-bold md:text-4xl">
                                {scholar.name}
                            </h1>
                            {scholar.tagline && (
                                <p className="text-base text-muted-foreground">
                                    {scholar.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button asChild variant="outline">
                            <Link to="/scholarship">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Scholarship page
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="border-primary/10 bg-card/60">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Quote className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">
                                    Her Story
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    In her own words, how the NCAA scholarship is shaping her journey.
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                        {storyParagraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-muted/20 py-12 md:py-16">
                <div className="container">
                    {renderBody()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ScholarStory;

