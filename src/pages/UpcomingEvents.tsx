import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Clock } from "lucide-react";
import { usePublicEvents } from "@/hooks/usePublicEvents";

const UpcomingEvents = () => {
  const { upcomingEvents } = usePublicEvents();

  const toParagraphs = (text: string): string[] => {
    const normalized = text.replace(/\r\n/g, "\n");
    const parts = normalized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
    return normalized.split("\n").map((p) => p.trim()).filter(Boolean);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-secondary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-heading text-4xl font-bold text-brand-primary-800 md:text-5xl">
                Upcoming Events
              </h1>
              <p className="text-lg text-brand-primary-800/80 md:text-xl">
                What&apos;s next for the NCAA community.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container space-y-6">
            {upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No upcoming events yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">Check back later for meetings, celebrations, and community gatherings.</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Original layout: image area (placeholder for static events; image when provided by admin) */}
                    <div className="w-full h-64 md:w-1/3 md:min-h-64 shrink-0 bg-muted/50 overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="mb-3 font-heading text-xl font-bold">{event.title}</h3>
                      <div className="mb-4 space-y-3 text-muted-foreground">
                        {toParagraphs(event.description).map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
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
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingEvents;
