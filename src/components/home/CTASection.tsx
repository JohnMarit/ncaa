import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-4 sm:p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl text-center px-2">
            <h2 className="mb-4 font-heading text-2xl sm:text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Join Our Growing Community
            </h2>
            <p className="mb-8 text-base sm:text-lg text-primary-foreground/90 md:text-xl">
              Become a member of Nyan Cit Arialbeek today. Together, we can
              strengthen our bonds, support our sisters, and build a brighter
              future for Twic East girls everywhere.
            </p>
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap px-2">
              <Button
                variant="hero"
                size="lg"
                className="text-sm sm:text-base h-11 sm:h-14 px-3 sm:px-10 shrink basis-auto min-w-fit"
                asChild
              >
                <Link to="/register">
                  Register as a Member
                </Link>
              </Button>
              <Button
                variant="heroOutline"
                size="lg"
                className="text-sm sm:text-base h-11 sm:h-14 px-3 sm:px-10 shrink basis-auto min-w-fit"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
