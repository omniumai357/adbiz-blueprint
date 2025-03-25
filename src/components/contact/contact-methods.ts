
import { Mail, Phone, MessageSquare, MapPin, Link as LinkIcon } from "lucide-react";
import { ContactMethod } from "./types";

// Define all contact methods
export const allContactMethods: ContactMethod[] = [
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

export const getPrioritizedMethods = (
  source: string = "",
  topic: string = ""
): ContactMethod[] => {
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
