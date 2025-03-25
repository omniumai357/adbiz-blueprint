import React from 'react';
import { getPrioritizedMethods } from '@/components/contact/contact-methods';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const topic = searchParams.get('topic') || '';
  const serviceCategory = searchParams.get('category') || '';
  
  const contactMethods = getPrioritizedMethods(source, topic, serviceCategory);
  
  return (
    <>
      <div id="contact-banner" className="mb-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-600">We're here to help. Reach out to us through any of these channels.</p>
      </div>
      
      <div id="contact-methods" className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactMethods.map((method) => (
          <Card key={method.id} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                {method.icon}
                <CardTitle>{method.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{method.prompt}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <a href={method.href}>{method.action}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div id="contact-form" className="mb-8 bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input 
                id="name" 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input 
                id="email" 
                type="email" 
                className="w-full p-2 border rounded-md" 
                placeholder="Your email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
            <input 
              id="subject" 
              type="text" 
              className="w-full p-2 border rounded-md" 
              placeholder="Message subject"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">Message</label>
            <textarea 
              id="message" 
              rows={5} 
              className="w-full p-2 border rounded-md" 
              placeholder="Your message"
            ></textarea>
          </div>
          <Button type="submit" className="w-full md:w-auto">Send Message</Button>
        </form>
      </div>
      
      <div id="faqs-section" className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-medium text-lg mb-1">What are your business hours?</h3>
            <p className="text-muted-foreground">Our support team is available Monday through Friday, 9am to 5pm EST.</p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium text-lg mb-1">How quickly will I receive a response?</h3>
            <p className="text-muted-foreground">We aim to respond to all inquiries within 24 business hours.</p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium text-lg mb-1">Do you offer custom solutions?</h3>
            <p className="text-muted-foreground">Yes, we can tailor our services to meet your specific business needs. Contact our sales team to discuss custom options.</p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium text-lg mb-1">How do I request a refund?</h3>
            <p className="text-muted-foreground">Refund requests should be submitted through our support email with your order number and reason for the request.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
