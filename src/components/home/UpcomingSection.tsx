import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "General Assembly Meeting",
    date: "January 15, 2024",
    time: "10:00 AM",
    location: "NCAA Hall, Juba",
    type: "Meeting",
    typeColor: "bg-primary",
  },
  {
    id: 2,
    title: "Executive Committee Elections",
    date: "February 1, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Online & In-Person",
    type: "Election",
    typeColor: "bg-secondary",
  },
  {
    id: 3,
    title: "Girls' Day Celebration",
    date: "March 8, 2024",
    time: "2:00 PM",
    location: "Freedom Hall, Juba",
    type: "Event",
    typeColor: "bg-accent",
  },
];

export function UpcomingSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Stay Engaged
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Upcoming Events
            </h2>
          </div>
          <Button variant="outline">
            View All Events
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {upcomingEvents.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-card"
            >
              {/* Event Type Badge */}
              <div className="border-b border-border p-4">
                <span
                  className={`inline-block rounded-full ${event.typeColor} px-3 py-1 text-xs font-semibold text-primary-foreground`}
                >
                  {event.type}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {event.title}
                </h3>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="mt-6 w-full justify-center"
                >
                  View Details
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
