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
   Bannière principale CAMVIE SARL (inchangée)
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
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
   Aperçu galerie — bento grid · lightbox · vidéos → /galerie
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
    const photoCount = useMemo(() => items.filter((i) => i.type === 'photo').length, [items]);
    const videoCount = useMemo(() => items.filter((i) => i.type === 'video').length, [items]);

    // On passe en bento (1ʳᵉ tuile 2x2) uniquement si on a assez de contenu
    const useBento = items.length >= 5;

    return (
        <section className="relative overflow-hidden bg-camvie-gray-50 py-24">
            {/* Motif pointillé subtil */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #1a7a4a 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
                aria-hidden="true"
            />

            {/* Trait d'accent en haut */}
            <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-camvie-red to-transparent" />

            <div className="relative container mx-auto px-4">
                {/* En-tête éditorial */}
                <div className="mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="max-w-2xl">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-camvie-red" />
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                                En images & vidéos
                            </span>
                        </div>
                        <h2 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl">
                            Notre galerie
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-camvie-gray-800">
                            Biens, événements, activités : plongez dans le quotidien de CAMVIE SARL
                            à travers notre collection de photos et vidéos.
                        </p>

                        {/* Badges de comptage */}
                        {(photoCount > 0 || videoCount > 0) && (
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                {photoCount > 0 && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-camvie-green shadow-sm">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {photoCount} photos
                                    </span>
                                )}
                                {videoCount > 0 && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-camvie-red shadow-sm">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        {videoCount} vidéos
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/galerie"
                        className="group inline-flex items-center gap-3 rounded-full border-2 border-camvie-green px-7 py-4 font-semibold text-camvie-green transition-all duration-300 hover:-translate-y-0.5 hover:bg-camvie-green hover:text-white"
                    >
                        Explorer la galerie
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Bento grid */}
                {loading ? (
                    <div className="grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => {
                            const isFeatured = i === 0 && useBento;
                            return (
                                <div
                                    key={i}
                                    className={`animate-pulse rounded-2xl bg-camvie-gray-100 ${isFeatured
                                            ? 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2 md:aspect-auto'
                                            : 'aspect-square md:aspect-auto'
                                        }`}
                                />
                            );
                        })}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-camvie-gray-100 bg-white py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="mb-2 text-lg font-semibold text-camvie-green">
                            Galerie bientôt disponible
                        </p>
                        <p className="text-camvie-gray-800">
                            Nos premières photos et vidéos seront bientôt en ligne.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-3">
                        {items.map((item, index) => {
                            const isFeatured = index === 0 && useBento;
                            const bentoClass = isFeatured
                                ? 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2 md:aspect-auto'
                                : 'aspect-square md:aspect-auto';

                            if (item.type === 'photo' && item.image) {
                                const photoIdx = photos.findIndex((p) => p._id === item._id);
                                return (
                                    <button
                                        key={item._id}
                                        onClick={() => setLightboxIndex(photoIdx)}
                                        className={`group relative overflow-hidden rounded-2xl bg-camvie-gray-100 ${bentoClass}`}
                                        aria-label={`Ouvrir la photo : ${item.title || 'Sans titre'}`}
                                    >
                                        <img
                                            src={urlForImage(item.image)
                                                .width(isFeatured ? 1200 : 600)
                                                .height(isFeatured ? 1200 : 600)
                                                .url()}
                                            alt={item.image.alt || item.title || 'Photo CAMVIE SARL'}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading={index < 3 ? 'eager' : 'lazy'}
                                        />

                                        {/* Overlay dégradé */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                                        {/* Badge Photo */}
                                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-camvie-green shadow-sm backdrop-blur-sm">
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            Photo
                                        </span>

                                        {/* Zoom au survol */}
                                        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>

                                        {/* Titre + légende */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                                            {item.title && (
                                                <p
                                                    className={`translate-y-2 font-semibold text-white transition-all duration-300 group-hover:translate-y-0 ${isFeatured ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
                                                        }`}
                                                >
                                                    {item.title}
                                                </p>
                                            )}
                                            {item.caption && (
                                                <p className="mt-1 line-clamp-2 text-xs text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    {item.caption}
                                                </p>
                                            )}
                                        </div>
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
                                        className={`group relative overflow-hidden rounded-2xl bg-camvie-gray-900 ${bentoClass}`}
                                        aria-label={`Voir la vidéo : ${item.title || 'Sans titre'}`}
                                    >
                                        {embed.thumbnail ? (
                                            <img
                                                src={embed.thumbnail}
                                                alt={item.title || 'Vidéo CAMVIE SARL'}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading={index < 3 ? 'eager' : 'lazy'}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-camvie-gray-900 to-camvie-green/30" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

                                        {/* Badge Vidéo */}
                                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-camvie-red px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                            Vidéo
                                        </span>

                                        {/* Bouton Play */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-camvie-red group-hover:bg-camvie-red md:h-20 md:w-20">
                                                <svg className="h-6 w-6 translate-x-0.5 text-white md:h-8 md:w-8" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                                            {item.title && (
                                                <p
                                                    className={`font-semibold text-white ${isFeatured ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
                                                        }`}
                                                >
                                                    {item.title}
                                                </p>
                                            )}
                                            {item.caption && (
                                                <p className="mt-1 line-clamp-2 text-xs text-white/80">
                                                    {item.caption}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            }

                            return null;
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox */}
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

    /* ---- Statistiques dérivées pour le bandeau ---- */
    const locationsCount = useMemo(
        () => new Set(properties.map((p) => p.location).filter(Boolean)).size,
        [properties]
    );

    const minPrice = useMemo(() => {
        const prices = properties
            .map((p) => p.price)
            .filter((p): p is number => typeof p === 'number' && p > 0);
        return prices.length > 0 ? Math.min(...prices) : null;
    }, [properties]);

    return (
        <>
            <Seo />

            <HeroSlider />

            {/* ---------------- BIENS À LA UNE (refonte) ---------------- */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-camvie-gray-50 py-24">
                <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-camvie-red to-transparent" />

                <div className="container mx-auto px-4">
                    {/* En-tête éditorial */}
                    <div className="mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="max-w-2xl">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-[2px] w-10 bg-camvie-red" />
                                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                                    Notre sélection
                                </span>
                            </div>
                            <h2 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl">
                                Biens à la une
                            </h2>
                            <p className="mt-5 text-lg leading-relaxed text-camvie-gray-800">
                                Une sélection rigoureuse de biens vérifiés par notre équipe.
                                Terrains, maisons, espaces commerciaux — trouvez l'opportunité
                                qui vous correspond.
                            </p>
                        </div>

                        <Link
                            to="/opportunites"
                            className="group inline-flex items-center gap-3 rounded-full bg-camvie-green px-7 py-4 font-semibold text-white shadow-lg shadow-camvie-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-camvie-red hover:shadow-xl hover:shadow-camvie-red/30"
                        >
                            Voir le catalogue complet
                            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Bandeau de statistiques */}
                    {!loading && properties.length > 0 && (
                        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="flex items-center gap-4 rounded-2xl border border-camvie-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-camvie-green/10 text-camvie-green">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-camvie-green">{properties.length}</div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-camvie-gray-500">
                                        Biens disponibles
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-camvie-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-camvie-red/10 text-camvie-red">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-camvie-green">{locationsCount}</div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-camvie-gray-500">
                                        Localisations
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-camvie-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-camvie-green/10 text-camvie-green">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-camvie-green">
                                        {minPrice !== null ? `dès ${minPrice.toLocaleString('fr-FR')} FCFA` : 'Sur demande'}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-camvie-gray-500">
                                        Tarif d'entrée
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grille des biens */}
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-96 animate-pulse rounded-2xl bg-camvie-gray-100" />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="rounded-3xl border-2 border-dashed border-camvie-gray-100 bg-white py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-camvie-green">
                                Aucun bien à la une
                            </p>
                            <p className="mb-6 text-camvie-gray-800">
                                Explorez notre catalogue complet pour découvrir toutes nos opportunités.
                            </p>
                            <Link
                                to="/opportunites"
                                className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-6 py-3 font-semibold text-white transition hover:bg-camvie-green"
                            >
                                Voir le catalogue
                            </Link>
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

            {/* ---------------- APERÇU GALERIE (refonte) ---------------- */}
            <GalleryPreview />

            {/* ---------------- SECTION CONTACT CTA (inchangée) ---------------- */}
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