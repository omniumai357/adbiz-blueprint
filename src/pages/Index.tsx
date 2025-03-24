import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicePackages from "@/components/ServicePackages";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/home/features-section";
import ServiceCategoriesSection from "@/components/home/ServiceCategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";

const Index = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Intersection Observer setup for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <FeaturesSection isVisible={isVisible} />
        
        {/* Service Categories */}
        <ServiceCategoriesSection isVisible={isVisible} />
        
        {/* Package Section */}
        <ServicePackages />
        
        {/* Testimonials */}
        <TestimonialsSection isVisible={isVisible} />
        
        {/* FAQ Section */}
        <FAQSection isVisible={isVisible} />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
