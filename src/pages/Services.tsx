// src/pages/Services.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { activeServicesQuery } from '../lib/queries';
import type { Service } from '../types';
import Seo from '../components/Seo';

/* ------------------------------------------------------------------
   Icônes par slug de service (fallback : icône par défaut)
   ------------------------------------------------------------------ */
function ServiceIcon({ slug }: { slug: string }) {
    const common = 'h-7 w-7';
    switch (slug) {
        case 'intermediation-fonciere':
            return (
                <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        case 'commerce-general':
            return (
                <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            );
        case 'import-export':
            return (
                <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return (
                <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
    }
}

export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch<Service[]>(activeServicesQuery)
            .then((data) => setServices(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    /* ---------- Chargement : squelette éditorial ---------- */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto px-4 py-16">
                    <div className="mb-6 h-4 w-32 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="mb-4 h-10 w-1/2 animate-pulse rounded-lg bg-camvie-gray-100" />
                    <div className="mb-12 h-1 w-16 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-64 animate-pulse rounded-2xl bg-camvie-gray-100" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-28">
            <Seo
                title="Nos services"
                description="Intermédiation foncière, commerce général et import-export : trois pôles d'expertise CAMVIE SARL au service de vos projets au Cameroun."
            />

            {/* --- HERO ÉDITORIAL --- */}
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
                    <div className="flex items-center gap-3 mb-5">
                        <span className="h-[2px] w-10 bg-camvie-red" />
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                            Notre expertise
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl lg:text-6xl">
                        Nos services
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-camvie-gray-800">
                        Trois pôles d'activité complémentaires pour vous accompagner
                        à chaque étape de vos projets, avec rigueur et transparence.
                    </p>
                </div>
            </section>

            {/* --- GRILLE DES SERVICES --- */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    {services.length === 0 ? (
                        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed border-camvie-gray-100 bg-camvie-gray-50 py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-camvie-green">
                                Services bientôt disponibles
                            </p>
                            <p className="mb-6 text-camvie-gray-800">
                                Notre équipe prépare actuellement la présentation détaillée
                                de nos activités.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-lg bg-camvie-green px-6 py-3 font-semibold text-white transition hover:bg-camvie-green-light"
                            >
                                Nous contacter
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => (
                                <article
                                    key={service._id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-camvie-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-camvie-green/30 hover:shadow-xl"
                                >
                                    {/* Bande d'accent au hover */}
                                    <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-camvie-green to-camvie-red transition-transform duration-500 group-hover:scale-x-100" />

                                    {/* Numéro + icône */}
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-camvie-green/10 text-camvie-green transition-colors duration-300 group-hover:bg-camvie-green group-hover:text-white">
                                            <ServiceIcon slug={service.slug?.current || ''} />
                                        </div>
                                        <span className="font-heading text-4xl font-bold text-camvie-gray-100 transition-colors duration-300 group-hover:text-camvie-red/20">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Titre */}
                                    <h2 className="mb-3 font-heading text-xl font-bold text-camvie-green">
                                        {service.title}
                                    </h2>

                                    {/* Description courte */}
                                    {service.short_description && (
                                        <p className="mb-6 text-sm leading-relaxed text-camvie-gray-800">
                                            {service.short_description}
                                        </p>
                                    )}

                                    {/* CTA discret en bas */}
                                    <Link
                                        to="/contact"
                                        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-camvie-red transition-all group-hover:gap-3"
                                    >
                                        En savoir plus
                                        <svg className="h-4 w-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* --- CTA DE FIN --- */}
            <section className="bg-white pb-20">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-camvie-green to-camvie-green-light p-8 text-center shadow-xl md:p-12">
                        {/* Décor */}
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
                                Un projet en tête ? Parlons-en.
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl text-white/85">
                                Notre équipe vous accompagne de la première consultation
                                à la réalisation de votre projet.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-white hover:text-camvie-red"
                                >
                                    Demander un devis
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
        </div>
    );
}