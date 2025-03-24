
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/lib/data";

interface ServiceCategoriesSectionProps {
  isVisible: Record<string, boolean>;
}

const ServiceCategoriesSection = ({ isVisible }: ServiceCategoriesSectionProps) => {
  return (
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
  );
};

export default ServiceCategoriesSection;
