import { CTA } from "@/components/cta";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Features } from "@/components/features";
import { LandingBackground } from "@/components/landing-background";

export default function Home() {
  return (
    <LandingBackground>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </LandingBackground>
  );
}
