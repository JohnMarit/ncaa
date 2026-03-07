import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";

// Mock data - TODO: Replace with API call
const documents = {
    constitution: [
        {
            id: 1,
            title: "NCAA Constitution",
            version: "v2.1",
            date: "January 2024",
            size: "2.5 MB",
            type: "PDF",
        },
        {
            id: 2,
            title: "Amendments Log",
            version: "v1.0",
            date: "December 2023",
            size: "450 KB",
            type: "PDF",
        },
    ],
    regulations: [
        {
            id: 3,
            title: "Membership Regulations",
            version: "v1.3",
            date: "March 2024",
            size: "1.8 MB",
            type: "PDF",
        },
        {
            id: 4,
            title: "Election Guidelines",
            version: "v2.0",
            date: "February 2024",
            size: "1.2 MB",
            type: "PDF",
        },
        {
            id: 5,
            title: "Financial Procedures",
            version: "v1.5",
            date: "January 2024",
            size: "980 KB",
            type: "PDF",
        },
    ],
    minutes: [
        {
            id: 6,
            title: "General Meeting Minutes - November 2025",
            version: "Final",
            date: "November 30, 2025",
            size: "650 KB",
            type: "PDF",
        },
        {
            id: 7,
            title: "Executive Committee Meeting - October 2025",
            version: "Final",
            date: "October 15, 2025",
            size: "520 KB",
            type: "PDF",
        },
    ],
    reports: [
        {
            id: 8,
            title: "Annual Financial Report 2024",
            version: "Final",
            date: "March 2025",
            size: "3.2 MB",
            type: "PDF",
        },
        {
            id: 9,
            title: "Quarterly Activity Report Q3 2025",
            version: "Final",
            date: "November 2025",
            size: "1.5 MB",
            type: "PDF",
        },
    ],
};

const DocumentCard = ({ doc }: { doc: any }) => (
    <div className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
            <div className="flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="mb-1 font-semibold">{doc.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.date}
                        </span>
                        <span>•</span>
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                    </div>
                </div>
            </div>
            <span className="rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium">
                {doc.version}
            </span>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1" disabled={!doc.fileUrl}>
                <a href={doc.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </a>
            </Button>
            <Button asChild size="sm" className="flex-1" disabled={!doc.fileUrl}>
                <a href={doc.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </a>
            </Button>
        </div>
    </div>
);

const Documents = () => {
    const { documents: adminDocuments } = useAdminData();

    const grouped = useMemo(() => {
        const published = adminDocuments.filter((d) => d.status === "published");
        if (published.length === 0) return documents;

        const result: Record<string, any[]> = {
            constitution: [],
            regulations: [],
            minutes: [],
            reports: [],
        };

        const normalizeKey = (category: string): keyof typeof result => {
            const c = category.trim().toLowerCase();
            if (c.includes("constitution")) return "constitution";
            if (c.includes("regulation")) return "regulations";
            if (c.includes("minute")) return "minutes";
            if (c.includes("report")) return "reports";
            return "reports";
        };

        for (const d of published) {
            const key = normalizeKey(d.category);
            result[key].push(d);
        }

        // newest first
        for (const key of Object.keys(result) as (keyof typeof result)[]) {
            result[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        return result;
    }, [adminDocuments]);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Document Center
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Access official NCAA documents, regulations, and reports
                            </p>
                        </div>
                    </div>
                </section>

                {/* Documents Content */}
                <section className="py-16 md:py-24">
                    <div className="container">
                        <Tabs defaultValue="constitution" className="w-full">
                            <TabsList className="mb-8 grid w-full max-w-2xl mx-auto grid-cols-4">
                                <TabsTrigger value="constitution">Constitution</TabsTrigger>
                                <TabsTrigger value="regulations">Regulations</TabsTrigger>
                                <TabsTrigger value="minutes">Minutes</TabsTrigger>
                                <TabsTrigger value="reports">Reports</TabsTrigger>
                            </TabsList>

                            <TabsContent value="constitution" className="space-y-4">
                                {grouped.constitution.map((doc) => (
                                    <DocumentCard key={doc.id} doc={doc} />
                                ))}
                            </TabsContent>

                            <TabsContent value="regulations" className="space-y-4">
                                {grouped.regulations.map((doc) => (
                                    <DocumentCard key={doc.id} doc={doc} />
                                ))}
                            </TabsContent>

                            <TabsContent value="minutes" className="space-y-4">
                                {grouped.minutes.map((doc) => (
                                    <DocumentCard key={doc.id} doc={doc} />
                                ))}
                            </TabsContent>

                            <TabsContent value="reports" className="space-y-4">
                                {grouped.reports.map((doc) => (
                                    <DocumentCard key={doc.id} doc={doc} />
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Documents;
