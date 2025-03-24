
import { useState } from "react";
import { PackageCard } from "./PackageCard";
import { Button } from "@/components/ui/button";
import { packages, serviceCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Calendar, PenLine, Award } from "lucide-react";

const iconMap = {
  Calendar: Calendar,
  Pencil: PenLine,
  Award: Award,
};

export const ServicePackages = () => {
  const [selectedCategory, setSelectedCategory] = useState("monthly");

  const filteredPackages = packages.filter(
    (pkg) => pkg.category === selectedCategory
  );

  return (
    <section className="py-24" id="packages">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Service Packages</h2>
          <p className="text-muted-foreground">
            Select the perfect advertising package to meet your business needs and goals.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={cn(
                  "min-w-[180px] justify-start gap-2 animate-scale-in [animation-delay:300ms]",
                  selectedCategory === category.id
                    ? ""
                    : "hover:bg-secondary/50"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4" />
                {category.title}
              </Button>
            );
          })}
        </div>

        {/* Selected category description */}
        <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
          <p className="text-muted-foreground">
            {serviceCategories.find((c) => c.id === selectedCategory)?.description}
          </p>
        </div>

        {/* Package cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className="animate-fade-up" 
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePackages;
