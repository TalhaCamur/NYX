

export interface Product {
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  specs: { name: string; value: string }[];
}

export interface Testimonial {
  quote: string;
  author: string;
  publication: string;
}

export interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type UserRole = 'user' | 'seller' | 'admin' | 'super-admin' | 'Web Developer' | 'UI/UX Designer' | 'Content Writer';

export interface User {
    id: string;
    name: string;
    email: string;
    roles: UserRole[];
}