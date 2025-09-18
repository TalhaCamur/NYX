
export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  specs: { name: string; value: string }[];
  isVisible: boolean;
  ownerId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string; // ISO 8601 format string
  imageUrl: string;
  excerpt: string;
  content: string;
  ownerId?: string;
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
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    roles: UserRole[];
    profilePicture?: string;
}