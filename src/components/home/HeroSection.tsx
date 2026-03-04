import { Users, Vote, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Import background images (Arialbeek first so it appears when the site opens)
import arialbeekImage from "@/images/Arialbeek.jpeg";
import ncaImage from "@/images/nca.jpg";
import ncagoodImage from "@/images/ncagood.jpg";
import nca2Image from "@/images/nca2.jpg";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [arialbeekImage, ncaImage, ncagoodImage, nca2Image];
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  // Rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-36">
      {/* Rotating Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              opacity: currentImageIndex === index ? 1 : 0,
            }}
          />
        ))}
        {/* Brand-colored overlay for harmony with color scheme */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(278 42% 34% / 0.5) 0%, hsl(276 46% 30% / 0.4) 100%)',
          }}
        />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1.5 text-xs sm:text-sm font-medium text-white opacity-0 animate-fade-up backdrop-blur-sm max-w-full"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            <span className="flex h-2 w-2 rounded-full bg-white shrink-0" />
            <span className="truncate">Empowering Twic East Girls</span>
          </div>

          {/* Headline */}
          <h1
            className="mb-10 font-heading text-2xl sm:text-4xl font-bold leading-tight text-white opacity-0 animate-fade-up stagger-1 md:text-5xl lg:text-6xl px-2"
            style={{ textShadow: '0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Nyan Cit Arialbeek Association (NCAA)
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mb-10 max-w-2xl text-base sm:text-lg leading-relaxed text-white opacity-0 animate-fade-up stagger-2 md:text-xl px-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
          >
            United in purpose, strong in community. We champion the education,
            welfare, and empowerment of girls from Twic East across South Sudan
            and the diaspora.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonContainerRef} className="flex flex-row items-center justify-center gap-2 sm:gap-4 opacity-0 animate-fade-up stagger-3 flex-wrap px-2">
            <Button variant="hero" size="lg" className="text-sm sm:text-base h-11 sm:h-14 px-3 sm:px-10 shrink basis-auto min-w-fit" asChild>
              <Link to="/register">
                Become a Member
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-sm sm:text-base h-11 sm:h-14 px-3 sm:px-10 shrink basis-auto min-w-fit" asChild>
              <Link to="/about">Learn About TEGA</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 opacity-0 animate-fade-up stagger-4 md:mt-16 md:gap-8 px-2">
            <div className="rounded-xl bg-white/20 p-2 sm:p-4 backdrop-blur-sm md:p-6 border border-white/30 min-w-0">
              <Users className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-white md:h-8 md:w-8" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              <p
                className="font-heading text-lg sm:text-2xl font-bold text-white md:text-3xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                2,500+
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 md:text-sm"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              >
                Active Members
              </p>
            </div>
            <div className="rounded-xl bg-white/20 p-2 sm:p-4 backdrop-blur-sm md:p-6 border border-white/30 min-w-0">
              <Vote className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-white md:h-8 md:w-8" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              <p
                className="font-heading text-lg sm:text-2xl font-bold text-white md:text-3xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                6
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 md:text-sm"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              >
                Payam Chapters
              </p>
            </div>
            <div className="rounded-xl bg-white/20 p-2 sm:p-4 backdrop-blur-sm md:p-6 border border-white/30 min-w-0">
              <Calendar className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-white md:h-8 md:w-8" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              <p
                className="font-heading text-lg sm:text-2xl font-bold text-white md:text-3xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                2023
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 md:text-sm"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              >
                Established
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
