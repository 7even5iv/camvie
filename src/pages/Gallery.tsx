// src/pages/Gallery.tsx
import { useEffect, useState, useMemo } from 'react';
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

    /* État de chargement — padding-top pour passer sous le header */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-camvie-gray-800">Chargement...</p>
                </div>
            </div>
        );
    }

    const counts = {
        all: items.length,
        photo: items.filter((i) => i.type === 'photo').length,
        video: items.filter((i) => i.type === 'video').length,
    };

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto px-4 pb-16">
                <Seo
                    title="Galerie"
                    description="Découvrez en images et en vidéos les biens, événements et activités de CAMVIE SARL."
                />

                <div className="mb-8 text-center">
                    <h1 className="mb-4 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                        Galerie
                    </h1>
                    <p className="mx-auto max-w-2xl text-camvie-gray-800">
                        Photos et vidéos de nos biens, événements et activités.
                    </p>
                </div>

                {/* Filtres */}
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                    {([
                        { key: 'all', label: `Tous (${counts.all})` },
                        { key: 'photo', label: `📷 Photos (${counts.photo})` },
                        { key: 'video', label: `🎬 Vidéos (${counts.video})` },
                    ] as const).map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === tab.key
                                ? 'bg-camvie-green text-white'
                                : 'bg-camvie-gray-100 text-camvie-gray-800 hover:bg-camvie-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Vide */}
                {filtered.length === 0 ? (
                    <div className="rounded-lg bg-camvie-gray-50 py-12 text-center">
                        <p className="text-camvie-gray-800">Aucun média publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filtered.map((item) => {
                            if (item.type === 'photo' && item.image) {
                                const photoIndex = photos.findIndex((p) => p._id === item._id);
                                return (
                                    <button
                                        key={item._id}
                                        onClick={() => setLightboxIndex(photoIndex)}
                                        className="group relative aspect-square overflow-hidden rounded-lg bg-camvie-gray-100"
                                    >
                                        <img
                                            src={urlForImage(item.image).width(600).height(600).url()}
                                            alt={item.image.alt || item.title}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex items-end bg-black/0 transition group-hover:bg-black/30">
                                            <p className="p-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                                {item.title}
                                            </p>
                                        </div>
                                    </button>
                                );
                            }

                            if (item.type === 'video') {
                                const embed = parseVideoUrl(item.videoUrl);
                                if (!embed) return null;
                                const isPlaying = playingVideoId === item._id;

                                return (
                                    <div key={item._id} className="flex flex-col overflow-hidden rounded-lg bg-camvie-gray-100">
                                        <div className="relative aspect-video bg-black">
                                            {isPlaying ? (
                                                <iframe
                                                    src={`${embed.embedUrl}?autoplay=1`}
                                                    title={item.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="h-full w-full"
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setPlayingVideoId(item._id)}
                                                    className="group relative h-full w-full"
                                                    aria-label={`Lire la vidéo : ${item.title}`}
                                                >
                                                    {embed.thumbnail ? (
                                                        <img
                                                            src={embed.thumbnail}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-camvie-gray-900" />
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50">
                                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-camvie-red text-2xl text-white">
                                                            ▶
                                                        </span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-semibold text-camvie-green">{item.title}</p>
                                            {item.caption && (
                                                <p className="mt-1 text-xs text-camvie-gray-800">{item.caption}</p>
                                            )}
                                        </div>
                                    </div>
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
                    onPrev={() =>
                        setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
                    }
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
                />
            )}
        </div>
    );
}