import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useAdminData();
  const published = events.filter((e) => e.published !== false);
  const event = id ? published.find((e) => e.id === id) : null;

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-2">Event not found</h1>
            <p className="text-muted-foreground mb-6">The event you’re looking for may have been removed or the link is incorrect.</p>
            <Button asChild variant="outline">
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-secondary py-12 md:py-16">
          <div className="container">
            <Button asChild variant="ghost" size="sm" className="mb-4 text-primary hover:bg-primary/10">
              <Link to="/events" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
            </Button>
            <h1 className="font-heading text-3xl font-bold text-brand-primary-800 md:text-4xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {event.date}
              </span>
              {event.time && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            {event.image && (
              <div className="mb-8 rounded-xl overflow-hidden border border-border shadow-sm">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-auto object-cover max-h-[400px]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
