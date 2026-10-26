// src/pages/Gallery.tsx
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { galleryItemsQuery } from '../lib/queries';
import { urlForImage } from '../lib/imageUrl';
import { parseVideoUrl } from '../lib/videoHelper';
import Lightbox from '../components/Lightbox';
import Seo from '../components/Seo';
import type { GalleryItem } from '../types';

type Filter = 'all' | 'photo' | 'video';

export default function Gallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    useEffect(() => {
        sanityClient
            .fetch<GalleryItem[]>(galleryItemsQuery)
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter((i) => i.type === filter);
    }, [items, filter]);

    const photos = useMemo(() => filtered.filter((i) => i.type === 'photo'), [filtered]);

    const counts = useMemo(
        () => ({
            all: items.length,
            photo: items.filter((i) => i.type === 'photo').length,
            video: items.filter((i) => i.type === 'video').length,
        }),
        [items]
    );

    /* Bento : uniquement si ≥ 5 items ET filtre "tous" ou "photos" */
    const useBento = filtered.length >= 5 && filter !== 'video';

    /* ---------- Chargement : squelette éditorial ---------- */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto px-4 py-16">
                    <div className="mb-6 h-4 w-32 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="mb-4 h-10 w-1/2 animate-pulse rounded-lg bg-camvie-gray-100" />
                    <div className="mb-12 h-1 w-16 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-camvie-gray-100 md:aspect-auto" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-28">
            <Seo
                title="Galerie"
                description="Découvrez en images et en vidéos les biens, événements et activités de CAMVIE SARL au Cameroun."
            />

            {/* ---------- HERO ÉDITORIAL ---------- */}
            <section className="relative overflow-hidden bg-camvie-gray-50 py-16 md:py-20">
                <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-camvie-red to-transparent" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #1a7a4a 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                    aria-hidden="true"
                />

                <div className="container relative mx-auto max-w-4xl px-4">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-[2px] w-10 bg-camvie-red" />
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                            En images & vidéos
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl lg:text-6xl">
                        Notre galerie
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-camvie-gray-800">
                        Une fenêtre ouverte sur nos biens, nos événements et notre quotidien.
                        Parcourez nos photos et vidéos pour découvrir CAMVIE SARL autrement.
                    </p>

                    {/* Badges de comptage */}
                    {(counts.photo > 0 || counts.video > 0) && (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {counts.photo > 0 && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-camvie-green shadow-sm">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {counts.photo} photos
                                </span>
                            )}
                            {counts.video > 0 && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-camvie-red shadow-sm">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    {counts.video} vidéos
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ---------- FILTRES ---------- */}
            {items.length > 0 && (
                <section className="bg-white pt-12">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${filter === 'all'
                                        ? 'border-camvie-green bg-camvie-green text-white shadow-sm'
                                        : 'border-camvie-gray-100 bg-white text-camvie-gray-800 hover:border-camvie-green/40 hover:text-camvie-green'
                                    }`}
                            >
                                Tous
                                <span
                                    className={`rounded-full px-1.5 text-xs ${filter === 'all'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-camvie-gray-100 text-camvie-gray-800'
                                        }`}
                                >
                                    {counts.all}
                                </span>
                            </button>

                            {counts.photo > 0 && (
                                <button
                                    onClick={() => setFilter('photo')}
                                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${filter === 'photo'
                                            ? 'border-camvie-green bg-camvie-green text-white shadow-sm'
                                            : 'border-camvie-gray-100 bg-white text-camvie-gray-800 hover:border-camvie-green/40 hover:text-camvie-green'
                                        }`}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Photos
                                    <span
                                        className={`rounded-full px-1.5 text-xs ${filter === 'photo'
                                                ? 'bg-white/20 text-white'
                                                : 'bg-camvie-gray-100 text-camvie-gray-800'
                                            }`}
                                    >
                                        {counts.photo}
                                    </span>
                                </button>
                            )}

                            {counts.video > 0 && (
                                <button
                                    onClick={() => setFilter('video')}
                                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${filter === 'video'
                                            ? 'border-camvie-red bg-camvie-red text-white shadow-sm'
                                            : 'border-camvie-gray-100 bg-white text-camvie-gray-800 hover:border-camvie-red/40 hover:text-camvie-red'
                                        }`}
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Vidéos
                                    <span
                                        className={`rounded-full px-1.5 text-xs ${filter === 'video'
                                                ? 'bg-white/20 text-white'
                                                : 'bg-camvie-gray-100 text-camvie-gray-800'
                                            }`}
                                    >
                                        {counts.video}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- GRILLE / BENTO ---------- */}
            <section className="bg-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    {filtered.length === 0 ? (
                        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed border-camvie-gray-100 bg-camvie-gray-50 py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-camvie-green">
                                {items.length === 0
                                    ? 'Galerie bientôt disponible'
                                    : 'Aucun média dans cette catégorie'}
                            </p>
                            <p className="mb-6 text-camvie-gray-800">
                                {items.length === 0
                                    ? 'Nos premières photos et vidéos seront bientôt en ligne.'
                                    : 'Essayez un autre filtre pour découvrir tous nos médias.'}
                            </p>
                            {items.length > 0 && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-camvie-green px-6 py-3 font-semibold text-white transition hover:bg-camvie-green-light"
                                >
                                    Voir tous les médias
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`grid grid-cols-2 gap-3 md:gap-4 ${useBento
                                    ? 'md:auto-rows-[220px] md:grid-cols-4'
                                    : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                }`}
                        >
                            {filtered.map((item, index) => {
                                const isFeatured = useBento && index === 0;
                                const cellClass = useBento
                                    ? isFeatured
                                        ? 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2 md:aspect-auto'
                                        : 'aspect-square md:aspect-auto'
                                    : 'aspect-square';

                                /* ---------- PHOTO ---------- */
                                if (item.type === 'photo' && item.image) {
                                    const photoIdx = photos.findIndex((p) => p._id === item._id);

                                    return (
                                        <button
                                            key={item._id}
                                            onClick={() => setLightboxIndex(photoIdx)}
                                            className={`group relative overflow-hidden rounded-2xl bg-camvie-gray-100 ${cellClass}`}
                                            aria-label={`Ouvrir la photo : ${item.title || 'Sans titre'}`}
                                        >
                                            <img
                                                src={urlForImage(item.image)
                                                    .width(isFeatured ? 1200 : 600)
                                                    .height(isFeatured ? 1200 : 600)
                                                    .url()}
                                                alt={item.image.alt || item.title || 'Photo CAMVIE SARL'}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading={index < 4 ? 'eager' : 'lazy'}
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                                            {/* Badge Photo */}
                                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-camvie-green shadow-sm backdrop-blur-sm">
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                Photo
                                            </span>

                                            {/* Icône zoom hover */}
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

                                /* ---------- VIDÉO ---------- */
                                if (item.type === 'video') {
                                    const embed = parseVideoUrl(item.videoUrl);
                                    if (!embed) return null;
                                    const isPlaying = playingVideoId === item._id;

                                    return (
                                        <div
                                            key={item._id}
                                            className={`group relative overflow-hidden rounded-2xl bg-camvie-gray-900 ${useBento ? 'aspect-square md:aspect-auto' : 'aspect-square'
                                                }`}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <iframe
                                                        src={`${embed.embedUrl}?autoplay=1`}
                                                        title={item.title || 'Vidéo CAMVIE SARL'}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="h-full w-full"
                                                    />
                                                    <button
                                                        onClick={() => setPlayingVideoId(null)}
                                                        aria-label="Fermer la vidéo"
                                                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-camvie-red"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setPlayingVideoId(item._id)}
                                                    className="relative h-full w-full"
                                                    aria-label={`Lire la vidéo : ${item.title || 'Sans titre'}`}
                                                >
                                                    {embed.thumbnail ? (
                                                        <img
                                                            src={embed.thumbnail}
                                                            alt={item.title || 'Vidéo CAMVIE SARL'}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-br from-camvie-gray-900 to-camvie-green/30" />
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

                                                    {/* Titre + légende */}
                                                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-left">
                                                        {item.title && (
                                                            <p className="text-sm font-semibold text-white md:text-base">
                                                                {item.title}
                                                            </p>
                                                        )}
                                                        {item.caption && (
                                                            <p className="mt-1 line-clamp-2 text-xs text-white/80">
                                                                {item.caption}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ---------- CTA DE FIN ---------- */}
            {items.length > 0 && (
                <section className="bg-white pb-20">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-camvie-green to-camvie-green-light p-8 text-center shadow-xl md:p-12">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                    backgroundSize: '24px 24px',
                                }}
                                aria-hidden="true"
                            />
                            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-camvie-red/20 blur-3xl" aria-hidden="true" />

                            <div className="relative">
                                <h2 className="mb-4 font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                                    Envie d'en voir plus ?
                                </h2>
                                <p className="mx-auto mb-8 max-w-xl text-white/85">
                                    Nos biens, nos activités et nos événements se découvrent aussi
                                    en personne. Contactez-nous pour organiser une visite.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-white hover:text-camvie-red"
                                    >
                                        Nous contacter
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        to="/opportunites"
                                        className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white hover:text-camvie-green"
                                    >
                                        Voir les opportunités
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- LIGHTBOX ---------- */}
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
        </div>
    );
}