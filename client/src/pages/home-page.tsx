import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ChatbotDemo } from "@/components/chatbot-demo";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Scroll to the hash if present
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ChatbotDemo />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
