import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { executiveCommittee, payamRepresentatives } from "@/data/leadership";
import { AvatarModal } from "@/components/ui/avatar-modal";
import { useState, type ElementType } from "react";
import { Crown, DollarSign, FileText, GraduationCap, Heart, Lightbulb, MapPin, Megaphone, Scale, Trophy, UserCircle, Users } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

// Single shared gradient for all leadership accents
const leadershipGradient = "from-[hsl(278_42%_34%)] to-[hsl(276_46%_30%)]";

const iconMap: Record<string, ElementType> = {
    Crown,
    UserCircle,
    FileText,
    DollarSign,
    Users,
    Megaphone,
    Scale,
    GraduationCap,
    Heart,
    Trophy,
    Lightbulb,
};

const Leadership = () => {
    const { executiveCommittee: adminExecutive, payamRepresentatives: adminPayam } = useAdminData();
    const [selectedMember, setSelectedMember] = useState<{
        image: string;
        name: string;
        position: string;
        description: string;
    } | null>(null);

    const executive = adminExecutive.length > 0
        ? adminExecutive.map((m) => {
            const staticMatch = executiveCommittee.find((s) => s.name === m.name);
            const Icon = m.icon && iconMap[m.icon] ? iconMap[m.icon] : staticMatch?.icon ?? UserCircle;
            return {
                name: m.name,
                position: m.position,
                description: m.description,
                icon: Icon,
                image: m.image ?? staticMatch?.image,
            };
        })
        : executiveCommittee;

    const council = adminPayam.length > 0
        ? adminPayam.map((r) => {
            const staticMatch = payamRepresentatives.find((s) => s.payam === r.payam);
            return {
                name: r.name ?? staticMatch?.name ?? "",
                payam: r.payam,
                position: r.position ?? staticMatch?.position,
                image: r.image ?? staticMatch?.image,
            };
        })
        : payamRepresentatives;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                                Our Leadership
                            </h1>
                            <p className="text-lg text-primary-foreground/90 md:text-xl">
                                Meet the dedicated leaders guiding NCAA towards excellence and empowerment
                            </p>
                        </div>
                    </div>
                </section>

                {/* Executive Committee Section */}
                <section className="py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="mb-8 text-center md:mb-12">
                            <h2 className="mb-3 font-heading text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">
                                Executive Committee
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
                                Our executive committee comprises dedicated leaders committed to serving
                                the NCAA community with transparency and excellence
                            </p>
                        </div>

                        {/* Chairlady - Featured at Top */}
                        {(() => {
                            const chairperson = executive.find(m => m.position === "Chairlady");
                            const otherMembers = executive.filter(m => m.position !== "Chairlady");
                            
                            if (!chairperson) return null;
                            
                            const ChairladyIcon = chairperson.icon;
                            
                            return (
                                <>
                                    <div className="mb-8 flex justify-center md:mb-12">
                                        <div className="group relative w-full max-w-xs overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 shadow-lg transition-all duration-300 md:max-w-md md:rounded-2xl md:shadow-xl md:hover:shadow-2xl">
                                            {/* Gradient overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${leadershipGradient} opacity-5 transition-opacity duration-300 group-hover:opacity-10`} />

                                            {/* Cover Image - same on all screen sizes */}
                                            {chairperson.image ? (
                                                <button
                                                    onClick={() => setSelectedMember({
                                                        image: chairperson.image!,
                                                        name: chairperson.name,
                                                        position: chairperson.position,
                                                        description: chairperson.description
                                                    })}
                                                    className="relative w-full h-64 overflow-hidden rounded-t-2xl bg-muted transition-opacity duration-200 hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center lg:h-72"
                                                    aria-label={`View larger image of ${chairperson.name}`}
                                                >
                                                    <img
                                                        src={chairperson.image}
                                                        alt={chairperson.name}
                                                        className="h-full w-full object-cover object-top"
                                                        loading="eager"
                                                    />
                                                </button>
                                            ) : (
                                                <div className={`flex w-full h-64 items-center justify-center bg-gradient-to-br ${leadershipGradient} rounded-t-2xl lg:h-72`}>
                                                    <ChairladyIcon className="h-20 w-20 text-white" />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="relative flex flex-col items-center text-center p-5 md:p-6 lg:p-8">
                                                {/* Name */}
                                                <h3 className="mb-2 font-heading text-xl font-bold md:mb-3 md:text-2xl lg:text-3xl">
                                                    {chairperson.name}
                                                </h3>

                                                {/* Position */}
                                                <p className={`mb-3 text-base font-semibold bg-gradient-to-r ${leadershipGradient} bg-clip-text text-transparent md:mb-4 md:text-lg`}>
                                                    {chairperson.position}
                                                </p>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground md:text-base">
                                                    {chairperson.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Executive Committee Members */}
                                    <div className="space-y-6 md:grid md:gap-6 md:space-y-0 md:grid-cols-2 lg:grid-cols-4">
                                        {otherMembers.map((member, index) => {
                                            const Icon = member.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className="group relative mx-auto w-full max-w-xs overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 shadow-lg transition-all duration-300 md:max-w-none md:rounded-xl md:shadow-lg md:hover:-translate-y-1 md:hover:shadow-xl flex flex-col"
                                                >
                                                    {/* Gradient overlay */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${leadershipGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />

                                                    {/* Cover Image - same on all screen sizes */}
                                                    {member.image ? (
                                                        <button
                                                            onClick={() => setSelectedMember({
                                                                image: member.image!,
                                                                name: member.name,
                                                                position: member.position,
                                                                description: member.description
                                                            })}
                                                            className="relative w-full h-56 overflow-hidden transition-opacity duration-200 hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:h-64"
                                                            aria-label={`View larger image of ${member.name}`}
                                                        >
                                                            <img
                                                                src={member.image}
                                                                alt={member.name}
                                                                className={`h-full w-full ${member.position === "Deputy Chairlady" || member.position === "Secretary General" ? "object-cover object-top" : "object-cover"}`}
                                                            />
                                                        </button>
                                                    ) : (
                                                        <div className={`flex w-full h-56 items-center justify-center bg-gradient-to-br ${leadershipGradient} lg:h-64`}>
                                                            <Icon className="h-12 w-12 text-white" />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="relative flex flex-col items-center text-center p-4 flex-1 md:p-4 lg:p-6">
                                                        {/* Name */}
                                                        <h3 className="mb-2 font-heading text-lg font-bold md:mb-2 md:text-lg lg:text-xl">
                                                            {member.name}
                                                        </h3>

                                                        {/* Position */}
                                                        <p className={`mb-2 text-sm font-semibold bg-gradient-to-r ${leadershipGradient} bg-clip-text text-transparent md:mb-2 md:text-sm lg:mb-3 lg:text-base`}>
                                                            {member.position}
                                                        </p>

                                                        {/* Description */}
                                                        <p className="text-xs text-muted-foreground md:text-sm">
                                                            {member.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </section>

                {/* Council - Payam Representatives Section */}
                <section className="py-12 md:py-20 bg-muted/30">
                    <div className="container">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-8 text-center md:mb-12">
                                <h2 className="mb-4 font-heading text-2xl font-bold md:text-3xl lg:text-4xl">
                                    Council - Payam Representatives
                                </h2>
                                <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
                                    Our council comprises representatives from all six payams, ensuring inclusive
                                    representation and governance across the NCAA community
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                                {council.map((rep, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                                    >
                                        {/* Gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${leadershipGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                                        
                                        <div className="relative">
                                            <div className="mb-4 flex items-center justify-center">
                                                {rep.image ? (
                                                    <img
                                                        src={rep.image}
                                                        alt={rep.name}
                                                        className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md"
                                                    />
                                                ) : (
                                                    <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${leadershipGradient}`}>
                                                        <MapPin className="h-8 w-8 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <h3 className="mb-2 font-heading text-lg font-bold">
                                                    {rep.name}
                                                </h3>
                                                <p className={`text-sm font-semibold bg-gradient-to-r ${leadershipGradient} bg-clip-text text-transparent`}>
                                                    {rep.payam} Payam
                                                </p>
                                                {rep.position && (
                                                    <p className="mt-1 text-sm text-muted-foreground">{rep.position}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Organizational Structure Section */}
                <section className="py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="mb-6 text-center font-heading text-2xl font-bold md:mb-8 md:text-3xl lg:text-4xl">
                                Organizational Structure
                            </h2>

                            <div className="space-y-4 md:space-y-6">
                                <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 shadow-md md:rounded-xl md:p-6 md:shadow-lg">
                                    <h3 className="mb-2 font-heading text-lg font-bold text-primary md:mb-3 md:text-xl">
                                        Leadership Hierarchy
                                    </h3>
                                    <div className="space-y-1.5 text-sm text-muted-foreground md:space-y-2 md:text-base">
                                        <p className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary md:h-2 md:w-2"></span>
                                            <strong>General Assembly:</strong> All registered members
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary md:h-2 md:w-2"></span>
                                            <strong>Executive Committee:</strong> 13 elected officers
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary md:h-2 md:w-2"></span>
                                            <strong>Payam Representatives:</strong> 6 payam delegates
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary md:h-2 md:w-2"></span>
                                            <strong>Committees:</strong> Standing and ad-hoc committees
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4 shadow-sm md:rounded-xl md:p-6">
                                    <h3 className="mb-2 font-heading text-lg font-bold md:mb-3 md:text-xl">
                                        Term of Office
                                    </h3>
                                    <p className="text-sm text-muted-foreground md:text-base">
                                        All executive committee members serve a term of <strong>three (3) years</strong> and
                                        are eligible for re-election. Elections are conducted through transparent and
                                        democratic processes as outlined in the NCAA Constitution.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4 shadow-sm md:rounded-xl md:p-6">
                                    <h3 className="mb-2 font-heading text-lg font-bold md:mb-3 md:text-xl">
                                        Meetings & Governance
                                    </h3>
                                    <p className="text-sm text-muted-foreground md:text-base">
                                        The Executive Committee meets regularly to oversee the organization's operations,
                                        make strategic decisions, and ensure accountability to our members. General Assembly
                                        meetings are held to discuss major organizational matters and conduct elections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            
            {/* Avatar Modal */}
            {selectedMember && (
                <AvatarModal
                    open={!!selectedMember}
                    onOpenChange={(open) => !open && setSelectedMember(null)}
                    image={selectedMember.image}
                    name={selectedMember.name}
                    position={selectedMember.position}
                    description={selectedMember.description}
                />
            )}
        </div>
    );
};

export default Leadership;
