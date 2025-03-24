
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { companyInfo } from "@/lib/data";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      
      {/* Abstract shapes */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-block mb-6 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full animate-fade-in">
            {companyInfo.tagline}
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-up [animation-delay:200ms]">
            Elevate Your Business with Strategic Advertising
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up [animation-delay:400ms]">
            Professional advertising services designed to increase visibility, drive traffic, and boost conversions for your business.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up [animation-delay:600ms]">
            <Button 
              asChild 
              size="lg" 
              className="button-transition hover:shadow-md hover:scale-105"
            >
              <Link to="/services">
                Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="button-transition hover:shadow-sm"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
