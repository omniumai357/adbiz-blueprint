
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { companyInfo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4 animate-fade-up">About Us</h1>
              <p className="text-muted-foreground mb-6 animate-fade-up [animation-delay:200ms]">
                Learn more about our mission to help businesses grow through effective advertising.
              </p>
            </div>
          </div>
        </section>
        
        {/* Company Info Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in {companyInfo.year}, {companyInfo.name} was created with a simple mission: to help businesses of all sizes succeed through effective, results-driven advertising.
                </p>
                <p className="text-muted-foreground mb-4">
                  We recognized that many businesses struggle to create and maintain effective advertising campaigns, often wasting valuable resources on strategies that don't deliver results.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our team of advertising specialists brings decades of combined experience across multiple industries, allowing us to craft customized solutions that address the unique challenges and opportunities of each business we work with.
                </p>
                <Button asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
              
              <div className="relative animate-fade-up [animation-delay:300ms]">
                <div className="aspect-video bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary">{companyInfo.name}</div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-2/3 aspect-video bg-secondary rounded-lg border border-border" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">
                These core principles guide everything we do and ensure we deliver the best possible service to our clients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Clock className="h-8 w-8 text-primary" />,
                  title: "Results-Driven",
                  description: "We focus on delivering measurable results that directly impact your business growth. Your success is our success.",
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "Client Partnership",
                  description: "We build lasting relationships with our clients based on trust, transparency, and mutual success.",
                },
                {
                  icon: <Target className="h-8 w-8 text-primary" />,
                  title: "Innovation",
                  description: "We continuously adapt our strategies to leverage the latest technologies and platforms for maximum effectiveness.",
                },
                {
                  icon: <Award className="h-8 w-8 text-primary" />,
                  title: "Excellence",
                  description: "We hold ourselves to the highest standards in everything we do, from campaign planning to execution and reporting.",
                },
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-lg p-6 animate-fade-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground">
                Meet the experts behind our successful advertising campaigns.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Alex Morgan",
                  role: "Founder & CEO",
                  bio: "With over 15 years in digital marketing, Alex leads our strategic vision and client relationships.",
                },
                {
                  name: "Jamie Chen",
                  role: "Creative Director",
                  bio: "Jamie brings creative expertise to every campaign, ensuring compelling visuals and messaging.",
                },
                {
                  name: "Taylor Reynolds",
                  role: "Head of SEO",
                  bio: "Taylor specializes in search optimization strategies that drive organic traffic and conversions.",
                },
              ].map((member, index) => (
                <div 
                  key={index} 
                  className="border border-border rounded-lg overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="aspect-[3/2] bg-primary/10 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 animate-fade-up">Ready to Work With Us?</h2>
              <p className="text-primary-foreground/80 mb-8 animate-fade-up [animation-delay:200ms]">
                Let's discuss how we can help your business grow through effective advertising.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up [animation-delay:400ms]">
                <Button asChild variant="secondary">
                  <Link to="/services">Explore Services</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
