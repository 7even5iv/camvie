// src/components/TestimonialsSlider.tsx
import { useEffect, useState } from 'react';

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
            "Nous avons été accompagnés de la prospection à la signature. CAMVIE SARL connaît parfaitement le marché local.",
        author: 'Bertrand N.',
        role: 'Investisseur immobilier',
        initials: 'BN',
    },
    {
        quote:
            "Leur suivi après-vente fait toute la différence. On sent une vraie équipe derrière chaque dossier.",
        author: 'Mireille D.',
        role: 'Cliente particulière',
        initials: 'MD',
    },
];

export default function TestimonialsSlider() {
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
            aria-roledescription="carrousel"
            aria-label="Témoignages clients"
        >
            {/* Décor d'arrière-plan : gros guillemets flous */}
            <div
                className="absolute -top-10 left-6 text-[20rem] leading-none text-camvie-green/5 font-serif select-none pointer-events-none"
                aria-hidden="true"
            >
                “
            </div>

            <div className="container mx-auto px-4 relative">
                {/* En-tête de section */}
                <div className="text-center mb-10">
                    <span className="text-sm font-semibold uppercase tracking-wider text-camvie-red">
                        Ils nous font confiance
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-camvie-green mt-2">
                        Ce que disent nos clients
                    </h2>
                    <div className="h-1 w-16 bg-camvie-red rounded-full mt-3 mx-auto" />
                </div>

                {/* Piste de slides : crossfade vertical */}
                <div className="relative max-w-3xl mx-auto min-h-[280px] md:min-h-[240px]">
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
                            {/* Guillemets colorés */}
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

                {/* Navigation : flèches + dots */}
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