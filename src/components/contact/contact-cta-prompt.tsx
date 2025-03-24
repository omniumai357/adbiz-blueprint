
import React from "react";
import { Mail, Phone, MessageSquare, MapPin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface ContactMethod {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  action: string;
  href: string;
  priority: number;
}

export const ContactCtaPrompt = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source") || "";
  const topic = queryParams.get("topic") || "";
  
  // Define all contact methods
  const allContactMethods: ContactMethod[] = [
    {
      id: "email",
      icon: <Mail className="h-5 w-5" />,
      label: "Email Us",
      prompt: "Have a detailed question? Send us an email and we'll respond within 24 hours.",
      action: "Send Email",
      href: "#email-form",
      priority: 3
    },
    {
      id: "phone",
      icon: <Phone className="h-5 w-5" />,
      label: "Call Us",
      prompt: "Need immediate assistance? Our support team is available Mon-Fri, 9am-5pm.",
      action: "Call Now",
      href: "tel:+1234567890",
      priority: 2
    },
    {
      id: "chat",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Live Chat",
      prompt: "Get quick answers to your questions through our live chat support.",
      action: "Start Chat",
      href: "#chat",
      priority: 1
    },
    {
      id: "visit",
      icon: <MapPin className="h-5 w-5" />,
      label: "Visit Us",
      prompt: "Prefer an in-person meeting? Come visit our office during business hours.",
      action: "Get Directions",
      href: "https://maps.google.com",
      priority: 4
    },
    {
      id: "website",
      icon: <LinkIcon className="h-5 w-5" />,
      label: "Website",
      prompt: "Explore our website to find more information about our services.",
      action: "Browse Site",
      href: "/",
      priority: 5
    }
  ];
  
  // Context-based prioritization
  const getPrioritizedMethods = (): ContactMethod[] => {
    let methods = [...allContactMethods];
    
    // Prioritize based on source (where the user came from)
    if (source === "pricing") {
      // Prioritize immediate communication channels for pricing questions
      methods = methods.map(method => ({
        ...method,
        priority: method.id === "phone" ? 1 : 
                  method.id === "chat" ? 2 : method.priority
      }));
    } else if (source === "blog") {
      // Prioritize email for blog visitors who might have more detailed questions
      methods = methods.map(method => ({
        ...method,
        priority: method.id === "email" ? 1 : method.priority
      }));
    } else if (source === "services") {
      // For service page visitors, emphasize chat and call options
      methods = methods.map(method => ({
        ...method,
        priority: method.id === "chat" ? 1 : 
                  method.id === "phone" ? 2 : method.priority
      }));
    }
    
    // Adjust prompts based on topic if provided
    if (topic) {
      methods = methods.map(method => {
        if (method.id === "email" && topic === "support") {
          return {
            ...method,
            prompt: "Need technical support? Email our dedicated support team for assistance.",
            priority: 1
          };
        } else if (method.id === "phone" && topic === "sales") {
          return {
            ...method,
            prompt: "Interested in our services? Speak directly with our sales team.",
            priority: 1
          };
        } else if (method.id === "chat" && topic === "quick-question") {
          return {
            ...method,
            prompt: "Have a quick question? Our chat support can help you right away.",
            priority: 1
          };
        }
        return method;
      });
    }
    
    // Sort by priority
    return methods.sort((a, b) => a.priority - b.priority);
  };
  
  const prioritizedMethods = getPrioritizedMethods();
  
  // Get the top method for the main CTA
  const primaryMethod = prioritizedMethods[0];
  // Get the next 2 methods for secondary CTAs
  const secondaryMethods = prioritizedMethods.slice(1, 3);
  
  return (
    <div className="bg-gradient-to-r from-muted/50 to-background p-6 rounded-lg mb-8">
      <h3 className="text-xl font-bold mb-4">How Can We Help You?</h3>
      
      {/* Primary CTA */}
      <div className="bg-card border shadow-sm rounded-lg p-5 mb-4">
        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            {primaryMethod.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{primaryMethod.label}</h4>
            <p className="text-muted-foreground mb-3">{primaryMethod.prompt}</p>
            <Button 
              className="mt-2" 
              size="lg"
              onClick={() => {
                // Scroll to form if it's an anchor link
                if (primaryMethod.href.startsWith('#')) {
                  const element = document.querySelector(primaryMethod.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              {...(primaryMethod.href.startsWith('#') ? {} : { as: 'a', href: primaryMethod.href })}
            >
              {primaryMethod.action}
              {primaryMethod.icon}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Secondary CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secondaryMethods.map((method) => (
          <div key={method.id} className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="bg-background p-2 rounded-full mr-2">
                {method.icon}
              </div>
              <h4 className="font-medium">{method.label}</h4>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{method.prompt}</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={() => {
                if (method.href.startsWith('#')) {
                  const element = document.querySelector(method.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              {...(method.href.startsWith('#') ? {} : { as: 'a', href: method.href })}
            >
              {method.action}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
