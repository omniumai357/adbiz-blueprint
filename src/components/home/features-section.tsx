import { useState, useEffect } from "react";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  isVisible: Record<string, boolean>;
}

const FeaturesSection = ({ isVisible }: FeaturesSectionProps) => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
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
  );
};

export default FeaturesSection;
