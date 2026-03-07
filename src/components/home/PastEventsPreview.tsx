import { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { usePublicEvents } from "@/hooks/usePublicEvents";

/** Top 3 past events to show on homepage, in this order (only those with images are included). */
const FEATURED_PAST_EVENT_TITLES = [
    "NCAA Annual Trade Fair",
    "Visit to Panyagoor",
    "Quarterly Financial Review",
];

export const PastEventsPreview = () => {
    const { pastEvents } = usePublicEvents();
    const previewEvents = useMemo(() => {
        const withImages = pastEvents.filter((e) => e.image);
        const featured = FEATURED_PAST_EVENT_TITLES
            .map((title) => withImages.find((e) => e.title === title))
            .filter((e): e is NonNullable<typeof e> => e != null);

        // If admin adds/marks new past events, show the most recent past events first.
        if (featured.length === 0) {
            return withImages.slice(0, 3);
        }
        return featured;
    }, [pastEvents]);
    const [needsReadMore, setNeedsReadMore] = useState<Set<string>>(new Set());
    const descriptionRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

    useEffect(() => {
        const newNeedsReadMore = new Set<string>();
        previewEvents.forEach((event) => {
            const element = descriptionRefs.current[event.id];
            if (element) {
                // Check if the element's scrollHeight is greater than its clientHeight
                // This means the text is truncated by line-clamp-3
                if (element.scrollHeight > element.clientHeight) {
                    newNeedsReadMore.add(event.id);
                }
            }
        });
        // Only update state if the set has changed
        if (newNeedsReadMore.size > 0 && needsReadMore.size === 0) {
            setNeedsReadMore(newNeedsReadMore);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowReadMore = (eventId: string) => needsReadMore.has(eventId);

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                        Past Events
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Highlights from recent gatherings and milestones
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
                    {previewEvents.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                            No past events yet.
                        </div>
                    ) : previewEvents.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-xl border border-border bg-background overflow-hidden shadow-sm transition-all hover:shadow-md"
                        >
                            {event.image && (
                                <div className="w-full h-64">
                                    <img 
                                        src={event.image} 
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">{event.title}</h3>
                                {event.description && (
                                    <div className="mb-4">
                                        <p 
                                            ref={(el) => {
                                                descriptionRefs.current[event.id] = el;
                                            }}
                                            className="text-sm text-muted-foreground line-clamp-3"
                                        >
                                            {event.description}
                                        </p>
                                        {shouldShowReadMore(event.id) && (
                                            <Button
                                                asChild
                                                variant="link"
                                                className="h-auto p-0 mt-2 text-xs text-primary hover:text-primary/80"
                                            >
                                                <Link to={`/events/event/${event.id}`}>
                                                    Read More
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                <div className="flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="group hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="View all past events"
                    >
                        <Link to="/events/past">
                            See More
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

