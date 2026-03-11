import { useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { MentorProfile } from "@/contexts/AdminDataContext";

const FALLBACK_MENTORS: MentorProfile[] = [
  {
    id: "demo-mentor-1",
    name: "Prof. Achol Deng",
    position: "Lecturer",
    organization: "University of Juba",
    story:
      "Achol was the first girl from her village to complete university. Today she lectures young women and often reminds them that their voices matter in classrooms and in policy spaces.",
  },
  {
    id: "demo-mentor-2",
    name: "Mama Nyaluak",
    position: "Community Elder",
    organization: "Arialbeek",
    story:
      "For many years she has walked from home to home encouraging parents to keep their girls in school. Girls say they look up to her courage and strong voice.",
  },
  {
    id: "demo-mentor-3",
    name: "Deng John",
    position: "Engineer",
    organization: "NCAA Member",
    story:
      "As a practising engineer, Deng shares his journey with girls who love science and maths, showing them that they too can build roads, bridges and systems.",
  },
  {
    id: "demo-mentor-4",
    name: "Sr. Mary",
    position: "Head Teacher",
    organization: "Bor",
    story:
      "She leads a girls’ boarding school and offers guidance, prayer and discipline. Many former students credit her for shaping their confidence.",
  },
];

export function MentorsSection() {
  const { mentors } = useAdminData();
  const items = mentors.length > 0 ? mentors : FALLBACK_MENTORS;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3 w-3" />
            Girls Mentors &amp; Role Models
          </div>
          <h2 className="mb-3 font-heading text-2xl font-bold md:text-3xl">
            Girls Mentors and People They Look Up To
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Around every NCAA girl there is a circle of women and men who cheer
            her on, share wisdom and open doors. Here are some of the people
            our girls say they look up to.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((mentor) => {
            const story = mentor.story ?? "";
            const firstParagraph = story.split(/\n{2,}/)[0] ?? "";
            const preview = firstParagraph.slice(0, 160);
            const hasMore = story.length > preview.length;
            const isExpanded = expandedId === mentor.id;

            return (
              <button
                key={mentor.name}
                type="button"
                onClick={() =>
                  setExpandedId((current) =>
                    current === mentor.id ? null : mentor.id,
                  )
                }
                className="flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                    {mentor.photoUrl ? (
                      <img
                        src={mentor.photoUrl}
                        alt={mentor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">
                        {mentor.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {mentor.name}
                    </h3>
                    <p className="truncate text-[11px] font-medium text-primary/80">
                      {mentor.position}
                      {mentor.organization ? ` · ${mentor.organization}` : ""}
                    </p>
                  </div>
                </div>
                {(preview || story) && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {isExpanded ? story : preview}
                    {!isExpanded && hasMore && "…"}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

