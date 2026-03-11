import { HeartHandshake } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { Partner } from "@/contexts/AdminDataContext";

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "demo-partner-1",
    name: "Local Schools &amp; Head Teachers",
    description:
      "Schools in Bor, Juba and Twic East that help identify girls in need and walk with them through their studies.",
  },
  {
    id: "demo-partner-2",
    name: "TEYA Institute &amp; Vocational Centers",
    description:
      "Training centres that equip girls with practical skills in tailoring, hairdressing and other trades.",
  },
  {
    id: "demo-partner-3",
    name: "Diaspora Friends of NCAA",
    description:
      "NCAA members and friends in Nairobi, Kampala, Juba and beyond who contribute towards the scholarship fund.",
  },
  {
    id: "demo-partner-4",
    name: "Church &amp; Community Leaders",
    description:
      "Elders, pastors and chiefs who encourage families to keep girls in school and support NCAA initiatives.",
  },
];

export function PartnersSection() {
  const { partners } = useAdminData();
  const items = partners.length > 0 ? partners : FALLBACK_PARTNERS;

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground">
            <HeartHandshake className="h-3 w-3" />
            Our Partners
          </div>
          <h2 className="mb-3 font-heading text-2xl font-bold md:text-3xl">
            Together With Our Partners
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            NCAA does not walk alone. Our work is possible because of schools,
            churches, community leaders and friends in the diaspora who stand
            with us for the education of Twic East girls.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((partner) => (
            <div
              key={partner.id}
              className="flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary/10 text-secondary-foreground overflow-hidden">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-semibold">
                      {partner.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: partner.name,
                    }}
                  />
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

