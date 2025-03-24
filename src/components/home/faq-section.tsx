import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";

interface FAQSectionProps {
  isVisible: Record<string, boolean>;
}

const FAQSection = ({ isVisible }: FAQSectionProps) => {
  return (
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
  );
};

export default FAQSection;
