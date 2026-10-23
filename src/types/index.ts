// src/types/index.ts

/* ------------------------------------------------------------------
   Types partagés — alignés sur les queries Sanity de CAMVIE SARL
   ------------------------------------------------------------------ */

export type SanityImage = {
    _type: 'image';
    _key?: string;
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
    caption?: string;
    hotspot?: { x: number; y: number; height: number; width: number };
    crop?: { top: number; bottom: number; left: number; right: number };
};

export type Slug = {
    _type: 'slug';
    current: string;
};

export type PortableTextBlock = {
    _type: string;
    _key?: string;
    children?: Array<{ _type: string; _key?: string; text?: string; marks?: string[] }>;
    [key: string]: unknown;
};

/* -------------------- Paramètres du site -------------------- */
export type SocialLinks = {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
};

export type SiteSettings = {
    _id?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    socialLinks?: SocialLinks;
};

/* -------------------- Biens immobiliers -------------------- */
export type PropertyStatus = 'published' | 'draft' | 'sold' | 'archived' | (string & {});
export type PropertyType =
    | 'terrain'
    | 'maison'
    | 'appartement'
    | 'bureau'
    | 'commerce'
    | 'autre'
    | (string & {});

export type Property = {
    _id: string;
    title: string;
    slug: Slug;
    reference: string;
    location: string;
    images: SanityImage[];
    description?: PortableTextBlock[];
    area?: number;
    price?: number;
    type?: PropertyType;
    status?: PropertyStatus;
    is_featured?: boolean;
    published_at?: string;
};

/* -------------------- Pages statiques -------------------- */
export type Page = {
    _id: string;
    title: string;
    slug: Slug;
    content?: PortableTextBlock[];
};

/* -------------------- Services -------------------- */
export type Service = {
    _id: string;
    title: string;
    slug: Slug;
    short_description?: string;
    content?: PortableTextBlock[];
    is_active: boolean;
};

/* -------------------- Galerie -------------------- */
/** Retourné par `galleryItemsQuery` */
export type GalleryItem = {
    _id: string;
    title?: string;
    type: 'photo' | 'video' | (string & {});   // ← 'photo' (pas 'image')
    image: SanityImage;
    videoUrl?: string;
    caption?: string;
    category?: string;
    order?: number;
};

/* -------------------- Formulaire de contact -------------------- */
export type ContactMessageInput = {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    /** Référence optionnelle vers un bien immobilier (Sanity `_id`) */
    propertyId?: string;
    /** Titre du bien — utilisé comme sujet / contexte du message */
    propertyTitle?: string;
};

