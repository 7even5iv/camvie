import { useEffect } from 'react';
import { urlForImage } from '../lib/imageUrl';
import type { GalleryItem } from '../types';

interface Props {
    items: GalleryItem[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }: Props) {
    const item = items[currentIndex];

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose, onPrev, onNext]);

    if (!item || !item.image) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Bouton fermer */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-camvie-red"
                aria-label="Fermer"
            >
                ×
            </button>

            {/* Précédent */}
            {items.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 text-white text-4xl hover:text-camvie-red px-2"
                    aria-label="Précédent"
                >
                    ‹
                </button>
            )}

            {/* Image */}
            <div className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
                <img
                    src={urlForImage(item.image).width(1600).url()}
                    alt={item.image.alt || item.title}
                    className="max-w-full max-h-[80vh] object-contain mx-auto"
                />
                {(item.title || item.caption) && (
                    <div className="text-white text-center mt-4">
                        <p className="font-semibold">{item.title}</p>
                        {item.caption && <p className="text-sm text-white/80">{item.caption}</p>}
                    </div>
                )}
            </div>

            {/* Suivant */}
            {items.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 text-white text-4xl hover:text-camvie-red px-2"
                    aria-label="Suivant"
                >
                    ›
                </button>
            )}
        </div>
    );
}