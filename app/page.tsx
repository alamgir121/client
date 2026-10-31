import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { UpcomingSection } from "@/components/home/upcoming";
import { Gallery } from "@/components/home/gallery";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <UpcomingSection />
      <Gallery />
      <Newsletter />
    </>
  );
}
