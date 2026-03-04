import { Heart, Lightbulb, Handshake, GraduationCap } from "lucide-react";
import nca1Image from "@/images/nca1.jpg";

const values = [
  {
    icon: Heart,
    title: "Unity",
    description: "Standing together as daughters of Twic East, bound by heritage and purpose.",
  },
  {
    icon: Lightbulb,
    title: "Empowerment",
    description: "Uplifting girls through education, resources, and community support.",
  },
  {
    icon: Handshake,
    title: "Service",
    description: "Dedicated to improving the welfare of our community at home and abroad.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Championing learning and development for present and future generations.",
  },
];

export function MissionSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div>
            <span className="mb-3 inline-block rounded-full bg-secondary/20 px-4 py-1 text-sm font-medium text-secondary-foreground">
              Our Mission
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Empowering Girls, Building{" "}
              <span className="text-primary">Community</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Nyan Cit Arialbeek exists to unite the girls of Twic East County,
              fostering solidarity, mutual support, and collective action for
              the betterment of our community.
            </p>
            <p className="text-muted-foreground">
              Through our programs in education, welfare, and community
              development, we work to ensure every daughter of Twic East has the
              opportunity to thrive—whether at home in South Sudan or across the
              diaspora.
            </p>

            {/* Values */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated">
              <img
                src={nca1Image}
                alt="NCAA Event - Empowering Girls, Building Community"
                className="h-full w-full object-cover"
              />
              {/* Dark overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-4 shadow-card md:-left-10">
              <p className="mb-1 font-heading text-2xl font-bold text-primary">
                2,500+
              </p>
              <p className="text-sm text-muted-foreground">
                Members across 6 Payams
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
