
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
