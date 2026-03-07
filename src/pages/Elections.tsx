import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Vote, Users, Award, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { electionProcess } from "@/data/elections";
import { useAdminData } from "@/contexts/AdminDataContext";

// Mock data for past elections - TODO: Replace with API call
const pastElections = [
    {
        id: 2,
        title: "Executive Committee Elections 2025",
        date: "January 2025",
        turnout: "92%",
        totalVotes: 2300,
    },
    {
        id: 3,
        title: "IEC Committee Elections 2025",
        date: "March 2024",
        turnout: "88%",
        totalVotes: 2100,
    },
];

const Elections = () => {
    const { elections } = useAdminData();

    const activeElections = elections.filter((e) => e.status !== "Completed");

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Elections
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Transparent, auditable elections with full democratic participation
                            </p>
                        </div>
                    </div>
                </section>

                {/* Election Process Overview */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <h2 className="mb-12 text-center font-heading text-3xl font-bold md:text-4xl">
                            Our Election Process
                        </h2>
                        <div className="grid gap-6 md:grid-cols-4 max-w-5xl mx-auto">
                            {electionProcess.map((item) => (
                                <div key={item.step} className="text-center">
                                    <div className="mb-4 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Elections Content */}
                <section className="bg-muted/50 py-16 md:py-24">
                    <div className="container">
                        <Tabs defaultValue="active" className="w-full">
                            <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-2">
                                <TabsTrigger value="active">Active Elections</TabsTrigger>
                                <TabsTrigger value="past">Past Elections</TabsTrigger>
                            </TabsList>

                            <TabsContent value="active" className="space-y-6">
                                {activeElections.length > 0 ? (
                                    activeElections.map((election) => (
                                        <div
                                            key={election.id}
                                            className="rounded-xl border border-border bg-background p-8 shadow-sm"
                                        >
                                            <div className="mb-6">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <h3 className="font-heading text-2xl font-bold">{election.title}</h3>
                                                    <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                                                        {election.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {election.startDate} - {election.endDate}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        {election.totalVoters} eligible voters
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="mb-3 font-semibold">Open Positions</h4>
                                                <div className="grid gap-2 sm:grid-cols-2">
                                                    {election.positions.map((position) => (
                                                        <div
                                                            key={position}
                                                            className="flex items-center gap-2 rounded-lg border border-border p-3"
                                                        >
                                                            <Award className="h-5 w-5 text-primary" />
                                                            <span className="font-medium">{position}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                    <span>Nominations Received</span>
                                                    <span className="font-semibold">{election.nominationsReceived}</span>
                                                </div>
                                                <Progress value={(election.nominationsReceived / 20) * 100} />
                                            </div>

                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <Button className="flex-1">
                                                    <Vote className="mr-2 h-4 w-4" />
                                                    Submit Nomination
                                                </Button>
                                                <Button variant="outline" className="flex-1">
                                                    View Candidates
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
                                        <Vote className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="mb-2 font-heading text-xl font-semibold">
                                            No Active Elections
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Check back later for upcoming elections and nomination opportunities
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="past" className="space-y-4">
                                {pastElections.map((election) => (
                                    <div
                                        key={election.id}
                                        className="rounded-xl border border-border bg-background p-6 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="mb-2 font-heading text-xl font-bold">{election.title}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {election.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4" />
                                                        {election.turnout} turnout
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        {election.totalVotes} votes cast
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                View Results
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Election Principles */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <h2 className="mb-12 text-center font-heading text-3xl font-bold md:text-4xl">
                            Election Principles
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                            <div className="rounded-xl border border-border bg-card p-6">
                                <Vote className="mb-4 h-8 w-8 text-primary" />
                                <h3 className="mb-2 font-heading text-xl font-semibold">Secret Ballot</h3>
                                <p className="text-sm text-muted-foreground">
                                    All votes are anonymous and confidential, ensuring member privacy
                                    and freedom of choice.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <CheckCircle className="mb-4 h-8 w-8 text-primary" />
                                <h3 className="mb-2 font-heading text-xl font-semibold">Full Audit Trail</h3>
                                <p className="text-sm text-muted-foreground">
                                    Every vote is logged with immutable timestamps for complete transparency
                                    and integrity.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <Users className="mb-4 h-8 w-8 text-primary" />
                                <h3 className="mb-2 font-heading text-xl font-semibold">IEC Oversight</h3>
                                <p className="text-sm text-muted-foreground">
                                    Independent Election Committee ensures fair conduct and addresses
                                    any disputes.
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

export default Elections;
