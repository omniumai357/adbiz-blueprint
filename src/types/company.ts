
// Type definitions for company information

export interface SocialLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  year: number;
  email: string;
  phone: string;
  address: string;
  socials: SocialLinks;
}
