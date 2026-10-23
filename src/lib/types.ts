export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
}

export interface Property {
  _id: string;
  title: string;
  slug: { current: string };
  reference: string;
  type?: string;
  location?: string;
  area?: number;
  price?: number;
  status: 'draft' | 'published' | 'withdrawn';
  is_featured?: boolean;
  description?: any[];
  images?: SanityImage[];
  published_at?: string;
}

export interface SiteSettings {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Service {
  _id: string;
  title: string;
  slug?: { current: string };
  short_description?: string;
  content?: any[];
  is_active?: boolean;
}

export interface Page {
  _id: string;
  title: string;
  slug?: { current: string };
  content?: any[];
}

export interface ContactMessageInput {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
}