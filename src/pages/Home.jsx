import Hero from "@/components/home/Hero";
import DisasterShowcase from "@/components/home/DisasterShowcase";
import LiveStatus from "@/components/home/LiveStatus";
import QuickActions from "@/components/home/QuickActions";
import HowItWorks from "@/components/home/HowItWorks";
import MapPreview from "@/components/home/MapPreview";
import Community from "@/components/home/Community";
import EmergencyCTA from "@/components/home/EmergencyCTA";
export default function Home() {
  return (
    <>
      <Hero />
      <DisasterShowcase />
      <LiveStatus />
      <QuickActions />
      <HowItWorks />
      <MapPreview />
      <Community />
      <EmergencyCTA />
    </>
  );
}
