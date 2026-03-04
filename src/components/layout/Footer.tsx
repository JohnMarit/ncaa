import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter } from "lucide-react";
import ncaLogo from "@/images/final-logo.png";

const footerLinks = {
  organization: [
    { name: "About NCAA", href: "/about" },
    { name: "Leadership", href: "/leadership" },
    { name: "Constitution", href: "/documents/constitution" },
    { name: "Regulations", href: "/documents/regulations" },
  ],
  members: [
    { name: "Join NCAA", href: "/membership" },
    { name: "Member Portal", href: "/portal" },
    { name: "Pay Dues", href: "/payments" },
    { name: "Directory", href: "/directory" },
  ],
  resources: [
    { name: "Events", href: "/events" },
    { name: "Elections", href: "/elections" },
    { name: "Documents", href: "/documents" },
    { name: "News", href: "/news" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={ncaLogo}
                alt="NCAA Logo"
                className="h-14 w-auto object-contain"
              />
              <div>
                <p className="font-heading text-xl font-bold text-foreground">
                  Nyan Cit Arialbeek Association
                </p>
                <p className="text-sm text-muted-foreground">
                  NCAA
                </p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Empowering the women of Twic East through unity, education, and
              community development. Together we build a brighter future.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://web.facebook.com/profile.php?id=61581974382480"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Organization
            </h3>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Members
            </h3>
            <ul className="space-y-3">
              {footerLinks.members.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Juba, South Sudan</span>
              </li>
              <li>
                <a
                  href="mailto:info@ncaa.org.ss"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@ncaa.org.ss</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+211920287970"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  <span>+211 920 287 970</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nyan Cit Arialbeek Association (NCAA). All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
