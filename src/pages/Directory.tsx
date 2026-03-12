import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, Search, Mail, Phone, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Directory = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPayam, setFilterPayam] = useState("all");

    // Mock member data - would be replaced with API call
    const members = [
        {
            id: 1,
            name: "Ahou Abit Arok",
            role: "Chairlady",
            payam: "Ajuong",
            email: "ahou.arok@ncatwiceast.org",
            phone: "+211 920 287 970",
            location: "Juba"
        },
        {
            id: 2,
            name: "Yar Kuir Mabior",
            role: "Deputy Chairlady",
            payam: "Kongor",
            email: "yar.mabior@ncatwiceast.org",
            phone: "+211 921 159 090",
            location: "Juba"
        },
        {
            id: 3,
            name: "Ayak Majok Abit",
            role: "Secretary General",
            payam: "Lith",
            email: "ayak.abit@ncatwiceast.org",
            phone: "+211 920 287 970",
            location: "Juba"
        },
        {
            id: 4,
            name: "Nyandeng Deng Khot",
            role: "Finance Secretary",
            payam: "Nyuak",
            email: "nyandeng.khot@ncatwiceast.org",
            phone: "+211 921 159 090",
            location: "Juba"
        },
        {
            id: 5,
            name: "Alek Majok",
            role: "Information Secretary",
            payam: "Pakeer",
            email: "alek.majok@ncatwiceast.org",
            phone: "+211 920 287 970",
            location: "Juba"
        },
        {
            id: 6,
            name: "Nyarout Jok Gai",
            role: "Payam Representative",
            payam: "Pawuoi",
            email: "nyarout.gai@ncatwiceast.org",
            phone: "+211 921 159 090",
            location: "Pawuoi"
        }
    ];

    const payams = [
        "Ajuong", "Kongor", "Lith", "Nyuak", "Pakeer", "Pawuoi"
    ];

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.payam.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPayam = filterPayam === "all" || member.payam === filterPayam;
        return matchesSearch && matchesPayam;
    });

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
                                    <Users className="h-10 w-10 text-primary-foreground" />
                                </div>
                            </div>
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Member Directory
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Connect with NCAA members across all 6 Payams
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search and Filter Section */}
                <section className="py-8 md:py-12">
                    <div className="container">
                        <div className="mx-auto max-w-5xl">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        Search Directory
                                    </CardTitle>
                                    <CardDescription>
                                        Find members by name, role, or Payam
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Search by name, role, or Payam..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="w-full md:w-64">
                                            <Select value={filterPayam} onValueChange={setFilterPayam}>
                                                <SelectTrigger>
                                                    <Filter className="mr-2 h-4 w-4" />
                                                    <SelectValue placeholder="Filter by Payam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Payams</SelectItem>
                                                    {payams.map((payam) => (
                                                        <SelectItem key={payam} value={payam}>
                                                            {payam}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Members List Section */}
                <section className="pb-16 md:pb-24">
                    <div className="container">
                        <div className="mx-auto max-w-5xl">
                            {/* Results Count */}
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                                </p>
                                {(searchQuery || filterPayam !== "all") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterPayam("all");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>

                            {/* Members Grid */}
                            {filteredMembers.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {filteredMembers.map((member) => (
                                        <Card key={member.id} className="transition-all hover:shadow-lg">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl">{member.name}</CardTitle>
                                                        <CardDescription className="mt-1">
                                                            {member.role}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                        {member.payam}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={`mailto:${member.email}`}
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            {member.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={`tel:${member.phone}`}
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                        >
                                                            {member.phone}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">
                                                            {member.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="mb-2 font-heading text-xl font-semibold">
                                            No Members Found
                                        </h3>
                                        <p className="text-center text-sm text-muted-foreground">
                                            Try adjusting your search or filter criteria
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>

                {/* Member Access Notice */}
                <section className="bg-muted/50 py-12">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h3 className="mb-4 font-heading text-xl font-bold">
                                Access Full Directory
                            </h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                The complete member directory with contact details is available to registered 
                                NCAA members. Sign in to your member portal to access the full directory.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button asChild>
                                    <a href="/login">Sign In to Portal</a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="/partner">Become a Partner</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Directory;

