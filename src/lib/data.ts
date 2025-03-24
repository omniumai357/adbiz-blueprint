
export interface Package {
  id: string;
  title: string;
  description: string;
  category: 'monthly' | 'custom' | 'platinum';
  price: number;
  features: string[];
  popular?: boolean;
}

export const packages: Package[] = [
  {
    id: 'monthly-basic',
    title: 'Basic',
    description: 'Perfect for small businesses starting their online presence',
    category: 'monthly',
    price: 129,
    features: [
      '8 ads/posts per month',
      'Email support',
      'Ad performance metrics',
      'Basic analytics'
    ],
  },
  {
    id: 'monthly-standard',
    title: 'Standard',
    description: 'Ideal for growing businesses needing more exposure',
    category: 'monthly',
    price: 199,
    features: [
      '15 ads/posts per month',
      '24/7 support',
      'Advanced analytics',
      'A/B testing',
      'Social media integration'
    ],
    popular: true
  },
  {
    id: 'monthly-premium',
    title: 'Premium',
    description: 'Comprehensive solution for established businesses',
    category: 'monthly',
    price: 499,
    features: [
      '30 ads/posts per month',
      'Dedicated account manager',
      'Multi-channel posting',
      'Priority placement',
      'Competitor analysis',
      'Monthly performance reports'
    ],
  },
  {
    id: 'custom-tier1',
    title: 'Tier 1',
    description: 'Basic text advertising solution',
    category: 'custom',
    price: 149,
    features: [
      'SEO-optimized text ad',
      'Keyword research',
      'One revision',
      'Performance tracking'
    ],
  },
  {
    id: 'custom-tier2',
    title: 'Tier 2',
    description: 'Text and image advertising solution',
    category: 'custom',
    price: 199,
    features: [
      'SEO-optimized text ad',
      'Custom image creation',
      'Two revisions',
      'Performance tracking',
      'Social media versions'
    ],
    popular: true
  },
  {
    id: 'custom-tier3',
    title: 'Tier 3',
    description: 'Advanced advertising with text overlay',
    category: 'custom',
    price: 299,
    features: [
      'Premium SEO-optimized ad',
      'Custom image with text overlay',
      'Three revisions',
      'Enhanced tracking',
      'Social media versions',
      'Ad placement strategy'
    ],
  },
  {
    id: 'platinum',
    title: 'Platinum',
    description: 'Full 12-month comprehensive marketing campaign',
    category: 'platinum',
    price: 999,
    features: [
      'Full 12-month campaign',
      'Bonus language optimization',
      'Dedicated account manager',
      'Weekly strategy calls',
      'Custom reporting dashboard',
      'Priority support',
      'Campaign adjustments',
      'Multi-platform presence'
    ],
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'Bright Home Realty',
    content: 'The monthly posting plan transformed our online presence. We\'ve seen a 40% increase in qualified leads since we started.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Tech Solutions Inc',
    content: 'The custom SEO ads helped us target exactly the right audience. The ROI has been incredible - best marketing spend decision we\'ve made.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Sunset Landscaping',
    content: 'We tried the Platinum package and it completely changed our business. The comprehensive approach meant we didn\'t have to worry about our marketing at all.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

export const faqItems = [
  {
    question: "How soon will my ads be posted after purchasing a plan?",
    answer: "We begin working on your ads within 24 hours of purchase. For monthly plans, we spread the posts throughout the month for maximum effectiveness."
  },
  {
    question: "Can I specify which platforms I want my ads posted on?",
    answer: "Yes, you can specify your preferred platforms or target audience, and we'll optimize placements accordingly. Premium and Platinum plans include multi-channel posting."
  },
  {
    question: "What information do you need from me to create effective ads?",
    answer: "After purchase, you'll receive a brief questionnaire about your business, target audience, unique selling propositions, and goals. We'll handle the optimization from there."
  },
  {
    question: "Can I revise ads if I'm not satisfied?",
    answer: "Yes, all plans include at least one revision. Higher-tier plans include multiple revisions to ensure your complete satisfaction."
  },
  {
    question: "Do you offer refunds if I'm not satisfied with the service?",
    answer: "We stand by our quality guarantee. If you're not satisfied with our service, please contact us within 7 days of your first deliverable for our resolution process."
  },
];

export const serviceCategories = [
  {
    id: 'monthly',
    title: 'Monthly Posting Plans',
    description: 'Regular, consistent posting to keep your business visible',
    icon: 'Calendar'
  },
  {
    id: 'custom',
    title: 'Custom SEO-Ad Creation',
    description: 'Tailored ads designed to convert for your specific business',
    icon: 'Pencil'
  },
  {
    id: 'platinum',
    title: 'Platinum Packages',
    description: 'Comprehensive marketing solutions for serious growth',
    icon: 'Award'
  }
];

export const companyInfo = {
  name: 'AdBiz Pro',
  tagline: 'Effective Advertising Solutions for Modern Businesses',
  description: 'We specialize in creating and managing advertising campaigns that drive real results for businesses of all sizes.',
  year: 2023,
  email: 'info@adbiz.pro',
  phone: '(555) 123-4567',
  address: '123 Marketing Ave, Digital City, CA 90210',
  socials: {
    twitter: 'https://twitter.com/adbizpro',
    facebook: 'https://facebook.com/adbizpro',
    linkedin: 'https://linkedin.com/company/adbizpro',
    instagram: 'https://instagram.com/adbizpro'
  }
};
