
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/data";

interface TestimonialsSectionProps {
  isVisible: Record<string, boolean>;
}

const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
  return (
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
  );
};

export default TestimonialsSection;
