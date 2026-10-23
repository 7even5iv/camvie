// src/pages/Home.tsx
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { siteSettingsQuery, featuredPropertiesQuery, galleryItemsQuery } from '../lib/queries';
import { urlForImage } from '../lib/imageUrl';
import { parseVideoUrl } from '../lib/videoHelper';
import PropertyCard from '../components/PropertyCard';
import Lightbox from '../components/Lightbox';
import Seo from '../components/Seo';
import type { SiteSettings, Property, GalleryItem } from '../types';

/* ------------------------------------------------------------------
   Slider héro — 5 images · autoplay · navigation manuelle
   ------------------------------------------------------------------ */
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80',
        title: 'Bienvenue chez CAMVIE SARL',
        subtitle:
            'Votre partenaire de confiance en intermédiation foncière, commerce général et import-export.',
    },
    {
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
        title: 'Intermédiation foncière',
        subtitle:
            'Des terrains sécurisés, des transactions transparentes, un accompagnement de A à Z.',
    },
    {
        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=80',
        title: 'Commerce général',
        subtitle: 'Une offre diversifiée pour répondre à tous vos besoins du quotidien.',
    },
    {
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80',
        title: 'Import-Export',
        subtitle: "Des flux maîtrisés entre l'Afrique et le reste du monde.",
    },
    {
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80',
        title: 'Un partenaire de confiance',
        subtitle: 'Une équipe engagée à vos côtés pour des projets qui durent.',
    },
];

function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(
            () => setCurrent((c) => (c + 1) % heroSlides.length),
            6000,
        );
        return () => clearInterval(timer);
    }, [paused]);

    const goTo = (i: number) => setCurrent(i);
    const next = () => setCurrent((c) => (c + 1) % heroSlides.length);
    const prev = () => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);

    const slide = heroSlides[current];

    return (
        <section
            className="relative h-[80vh] min-h-[600px] max-h-[860px] overflow-hidden bg-camvie-gray-900"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Présentation CAMVIE SARL"
        >
            {heroSlides.map((s, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    aria-hidden={i !== current}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${i === current ? 'scale-105' : 'scale-100'
                            }`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}

            <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/75 via-black/45 to-black/20 pointer-events-none" />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="relative h-full z-30 container mx-auto px-4 md:px-8 flex items-center pointer-events-none">
                <div key={current} className="max-w-2xl text-white pointer-events-auto">
                    <div className="flex items-center gap-3 mb-6 opacity-0 animate-hero-fade [animation-delay:0ms]">
                        <span className="block w-10 h-[2px] bg-camvie-red" />
                        <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                            CAMVIE SARL
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-[1.1] tracking-tight opacity-0 animate-hero-slide [animation-delay:100ms]">
                        {slide.title}
                    </h1>

                    <p className="text-base md:text-lg text-white/75 mb-10 max-w-xl leading-relaxed opacity-0 animate-hero-slide [animation-delay:250ms]">
                        {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3 opacity-0 animate-hero-slide [animation-delay:400ms]">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-white text-camvie-green px-6 py-3.5 rounded-lg font-semibold hover:bg-camvie-red hover:text-white transition-colors duration-200"
                        >
                            Nous contacter
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>

                        <Link
                            to="/opportunites"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-white border border-white/40 hover:bg-white/10 hover:border-white/70 transition-colors duration-200"
                        >
                            Voir les opportunités
                        </Link>
                    </div>
                </div>
            </div>

            <button
                onClick={prev}
                aria-label="Image précédente"
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 items-center justify-center w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/15 hover:text-white transition-colors duration-200"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                aria-label="Image suivante"
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 items-center justify-center w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/15 hover:text-white transition-colors duration-200"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="absolute bottom-8 left-0 right-0 z-40">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Aller à l'image ${i + 1}`}
                                className={`h-[2px] rounded-full transition-all duration-300 ${i === current
                                    ? 'w-10 bg-white'
                                    : 'w-5 bg-white/40 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-white/70 tabular-nums">
                        <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
                        {' / '}
                        {String(heroSlides.length).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------
   Slider de témoignages (texte) — autoplay · flèches · dots
   ------------------------------------------------------------------ */
type Testimonial = {
    quote: string;
    author: string;
    role: string;
    initials: string;
};

const testimonials: Testimonial[] = [
    {
        quote:
            "CAMVIE SARL a sécurisé l'achat de notre terrain en un temps record. Transparence totale du début à la fin — je recommande sans hésiter.",
        author: 'Aïcha M.',
        role: 'Cliente — Intermédiation foncière',
        initials: 'AM',
    },
    {
        quote:
            "Un partenaire fiable pour nos approvisionnements en commerce général. Livraisons toujours à l'heure, qualité au rendez-vous.",
        author: 'Jean-Paul K.',
        role: 'Gérant — Commerce général',
        initials: 'JK',
    },
    {
        quote:
            "Grâce à leur réseau, nous avons lancé notre activité d'import-export sereinement. Une équipe à l'écoute et très réactive.",
        author: 'Sarah T.',
        role: 'Entrepreneure — Import-Export',
        initials: 'ST',
    },
    {
        quote:
            'Nous avons été accompagnés de la prospection à la signature. CAMVIE SARL connaît parfaitement le marché local.',
        author: 'Bertrand N.',
        role: 'Investisseur immobilier',
        initials: 'BN',
    },
    {
        quote:
            'Leur suivi après-vente fait toute la différence. On sent une vraie équipe derrière chaque dossier.',
        author: 'Mireille D.',
        role: 'Cliente particulière',
        initials: 'MD',
    },
];

function TestimonialsSlider() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(
            () => setCurrent((c) => (c + 1) % testimonials.length),
            7000,
        );
        return () => clearInterval(timer);
    }, [paused]);

    const next = () => setCurrent((c) => (c + 1) % testimonials.length);
    const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

    return (
        <section
            className="py-20 bg-camvie-gray-50 relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Témoignages clients"
        >
            <div
                className="absolute -top-10 left-6 text-[20rem] leading-none text-camvie-green/5 font-serif select-none pointer-events-none"
                aria-hidden="true"
            >
                “
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-10">
                    <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                        Ils nous font confiance
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-camvie-green mt-2">
                        Ce que disent nos clients
                    </h2>
                    <div className="h-1 w-16 bg-camvie-red rounded-full mt-3 mx-auto" />
                </div>

                <div className="relative max-w-3xl mx-auto min-h-[320px] sm:min-h-[280px] md:min-h-[260px]">
                    {testimonials.map((t, i) => (
                        <figure
                            key={i}
                            className={`absolute inset-0 flex flex-col items-center text-center
                                        transition-all duration-700 ease-in-out
                                        ${i === current
                                    ? 'opacity-100 translate-y-0 z-10'
                                    : 'opacity-0 translate-y-4 z-0 pointer-events-none'
                                }`}
                            aria-hidden={i !== current}
                        >
                            <svg
                                className="w-10 h-10 text-camvie-red mb-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                            </svg>

                            <blockquote className="text-xl md:text-2xl text-camvie-gray-800 font-medium leading-relaxed mb-6">
                                {t.quote}
                            </blockquote>

                            <figcaption className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-camvie-green text-white flex items-center justify-center font-bold text-sm shadow-md">
                                    {t.initials}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-camvie-green">
                                        {t.author}
                                    </div>
                                    <div className="text-sm text-camvie-gray-500">
                                        {t.role}
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-6 mt-10">
                    <button
                        onClick={prev}
                        aria-label="Témoignage précédent"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-camvie-gray-100 text-camvie-green hover:bg-camvie-green hover:text-white transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Aller au témoignage ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                                    ? 'w-8 bg-camvie-red'
                                    : 'w-2 bg-camvie-gray-300 hover:bg-camvie-gray-500'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        aria-label="Témoignage suivant"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-camvie-gray-100 text-camvie-green hover:bg-camvie-green hover:text-white transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------
   Aperçu galerie — 6 médias · photos en lightbox · vidéos → /galerie
   ------------------------------------------------------------------ */
function GalleryPreview() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        sanityClient
            .fetch<GalleryItem[]>(galleryItemsQuery)
            .then((data) => setItems(data.slice(0, 6)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const photos = useMemo(() => items.filter((i) => i.type === 'photo'), [items]);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                            En images & vidéos
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-camvie-green mt-2">
                            Notre galerie
                        </h2>
                        <div className="h-1 w-16 bg-camvie-red rounded-full mt-3" />
                    </div>
                    <Link
                        to="/galerie"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-camvie-red hover:text-camvie-green transition group"
                    >
                        Voir toute la galerie
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-camvie-gray-100 animate-pulse"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 bg-camvie-gray-50 rounded-2xl border border-camvie-gray-100">
                        <p className="text-camvie-gray-800">
                            Aucun média publié pour le moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item) => {
                            if (item.type === 'photo' && item.image) {
                                const photoIdx = photos.findIndex((p) => p._id === item._id);
                                return (
                                    <button
                                        key={item._id}
                                        onClick={() => setLightboxIndex(photoIdx)}
                                        className="group relative aspect-square rounded-xl overflow-hidden bg-camvie-gray-100"
                                        aria-label={`Ouvrir la photo : ${item.title}`}
                                    >
                                        <img
                                            src={urlForImage(item.image).width(600).height(600).url()}
                                            alt={item.image.alt || item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold text-left opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.title}
                                        </p>
                                    </button>
                                );
                            }
                            if (item.type === 'video') {
                                const embed = parseVideoUrl(item.videoUrl);
                                if (!embed) return null;
                                return (
                                    <Link
                                        key={item._id}
                                        to="/galerie"
                                        className="group relative aspect-square rounded-xl overflow-hidden bg-camvie-gray-900"
                                        aria-label={`Voir la vidéo : ${item.title}`}
                                    >
                                        {embed.thumbnail ? (
                                            <img
                                                src={embed.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full" />
                                        )}
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                            <span className="w-14 h-14 rounded-full bg-camvie-red text-white flex items-center justify-center text-xl shadow-lg shadow-black/40 group-hover:scale-110 transition-transform">
                                                ▶
                                            </span>
                                        </div>
                                        <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold text-left">
                                            {item.title}
                                        </p>
                                    </Link>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>

            {lightboxIndex !== null && photos.length > 0 && (
                <Lightbox
                    items={photos}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() =>
                        setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
                    }
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
                />
            )}
        </section>
    );
}

/* ------------------------------------------------------------------
   Page d'accueil
   ------------------------------------------------------------------ */
export default function Home() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, propertiesData] = await Promise.all([
                    sanityClient.fetch<SiteSettings>(siteSettingsQuery),
                    sanityClient.fetch<Property[]>(featuredPropertiesQuery),
                ]);
                setSettings(settingsData);
                setProperties(propertiesData);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Seo />

            <HeroSlider />

            {/* Biens à la une */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                                Notre sélection
                            </span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-camvie-green mt-2">
                                Biens à la une
                            </h2>
                            <div className="h-1 w-16 bg-camvie-red rounded-full mt-3" />
                        </div>
                        <Link
                            to="/opportunites"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-camvie-red hover:text-camvie-green transition group"
                        >
                            Voir tout le catalogue
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-camvie-gray-100 h-72 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-16 bg-camvie-gray-50 rounded-2xl border border-camvie-gray-100">
                            <p className="text-camvie-gray-800">
                                Aucun bien mis en avant pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Aperçu galerie — NOUVEAU */}
            <GalleryPreview />

            {/* Témoignages clients */}
            <TestimonialsSlider />

            {/* Section contact / CTA */}
            {settings && (settings.phone || settings.email) && (
                <section className="py-16 bg-camvie-green text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-camvie-green to-camvie-green-light opacity-90" />
                    <div className="container mx-auto px-4 relative">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-wider text-camvie-red">
                                    Contact
                                </span>
                                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                                    Parlons de votre projet
                                </h2>
                                <p className="text-white/80 max-w-md">
                                    Une question, un projet foncier, un besoin en commerce ou import-export ?
                                    Notre équipe vous répond sous 24h.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 md:items-end">
                                {settings.phone && (
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-camvie-green transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 3.5a2 2 0 01-1 2.17l-1.5.75a11 11 0 005.5 5.5l.75-1.5a2 2 0 012.17-1l3.5.7A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="font-semibold">{settings.phone}</span>
                                    </a>
                                )}
                                {settings.email && (
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-camvie-green transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-semibold">{settings.email}</span>
                                    </a>
                                )}
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl bg-camvie-red text-white font-semibold hover:bg-white hover:text-camvie-red transition-all shadow-lg shadow-black/20"
                                >
                                    Formulaire de contact
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}