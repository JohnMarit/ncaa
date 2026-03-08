import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowLeft, Sparkles, Star } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Floating particles component (2D version)
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated number counter component
const AnimatedCounter = ({ value, duration = 2, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.2 }
    );

    obs.observe(el);

    // Fallback: ensure it starts even if already visible at mount.
    const rect = el.getBoundingClientRect();
    const inViewport = rect.bottom >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
    if (inViewport) setHasStarted(true);

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    // Reset on refresh/remount and when value changes.
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startRef.current = null;
    setCount(0);

    const to = Math.max(0, Number.isFinite(value) ? value : 0);
    const ms = Math.max(200, duration * 1000);

    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / ms);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(to * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [hasStarted, value, duration]);

  return (
    <span ref={elRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Floating stars component
const FloatingStars = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
        >
          <Star className="w-2 h-2" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useAdminData();
  const published = events.filter((e) => e.published !== false);
  const event = id ? published.find((e) => e.id === id) : null;
  
  // Animation hooks
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.8]), { stiffness: 100, damping: 20 });
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toParagraphs = (text: string): string[] => {
    const normalized = text.replace(/\r\n/g, "\n");
    const parts = normalized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
    return normalized.split("\n").map((p) => p.trim()).filter(Boolean);
  };

  const gallery = event?.images && event.images.length > 0
    ? event.images
    : event?.image
      ? [event.image]
      : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="font-heading text-2xl font-bold mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Event not found
            </motion.h1>
            <p className="text-muted-foreground mb-6">The event you're looking for may have been removed or the link is incorrect.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline">
                <Link to="/events">Back to Events</Link>
              </Button>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950">
      {/* Animated background elements */}
      <FloatingParticles />
      <FloatingStars />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <Header />
      <main className="flex-1 relative z-20">
        {/* Hero Section with Parallax */}
        <motion.section 
          className="py-12 md:py-16 relative"
          style={{ y: backgroundY }}
        >
          <div className="container relative">
            {/* Floating sparkles */}
            <motion.div
              className="absolute top-0 right-0 text-yellow-400"
              variants={floatVariants}
              initial="initial"
              animate="animate"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants}>
                <Button asChild variant="ghost" size="sm" className="mb-4 text-primary hover:bg-primary/10 backdrop-blur-sm">
                  <Link to="/events" className="inline-flex items-center gap-2">
                    <motion.div
                      whileHover={{ x: -3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </motion.div>
                    Back to Events
                  </Link>
                </Button>
              </motion.div>
              
              <motion.h1 
                className="font-heading text-3xl font-bold md:text-4xl relative"
                variants={itemVariants}
                style={{ y: textY, scale }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {event.title}
                </motion.span>
                <span className="relative bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {event.title}
                </span>
              </motion.h1>
              
              <motion.div 
                className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground"
                variants={itemVariants}
              >
                <motion.span 
                  className="inline-flex items-center gap-2 backdrop-blur-sm bg-background/20 px-3 py-1 rounded-full border border-border/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Calendar className="h-4 w-4" />
                  </motion.div>
                  {event.date}
                </motion.span>
                
                {event.time && (
                  <motion.span 
                    className="inline-flex items-center gap-2 backdrop-blur-sm bg-background/20 px-3 py-1 rounded-full border border-border/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-4 w-4" />
                    </motion.div>
                    {event.time}
                  </motion.span>
                )}
                
                <motion.span 
                  className="inline-flex items-center gap-2 backdrop-blur-sm bg-background/20 px-3 py-1 rounded-full border border-border/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    <MapPin className="h-4 w-4" />
                  </motion.div>
                  {event.location}
                </motion.span>

                {/* Animated attendee count */}
                {event.attendees && (
                  <motion.span 
                    className="inline-flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 rounded-full border border-purple-400/30"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </motion.div>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      <AnimatedCounter value={event.attendees} duration={2.5} /> attendees
                    </span>
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Content Section with Staggered Animations */}
        <motion.section 
          className="py-12 md:py-16 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container max-w-3xl relative">
            {/* Animated stats cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-xl border border-purple-400/20 text-center"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-2"
                >
                  <Star className="h-6 w-6 text-yellow-400 mx-auto" fill="currentColor" />
                </motion.div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  <AnimatedCounter value={event.attendees || 0} duration={2} />
                </div>
                <div className="text-sm text-muted-foreground">Attendees</div>
              </motion.div>

              <motion.div
                className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-400/20 text-center"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-2"
                >
                  <Sparkles className="h-6 w-6 text-blue-400 mx-auto" />
                </motion.div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <AnimatedCounter value={gallery.length} duration={1.5} />
                </div>
                <div className="text-sm text-muted-foreground">Photos</div>
              </motion.div>

              <motion.div
                className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 rounded-xl border border-green-400/20 text-center"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-2"
                >
                  <Calendar className="h-6 w-6 text-green-400 mx-auto" />
                </motion.div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Date(event.date).getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">Year</div>
              </motion.div>
            </motion.div>
            {/* Main image with ethereal effects */}
            <AnimatePresence>
              {gallery[0] && (
                <motion.div 
                  className="mb-8 relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5] 
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="relative rounded-xl overflow-hidden border border-border shadow-lg backdrop-blur-sm bg-background/10">
                    <motion.img
                      src={gallery[0]}
                      alt={event.title}
                      className="w-full h-auto object-cover max-h-[400px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    
                    {/* Floating particles overlay */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full blur-sm" />
                      <div className="absolute top-8 right-8 w-3 h-3 bg-blue-400 rounded-full blur-sm" />
                      <div className="absolute bottom-6 left-12 w-2 h-2 bg-yellow-400 rounded-full blur-sm" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gallery grid with hover effects */}
            <AnimatePresence>
              {gallery.length > 1 && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {gallery.slice(1).map((img, idx) => (
                      <motion.div 
                        key={idx} 
                        className="relative group rounded-xl overflow-hidden border border-border shadow-md backdrop-blur-sm bg-background/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.3)"
                        }}
                      >
                        {/* Hover glow */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        
                        <motion.img
                          src={img}
                          alt={`${event.title} image ${idx + 2}`}
                          className="w-full h-36 object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        
                        {/* Floating sparkles on hover */}
                        <motion.div
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description with ethereal typography */}
            <motion.div 
              className="prose prose-neutral dark:prose-invert max-w-none relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Reading progress bar */}
              <motion.div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeOut" }}
                viewport={{ once: true }}
              />
              
              {/* Background glow for text */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-blue-400/5 rounded-xl blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3] 
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              <div className="relative space-y-4">
                {toParagraphs(event.description).map((p, idx) => (
                  <motion.p 
                    key={idx} 
                    className="text-muted-foreground leading-relaxed text-lg backdrop-blur-sm bg-background/30 p-4 rounded-lg border border-border/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: "rgba(139, 92, 246, 0.05)",
                      borderColor: "rgba(139, 92, 246, 0.3)"
                    }}
                  >
                    <motion.span
                      className="absolute -left-2 top-0 text-purple-400 opacity-0"
                      whileHover={{ opacity: 0.5 }}
                    >
                      ✨
                    </motion.span>
                    {/* Animated word count */}
                    <motion.span
                      className="absolute -right-2 -top-2 text-xs text-muted-foreground/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <AnimatedCounter value={p.split(' ').length} duration={1} /> words
                    </motion.span>
                    {p}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, -15, 0],
                y: [0, 15, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
