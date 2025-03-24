
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicePackages from "@/components/ServicePackages";
import Footer from "@/components/Footer";
import { serviceCategories, testimonials, faqItems } from "@/lib/data";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

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
        <section 
          id="features" 
          className="py-24 bg-secondary/30"
        >
          <div className="container px-4 mx-auto">
            <div 
              className="max-w-2xl mx-auto text-center mb-16 animate-on-scroll"
              id="features-title"
            >
              <h2 className={`text-3xl font-bold mb-4 ${isVisible["features-title"] ? "animate-fade-up" : "opacity-0"}`}>
                Why Choose AdBiz Pro
              </h2>
              <p className={`text-muted-foreground ${isVisible["features-title"] ? "animate-fade-up [animation-delay:200ms]" : "opacity-0"}`}>
                We deliver effective advertising solutions that drive real results for your business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "feature-1",
                  title: "Expert Ad Creation",
                  description: "Our team of advertising specialists crafts ads that convert, using proven strategies and SEO techniques.",
                  icon: "🚀",
                },
                {
                  id: "feature-2",
                  title: "Strategic Placement",
                  description: "We ensure your ads are placed where your target audience will see them, maximizing visibility and engagement.",
                  icon: "🎯",
                },
                {
                  id: "feature-3",
                  title: "Performance Analytics",
                  description: "Track the success of your advertising campaigns with detailed analytics and regular reporting.",
                  icon: "📊",
                },
              ].map((feature, index) => (
                <div 
                  key={feature.id}
                  className={`bg-card border border-border rounded-lg p-6 animate-on-scroll ${
                    isVisible[feature.id] 
                      ? "animate-fade-up" 
                      : "opacity-0"
                  }`}
                  id={feature.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 text-2xl">
                    {feature.icon === "🚀" && <CheckCircle className="h-8 w-8 text-primary" />}
                    {feature.icon === "🎯" && <Star className="h-8 w-8 text-primary" />}
                    {feature.icon === "📊" && <div className="h-8 w-8 bg-primary rounded-full grid place-items-center text-white font-bold">A</div>}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Service Categories */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <div 
              className="max-w-2xl mx-auto text-center mb-16 animate-on-scroll"
              id="services-title"
            >
              <h2 className={`text-3xl font-bold mb-4 ${isVisible["services-title"] ? "animate-fade-up" : "opacity-0"}`}>
                Our Services
              </h2>
              <p className={`text-muted-foreground ${isVisible["services-title"] ? "animate-fade-up [animation-delay:200ms]" : "opacity-0"}`}>
                Choose from our range of advertising services designed to meet your specific needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceCategories.map((category, index) => (
                <div 
                  key={category.id}
                  className={`group relative overflow-hidden border border-border rounded-lg hover:shadow-lg transition-all duration-300 animate-on-scroll ${
                    isVisible[`service-${index}`] 
                      ? "animate-fade-up" 
                      : "opacity-0"
                  }`}
                  id={`service-${index}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-primary/5 transform transition-transform duration-500 group-hover:scale-95" />
                  
                  <div className="relative p-6">
                    <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {category.icon === "Calendar" && <div className="h-6 w-6 text-primary font-bold">C</div>}
                      {category.icon === "Pencil" && <div className="h-6 w-6 text-primary font-bold">S</div>}
                      {category.icon === "Award" && <div className="h-6 w-6 text-primary font-bold">P</div>}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">{category.description}</p>
                    
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <Link to={`/services?category=${category.id}`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Package Section */}
        <ServicePackages />
        
        {/* Testimonials */}
        <section 
          className="py-24 bg-secondary/30 animate-on-scroll"
          id="testimonials"
        >
          <div className="container px-4 mx-auto">
            <div 
              className={`max-w-2xl mx-auto text-center mb-16 ${isVisible["testimonials"] ? "animate-fade-up" : "opacity-0"}`}
            >
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground">
                Don't just take our word for it. Here's what our clients have to say about our services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.id}
                  className={`card-hover ${isVisible["testimonials"] ? "animate-fade-up" : "opacity-0"}`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        <div className="text-center text-primary font-bold">{testimonial.name.charAt(0)}</div>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="italic text-muted-foreground">{testimonial.content}</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section 
          className="py-24 animate-on-scroll"
          id="faq"
        >
          <div className="container px-4 mx-auto">
            <div 
              className={`max-w-2xl mx-auto text-center mb-16 ${isVisible["faq"] ? "animate-fade-up" : "opacity-0"}`}
            >
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Got questions? We've got answers. If you don't see your question listed, feel free to contact us.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className={`border-b ${isVisible["faq"] ? "animate-fade-up" : "opacity-0"}`}
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div 
              className={`text-center mt-12 ${isVisible["faq"] ? "animate-fade-up [animation-delay:600ms]" : "opacity-0"}`}
            >
              <p className="text-muted-foreground mb-6">
                Still have questions? We're here to help.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 animate-fade-up">Ready to Boost Your Business?</h2>
              <p className="text-primary-foreground/80 mb-8 animate-fade-up [animation-delay:200ms]">
                Start with one of our advertising packages today and see the results for yourself.
              </p>
              <Button 
                asChild 
                variant="secondary" 
                size="lg" 
                className="animate-fade-up [animation-delay:400ms]"
              >
                <Link to="/services">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
