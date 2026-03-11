import { useEffect } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { Testimonial } from "@/contexts/AdminDataContext";
import NyandengImg from "@/images/Nyandeng.jpeg";
import AmerImg from "@/images/Amer_T.jpg";
import AluelImg from "@/images/Aluel.jpeg";
import AbukImg from "@/images/Abuk.jpeg";
import YarGImg from "@/images/Yar_G.JPG";
import YarKImg from "@/images/Yar_K.JPG";

const FALLBACK: Testimonial[] = [
    {
        id: "demo-1",
        name: "Nyandeng A.",
        role: "Secondary school student, Bor",
        quote: "Because of NCAA's support, I stayed in school when my family could no longer afford the fees. I now dream of becoming a nurse.",
        photoUrl: NyandengImg,
    },
    {
        id: "demo-2",
        name: "Abuk M.",
        role: "Parent, Kongor Payam",
        quote: "The scholarship lifted a huge burden from our household. My daughter can focus on her books instead of worrying about school fees.",
        photoUrl: AbukImg,
    },
    {
        id: "demo-3",
        name: "Amer T.",
        role: "University student, Juba",
        quote: "NCAA believed in me from secondary school to campus. Their mentorship and community have shaped the woman I am becoming.",
        photoUrl: AmerImg,
    },
    {
        id: "demo-4",
        name: "Aluel K.",
        role: "Vocational trainee, TEYA Institute",
        quote: "The vocational scholarship gave me practical skills in tailoring. I now support myself and help my younger siblings with school items.",
        photoUrl: AluelImg,
    },
    {
        id: "demo-5",
        name: "Community Elder",
        role: "Arialbeek Community Leader",
        quote: "We are seeing a new generation of educated girls who will lead our community with wisdom and compassion. NCAA is planting good seeds.",
        photoUrl: YarGImg,
    },
    {
        id: "demo-6",
        name: "NCAA Member",
        role: "Diaspora member, Nairobi",
        quote: "Giving through NCAA feels personal. You see exactly how your contribution is changing real lives back home.",
        photoUrl: YarKImg,
    },
];

function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="group relative flex w-[340px] shrink-0 gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card md:w-[380px]">
            {t.photoUrl ? (
                <img
                    src={t.photoUrl}
                    alt={t.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
                />
            ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-2 ring-primary/20">
                    {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                </div>
            )}
            <div className="min-w-0 flex flex-col">
                <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-4">
                    &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-2">
                    <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="mt-3">
                    <Button asChild variant="link" className="h-auto p-0 text-xs text-primary">
                        <Link to="/scholarship">
                            Read full story
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function MarqueeRow({
    items,
    reverse = false,
    duration = 60,
}: {
    items: Testimonial[];
    reverse?: boolean;
    duration?: number;
}) {
    const prefersReduced = useReducedMotion();
    const controls = useAnimation();

    const doubled = [...items, ...items];

    useEffect(() => {
        if (prefersReduced) {
            void controls.set({ x: 0 });
            return;
        }
        const sequence = reverse ? ["0%", "-50%"] : ["-50%", "0%"];
        void controls.start({
            x: sequence,
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration,
                ease: "linear",
            },
        });
    }, [controls, prefersReduced, reverse, duration]);

    const handleHoverStart = () => {
        if (prefersReduced) return;
        controls.stop();
    };

    const handleHoverEnd = () => {
        if (prefersReduced) return;
        const sequence = reverse ? ["0%", "-50%"] : ["-50%", "0%"];
        void controls.start({
            x: sequence,
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration,
                ease: "linear",
            },
        });
    };

    return (
        <div
            className="group relative flex overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
        >
            <motion.div
                className="flex shrink-0 gap-4"
                animate={controls}
                style={{ willChange: "transform" }}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
            >
                {doubled.map((t, i) => (
                    <TestimonialCard key={`${t.id}-${i}`} t={t} />
                ))}
            </motion.div>
        </div>
    );
}

export const TestimonialsSection = () => {
    const { testimonials } = useAdminData();

    const items = testimonials.length > 0 ? testimonials : FALLBACK;

    const mid = Math.ceil(items.length / 2);
    const row1 = items.slice(0, mid);
    const row2 = items.slice(mid);
    const effectiveRow2 = row2.length > 0 ? row2 : row1;

    return (
        <section className="border-t border-border bg-gradient-to-b from-background to-muted/40 py-10 md:py-14">
            <div className="container mb-6 md:mb-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            The Impact your Support Creates
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                            Stories from our scholars, parents &amp; community
                        </h2>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <MarqueeRow items={row1} duration={50} />
                <MarqueeRow items={effectiveRow2} reverse duration={55} />
            </div>
        </section>
    );
};
