// src/components/Lightbox.tsx
import { useEffect, useState } from 'react';
import { urlForImage } from '../lib/imageUrl';
import type { GalleryItem } from '../types';

interface Props {
    items: GalleryItem[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function Lightbox({
    items,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: Props) {
    const item = items[currentIndex];

    /* Touch swipe : position X du touchstart */
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };

        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';

        /* Cache l'indication clavier après 4 secondes */
        const hintTimer = setTimeout(() => setShowHint(false), 4000);

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
            clearTimeout(hintTimer);
        };
    }, [onClose, onPrev, onNext]);

    /* Reset hint à chaque changement d'image */
    useEffect(() => {
        setShowHint(true);
        const t = setTimeout(() => setShowHint(false), 4000);
        return () => clearTimeout(t);
    }, [currentIndex]);

    if (!item || !item.image) return null;

    /* ---------- Swipe tactile ---------- */
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const threshold = 60;

        if (deltaX > threshold) onPrev();
        else if (deltaX < -threshold) onNext();

        setTouchStartX(null);
    };

    const hasMultiple = items.length > 1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in p-4 md:p-8"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Galerie d'images"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ---------- BOUTON FERMER ---------- */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-camvie-red hover:scale-110 md:right-6 md:top-6"
                aria-label="Fermer la galerie"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* ---------- COMPTEUR ---------- */}
            {hasMultiple && (
                <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur-md md:top-6">
                    <span className="text-white">{currentIndex + 1}</span>
                    <span className="mx-1 text-white/40">/</span>
                    <span>{items.length}</span>
                </div>
            )}

            {/* ---------- FLÈCHE PRÉCÉDENTE ---------- */}
            {hasMultiple && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-camvie-green md:left-6 md:h-14 md:w-14"
                    aria-label="Image précédente"
                >
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* ---------- IMAGE PRINCIPALE ---------- */}
            <div
                className="relative max-h-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="overflow-hidden rounded-xl shadow-2xl">
                    <img
                        src={urlForImage(item.image).width(1920).url()}
                        alt={item.image.alt || item.title || 'Photo CAMVIE SARL'}
                        className="max-h-[80vh] max-w-full object-contain animate-fade-in"
                        draggable={false}
                    />
                </div>

                {/* ---------- CAPTION ---------- */}
                {(item.title || item.caption) && (
                    <div className="mt-5 text-center">
                        {item.title && (
                            <p className="text-lg font-heading font-bold text-white md:text-xl">
                                {item.title}
                            </p>
                        )}
                        {item.caption && (
                            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-white/70">
                                {item.caption}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* ---------- FLÈCHE SUIVANTE ---------- */}
            {hasMultiple && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-camvie-green md:right-6 md:h-14 md:w-14"
                    aria-label="Image suivante"
                >
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* ---------- INDICATION CLAVIER ---------- */}
            {hasMultiple && showHint && (
                <div className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md md:flex">
                    <span className="flex items-center gap-1.5">
                        <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px]">←</kbd>
                        <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px]">→</kbd>
                        <span>Naviguer</span>
                    </span>
                    <span className="h-3 w-px bg-white/20" />
                    <span className="flex items-center gap-1.5">
                        <kbd className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px]">Esc</kbd>
                        <span>Fermer</span>
                    </span>
                </div>
            )}
        </div>
    );
}