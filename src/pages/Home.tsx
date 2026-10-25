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
   Bannière principale CAMVIE SARL
   Image responsive + boutons d'action accessibles
   Padding-top pour ne pas être masqué par le header fixe.
   ------------------------------------------------------------------ */
function HeroSlider() {
    return (
        <section
            className="relative w-full overflow-hidden bg-white pt-24 md:pt-28"
            aria-label="Présentation de CAMVIE SARL"
        >
            <img
                src="/images/camvie-hero-banner.png"
                alt="CAMVIE SARL met en relation les personnes ayant des besoins avec celles qui proposent des solutions, dans l'immobilier, le commerce général et l'import-export."
                className="block h-auto w-full"
                fetchPriority="high"
                decoding="async"
            />

            <div className="relative bg-white px-4 py-6 sm:py-8">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center sm:flex-row">
                    <Link
                        to="/contact"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-camvie-green px-6 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:bg-camvie-green-light hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-camvie-green focus:ring-offset-2 sm:w-auto"
                    >
                        Parlons de votre projet
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>

                    <Link
                        to="/opportunites"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-red-600 px-6 py-3.5 font-semibold text-red-600 transition duration-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 sm:w-auto"
                    >
                        Découvrir nos opportunités
                    </Link>
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
            className="relative overflow-hidden bg-camvie-gray-50 py-20"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Témoignages clients"
        >
            <div
                className="pointer-events-none absolute -top-10 left-6 select-none font-serif text-[20rem] leading-none text-camvie-green/5"
                aria-hidden="true"
            >
                “
            </div>

            <div className="container relative mx-auto px-4">
                <div className="mb-10 text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                        Ils nous font confiance
                    </span>
                    <h2 className="mt-2 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                        Ce que disent nos clients
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-camvie-red" />
                </div>

                <div className="relative mx-auto min-h-[320px] max-w-3xl sm:min-h-[280px] md:min-h-[260px]">
                    {testimonials.map((t, i) => (
                        <figure
                            key={i}
                            className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-in-out ${i === current
                                ? 'z-10 translate-y-0 opacity-100'
                                : 'pointer-events-none z-0 translate-y-4 opacity-0'
                                }`}
                            aria-hidden={i !== current}
                        >
                            <svg
                                className="mb-4 h-10 w-10 text-camvie-red"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                            </svg>

                            <blockquote className="mb-6 text-xl font-medium leading-relaxed text-camvie-gray-800 md:text-2xl">
                                {t.quote}
                            </blockquote>

                            <figcaption className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-camvie-green text-sm font-bold text-white shadow-md">
                                    {t.initials}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-camvie-green">{t.author}</div>
                                    <div className="text-sm text-camvie-gray-500">{t.role}</div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <div className="mt-10 flex items-center justify-center gap-6">
                    <button
                        onClick={prev}
                        aria-label="Témoignage précédent"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-camvie-gray-100 bg-white text-camvie-green shadow-sm transition-all hover:bg-camvie-green hover:text-white"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Aller au témoignage ${i + 1}`}
                                aria-current={i === current ? 'true' : undefined}
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-camvie-gray-100 bg-white text-camvie-green shadow-sm transition-all hover:bg-camvie-green hover:text-white"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------
   Aperçu galerie — photos en lightbox · vidéos → /galerie
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
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                            En images & vidéos
                        </span>
                        <h2 className="mt-2 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                            Notre galerie
                        </h2>
                        <div className="mt-3 h-1 w-16 rounded-full bg-camvie-red" />
                    </div>
                    <Link
                        to="/galerie"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-camvie-red transition hover:text-camvie-green"
                    >
                        Voir toute la galerie
                        <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-square animate-pulse rounded-xl bg-camvie-gray-100" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-camvie-gray-100 bg-camvie-gray-50 py-16 text-center">
                        <p className="text-camvie-gray-800">Aucun média publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {items.map((item) => {
                            if (item.type === 'photo' && item.image) {
                                const photoIdx = photos.findIndex((p) => p._id === item._id);
                                return (
                                    <button
                                        key={item._id}
                                        onClick={() => setLightboxIndex(photoIdx)}
                                        className="group relative aspect-square overflow-hidden rounded-xl bg-camvie-gray-100"
                                        aria-label={`Ouvrir la photo : ${item.title}`}
                                    >
                                        <img
                                            src={urlForImage(item.image).width(600).height(600).url()}
                                            alt={item.image.alt || item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
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
                                        className="group relative aspect-square overflow-hidden rounded-xl bg-camvie-gray-900"
                                        aria-label={`Voir la vidéo : ${item.title}`}
                                    >
                                        {embed.thumbnail ? (
                                            <img
                                                src={embed.thumbnail}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full w-full" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
                                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-camvie-red text-xl text-white shadow-lg shadow-black/40 transition-transform group-hover:scale-110">
                                                ▶
                                            </span>
                                        </div>
                                        <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white">
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
                    onPrev={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)}
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
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                                Notre sélection
                            </span>
                            <h2 className="mt-2 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                                Biens à la une
                            </h2>
                            <div className="mt-3 h-1 w-16 rounded-full bg-camvie-red" />
                        </div>
                        <Link
                            to="/opportunites"
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-camvie-red transition hover:text-camvie-green"
                        >
                            Voir tout le catalogue
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-72 animate-pulse rounded-2xl bg-camvie-gray-100" />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="rounded-2xl border border-camvie-gray-100 bg-camvie-gray-50 py-16 text-center">
                            <p className="text-camvie-gray-800">Aucun bien mis en avant pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Aperçu galerie */}
            <GalleryPreview />

            {/* Témoignages clients */}
            <TestimonialsSlider />

            {/* Section contact / CTA */}
            {settings && (settings.phone || settings.email) && (
                <section className="relative overflow-hidden bg-camvie-green py-16 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-camvie-green to-camvie-green-light opacity-90" />
                    <div className="container relative mx-auto px-4">
                        <div className="grid items-center gap-8 md:grid-cols-2">
                            <div>
                                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-camvie-red">
                                    Contact
                                </span>
                                <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
                                    Parlons de votre projet
                                </h2>
                                <p className="max-w-md text-white/80">
                                    Une question, un projet foncier, un besoin en commerce ou import-export ?
                                    Notre équipe vous répond sous 24h.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 md:items-end">
                                {settings.phone && (
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md transition-all hover:bg-white hover:text-camvie-green"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 3.5a2 2 0 01-1 2.17l-1.5.75a11 11 0 005.5 5.5l.75-1.5a2 2 0 012.17-1l3.5.7A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="font-semibold">{settings.phone}</span>
                                    </a>
                                )}

                                {settings.email && (
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md transition-all hover:bg-white hover:text-camvie-green"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-semibold">{settings.email}</span>
                                    </a>
                                )}

                                <Link
                                    to="/contact"
                                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-camvie-red px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-white hover:text-camvie-red"
                                >
                                    Formulaire de contact
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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