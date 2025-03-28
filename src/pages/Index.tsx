
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
import { ContentSection } from "@/components/ui/content-section";
import { ContentStack } from "@/components/ui/spacing";
import { ResponsiveHeading } from "@/components/ui/responsive-typography";

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
        <ContentSection padding="none" size="full">
          <Hero />
        </ContentSection>
        
        {/* Features Section */}
        <ContentSection 
          heading="Our Key Features" 
          description="Discover what makes us different"
          padding="xl"
          variant="default"
        >
          <FeaturesSection isVisible={isVisible} />
        </ContentSection>
        
        {/* Service Categories */}
        <ContentSection
          heading="Service Categories"
          description="Browse our services by category"
          padding="lg"
          variant="muted"
        >
          <ServiceCategoriesSection isVisible={isVisible} />
        </ContentSection>
        
        {/* Package Section */}
        <ContentSection
          heading="Our Service Packages"
          description="Choose the package that fits your needs"
          padding="xl"
        >
          <ServicePackages />
        </ContentSection>
        
        {/* Testimonials */}
        <ContentSection
          heading="What Our Clients Say"
          description="Read testimonials from our happy customers"
          padding="lg"
          variant="secondary"
          centered
        >
          <TestimonialsSection isVisible={isVisible} />
        </ContentSection>
        
        {/* FAQ Section */}
        <ContentSection
          heading="Frequently Asked Questions"
          description="Find answers to common questions"
          padding="xl"
        >
          <FAQSection isVisible={isVisible} />
        </ContentSection>
        
        {/* CTA Section */}
        <ContentSection padding="lg" variant="primary">
          <CTASection />
        </ContentSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
