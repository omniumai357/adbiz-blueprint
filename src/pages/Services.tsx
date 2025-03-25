import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { ContactCtaPrompt } from "@/components/contact/contact-cta-prompt";
import { packages, serviceCategories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TourButton } from "@/components/tour/TourButton";

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("monthly");
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    
    if (categoryParam && ["monthly", "custom", "platinum"].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    navigate(`/services?category=${category}`);
  };
  
  const filteredPackages = packages.filter(
    (pkg) => pkg.category === selectedCategory
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Services Banner */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 mb-8">
          <div className="container px-4 mx-auto">
            <div className="relative max-w-2xl mx-auto text-center">
              <h1 id="services-title" className="text-4xl font-bold mb-4 animate-fade-up">Our Services</h1>
              <p className="text-muted-foreground animate-fade-up [animation-delay:200ms]">
                Find the perfect advertising solution tailored to your business needs.
              </p>
              <div className="absolute top-0 right-0">
                <TourButton pathId="services-tour" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Contextual CTA - Positioned strategically above the category selection */}
        <section className="mb-8">
          <div className="container px-4 mx-auto">
            <div id="contact-cta">
              <ContactCtaPrompt />
            </div>
          </div>
        </section>
        
        {/* Category Selection */}
        <section className="mb-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div id="category-selection" className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
                {serviceCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "h-auto py-4 justify-start flex-col items-start text-left",
                      selectedCategory === category.id
                        ? ""
                        : "hover:bg-secondary/50"
                    )}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <span className="text-lg font-medium mb-1">{category.title}</span>
                    <span className={`text-xs ${selectedCategory === category.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {category.description}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Selected Category Description */}
        <section className="mb-8">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto text-center animate-fade-up">
              <h2 className="text-2xl font-bold mb-3">
                {serviceCategories.find((c) => c.id === selectedCategory)?.title}
              </h2>
              <p className="text-muted-foreground">
                {serviceCategories.find((c) => c.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </section>
        
        {/* Packages Grid */}
        <section className="mb-16">
          <div className="container px-4 mx-auto">
            <div id="packages-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredPackages.map((pkg, index) => (
                <div 
                  key={pkg.id} 
                  className="animate-fade-up" 
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div id={index === 0 ? "package-features" : undefined}>
                    <PackageCard pkg={pkg} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Need Help CTA */}
        <section className="bg-secondary/30 py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 animate-fade-up">Need Custom Solutions?</h2>
              <p className="text-muted-foreground mb-8 animate-fade-up [animation-delay:200ms]">
                If you don't see a package that fits your needs, we can create a custom solution tailored specifically for your business.
              </p>
              <Button 
                asChild 
                className="animate-fade-up [animation-delay:400ms]"
              >
                <a href="/contact">Contact For Custom Pricing</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
