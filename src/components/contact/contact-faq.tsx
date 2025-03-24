
interface FAQ {
  question: string;
  answer: string;
}

interface ContactFAQProps {
  faqs: FAQ[];
}

export const ContactFAQ = ({ faqs }: ContactFAQProps) => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about our services.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-lg p-6 animate-fade-up"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
