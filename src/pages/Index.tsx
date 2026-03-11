import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { LeadershipPreview } from "@/components/home/LeadershipPreview";
import { GovernancePreview } from "@/components/home/GovernancePreview";
import { MembershipPreview } from "@/components/home/MembershipPreview";
import { ElectionsPreview } from "@/components/home/ElectionsPreview";
import { UpcomingEventsPreview } from "@/components/home/UpcomingEventsPreview";
import { PastEventsPreview } from "@/components/home/PastEventsPreview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { CTASection } from "@/components/home/CTASection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MentorsSection } from "@/components/home/MentorsSection";
import { PartnersSection } from "@/components/home/PartnersSection";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TestimonialsSection />
        <MissionSection />
        <LeadershipPreview />
        <GovernancePreview />
        <MembershipPreview />
        <ElectionsPreview />
        <UpcomingEventsPreview />
        <PastEventsPreview />
        <ContactPreview />
        <CTASection />
        <MentorsSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
