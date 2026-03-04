import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { usePublicEvents } from "@/hooks/usePublicEvents";

export const UpcomingEventsPreview = () => {
    const { upcomingEvents } = usePublicEvents();
    const previewEvents = upcomingEvents.slice(0, 3);
    const [needsReadMore, setNeedsReadMore] = useState<Set<string>>(new Set());
    const descriptionRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

    useEffect(() => {
        const ids = upcomingEvents.slice(0, 3).map((e) => e.id);
        const raf = requestAnimationFrame(() => {
            const newSet = new Set<string>();
            ids.forEach((id) => {
                const el = descriptionRefs.current[id];
                if (el && el.scrollHeight > el.clientHeight) newSet.add(id);
            });
            setNeedsReadMore((prev) =>
                prev.size === newSet.size && [...prev].every((id) => newSet.has(id))
                    ? prev
                    : newSet
            );
        });
        return () => cancelAnimationFrame(raf);
    }, [upcomingEvents]);

    return (
        <section className="py-16 md:py-24 bg-muted/30 min-h-0" aria-label="Upcoming events">
            <div className="container w-full min-w-0 px-4 sm:px-6">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
                        Upcoming Events
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Stay connected with NCAA meetings, celebrations, and community gatherings
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
                    {previewEvents.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                            No upcoming events yet. Check back later.
                        </div>
                    ) : previewEvents.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-xl border border-border bg-background overflow-hidden shadow-sm transition-all hover:shadow-md"
                        >
                            {event.image ? (
                                <div className="w-full h-64">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-muted/50" aria-hidden />
                            )}
                            <div className="p-6">
                                <h3 className="mb-3 font-heading text-lg font-bold">{event.title}</h3>
                                <div className="mb-4">
                                    <p
                                        ref={(elem) => {
                                            descriptionRefs.current[event.id] = elem;
                                        }}
                                        className="text-sm text-muted-foreground line-clamp-3"
                                    >
                                        {event.description}
                                    </p>
                                    {needsReadMore.has(event.id) && (
                                        <Button
                                            asChild
                                            variant="link"
                                            className="h-auto p-0 mt-2 text-xs text-primary hover:text-primary/80"
                                        >
                                            <Link to={`/events/event/${event.id}`}>
                                                Read more
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="group hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="View all upcoming events"
                    >
                        <Link to="/events/upcoming">
                            See More
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
