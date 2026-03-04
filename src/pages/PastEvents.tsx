import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Clock } from "lucide-react";
import { usePublicEvents } from "@/hooks/usePublicEvents";

const PastEvents = () => {
  const { pastEvents } = usePublicEvents();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-secondary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-heading text-4xl font-bold text-brand-primary-800 md:text-5xl">
                Past Events
              </h1>
              <p className="text-lg text-brand-primary-800/80 md:text-xl">
                Highlights from recent gatherings and milestones.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container space-y-6">
            {pastEvents.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No past events yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">Past events will appear here after their date has passed.</p>
              </div>
            ) : (
            pastEvents.map((event) => (
              <div key={event.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">
                  {event.image && (
                    <div className="md:w-1/3">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-64 md:h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className={`p-6 ${event.image ? "md:w-2/3" : "w-full"}`}>
                    <h3 className="mb-3 font-heading text-xl font-bold">{event.title}</h3>
                    {event.description && (
                      <p className="mb-4 text-muted-foreground">{event.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
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

export default PastEvents;



