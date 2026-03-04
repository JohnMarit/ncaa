import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePublicEvents } from "@/hooks/usePublicEvents";

const Events = () => {
  const { upcomingEvents, pastEvents } = usePublicEvents();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
                Events
              </h1>
              <p className="text-lg text-primary-foreground/90 md:text-xl">
                Stay connected with NCAA meetings, celebrations, and community gatherings
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                {upcomingEvents.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-12 text-center">
                    <p className="text-muted-foreground">No upcoming events yet.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Check back later for meetings and gatherings.</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row">
                        {event.image && (
                          <div className="w-full md:w-1/3 shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-48 md:h-full md:min-h-48 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className={`p-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between ${event.image ? "md:w-2/3" : "w-full"}`}>
                          <div className="flex-1">
                            <h3 className="mb-3 font-heading text-2xl font-bold">{event.title}</h3>
                            <p className="mb-4 text-muted-foreground">{event.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:w-48">
                            <Button className="w-full">RSVP</Button>
                            <Button variant="outline" className="w-full">
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
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
                                target.style.display = "none";
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
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
