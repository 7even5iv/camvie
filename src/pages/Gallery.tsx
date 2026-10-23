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

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    const counts = {
        all: items.length,
        photo: items.filter((i) => i.type === 'photo').length,
        video: items.filter((i) => i.type === 'video').length,
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <Seo
                title="Galerie"
                description="Découvrez en images et en vidéos les biens, événements et activités de CAMVIE SARL."
            />

            <div className="text-center mb-8">
                <h1 className="text-4xl font-heading font-bold text-camvie-green mb-4">Galerie</h1>
                <p className="text-camvie-gray-800 max-w-2xl mx-auto">
                    Photos et vidéos de nos biens, événements et activités.
                </p>
            </div>

            {/* Filtres */}
            <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {([
                    { key: 'all', label: `Tous (${counts.all})` },
                    { key: 'photo', label: `📷 Photos (${counts.photo})` },
                    { key: 'video', label: `🎬 Vidéos (${counts.video})` },
                ] as const).map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === tab.key
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
                <div className="text-center py-12 bg-camvie-gray-50 rounded-lg">
                    <p className="text-camvie-gray-800">Aucun média publié pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((item) => {
                        if (item.type === 'photo' && item.image) {
                            const photoIndex = photos.findIndex((p) => p._id === item._id);
                            return (
                                <button
                                    key={item._id}
                                    onClick={() => setLightboxIndex(photoIndex)}
                                    className="group relative aspect-square rounded-lg overflow-hidden bg-camvie-gray-100"
                                >
                                    <img
                                        src={urlForImage(item.image).width(600).height(600).url()}
                                        alt={item.image.alt || item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end">
                                        <p className="text-white text-sm font-semibold p-3 opacity-0 group-hover:opacity-100 transition">
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
                                <div key={item._id} className="rounded-lg overflow-hidden bg-camvie-gray-100 flex flex-col">
                                    <div className="aspect-video relative bg-black">
                                        {isPlaying ? (
                                            <iframe
                                                src={`${embed.embedUrl}?autoplay=1`}
                                                title={item.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <button
                                                onClick={() => setPlayingVideoId(item._id)}
                                                className="w-full h-full relative group"
                                                aria-label={`Lire la vidéo : ${item.title}`}
                                            >
                                                {embed.thumbnail ? (
                                                    <img
                                                        src={embed.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-camvie-gray-900" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
                                                    <span className="w-16 h-16 rounded-full bg-camvie-red text-white flex items-center justify-center text-2xl">
                                                        ▶
                                                    </span>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-camvie-green">{item.title}</p>
                                        {item.caption && (
                                            <p className="text-xs text-camvie-gray-800 mt-1">{item.caption}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            )}

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