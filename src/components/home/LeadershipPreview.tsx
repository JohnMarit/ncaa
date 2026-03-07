import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { executiveCommittee } from "@/data/leadership";
import { AvatarModal } from "@/components/ui/avatar-modal";
import { useState } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import {
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
} from "lucide-react";

// Single shared gradient for all leadership accents
const leadershipGradient = "from-[hsl(278_42%_34%)] to-[hsl(276_46%_30%)]";

const iconMap: Record<string, React.ElementType> = {
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

export const LeadershipPreview = () => {
    const { executiveCommittee: adminExecutive } = useAdminData();

    // Display only the top 3 executive committee members
    // This data is sourced from the centralized leadership data
    const leadersSource = adminExecutive.length > 0
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

    const topThreeLeaders = leadersSource.slice(0, 3);
    const [selectedMember, setSelectedMember] = useState<{
        image: string;
        name: string;
        position: string;
        description: string;
    } | null>(null);

    return (
        <section className="py-16 md:py-24">
            <div className="container">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                        Executive Leadership
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Meet the top leaders guiding NCAA towards excellence and empowerment
                    </p>
                </div>

                {/* Leadership Cards Grid */}
                <div className="space-y-6 sm:grid sm:gap-6 sm:space-y-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-auto max-w-5xl">
                    {topThreeLeaders.map((member, index) => {
                        const Icon = member.icon;
                        const isChairperson = member.position === "Chairlady";
                        return (
                            <div
                                key={index}
                                className="group relative mx-auto w-full max-w-xs overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30 shadow-lg transition-all duration-300 sm:max-w-none md:hover:-translate-y-1 md:hover:shadow-xl flex flex-col"
                            >
                                {/* Gradient overlay matching Leadership page style */}
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
                                            className={`h-full w-full ${member.position === "Chairlady" || member.position === "Deputy Chairlady" || member.position === "Secretary General" ? "object-cover object-top" : "object-cover"}`}
                                        />
                                    </button>
                                ) : (
                                    <div className={`flex w-full h-56 items-center justify-center bg-gradient-to-br ${leadershipGradient} lg:h-64`}>
                                        <Icon className="h-12 w-12 text-white" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative flex flex-col items-center text-center p-4 flex-1 md:p-4 lg:p-8">
                                    {/* Name */}
                                    <h3 className="mb-2 font-heading text-lg font-bold md:text-lg lg:text-xl">
                                        {member.name}
                                    </h3>

                                    {/* Position */}
                                    <p className={`mb-2 text-sm font-semibold bg-gradient-to-r ${leadershipGradient} bg-clip-text text-transparent md:text-sm lg:mb-3 lg:text-base`}>
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

                {/* See More Button */}
                <div className="mt-12 flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="group hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="View all leadership members"
                    >
                        <Link to="/leadership">
                            See More
                        </Link>
                    </Button>
                </div>
            </div>
            
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
        </section>
    );
};

