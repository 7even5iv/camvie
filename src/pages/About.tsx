// src/pages/About.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { pageBySlugQuery } from '../lib/queries';
import type { Page } from '../types';
import { PortableText } from '@portabletext/react';
import Seo from '../components/Seo';

export default function About() {
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch<Page>(pageBySlugQuery, { slug: 'a-propos' })
            .then((data) => setPage(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    /* ---------- Chargement : squelette éditorial ---------- */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-3xl px-4 py-16">
                    <div className="mb-6 h-4 w-32 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="mb-4 h-10 w-2/3 animate-pulse rounded-lg bg-camvie-gray-100" />
                    <div className="mb-12 h-1 w-16 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-4 animate-pulse rounded bg-camvie-gray-100"
                                style={{ width: `${85 + Math.random() * 15}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- Aucune page rédigée dans Sanity ---------- */
    if (!page) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
                    <Seo title="À propos" />
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h1 className="mb-3 font-heading text-3xl font-bold text-camvie-green">
                        À propos
                    </h1>
                    <p className="mx-auto max-w-md text-camvie-gray-800">
                        Cette page est en cours de rédaction. Revenez bientôt pour en savoir plus
                        sur CAMVIE SARL.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-camvie-green px-6 py-3 font-semibold text-white transition hover:bg-camvie-green-light"
                    >
                        Retour à l'accueil
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    /* ---------- Rendu principal ---------- */
    return (
        <div className="pt-24 md:pt-28">
            <Seo title={page.title || 'À propos'} />

            {/* --- HERO ÉDITORIAL --- */}
            <section className="relative overflow-hidden bg-camvie-gray-50 py-16 md:py-20">
                {/* Trait d'accent en haut */}
                <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-camvie-red to-transparent" />

                {/* Motif pointillé subtil */}
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
                            Qui sommes-nous
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl lg:text-6xl">
                        {page.title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-camvie-gray-800">
                        Découvrez l'histoire, la mission et les valeurs qui animent CAMVIE SARL
                        au quotidien.
                    </p>
                </div>
            </section>

            {/* --- CONTENU ÉDITORIAL --- */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto max-w-3xl px-4">
                    {page.content && page.content.length > 0 ? (
                        <article
                            className="prose prose-lg max-w-none
                                       prose-headings:font-heading prose-headings:text-camvie-green prose-headings:font-bold
                                       prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                                       prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-camvie-gray-100
                                       prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                       prose-p:text-camvie-gray-800 prose-p:leading-relaxed prose-p:mb-5
                                       prose-a:text-camvie-red prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                       prose-strong:text-camvie-green prose-strong:font-semibold
                                       prose-ul:my-6 prose-ul:pl-6
                                       prose-li:text-camvie-gray-800 prose-li:mb-2 prose-li:marker:text-camvie-red
                                       prose-blockquote:border-l-4 prose-blockquote:border-camvie-red prose-blockquote:bg-camvie-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-camvie-green
                                       prose-img:rounded-xl prose-img:shadow-md prose-img:my-8"
                        >
                            <PortableText value={page.content} />
                        </article>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-camvie-gray-100 bg-camvie-gray-50 py-16 text-center">
                            <p className="text-camvie-gray-800">
                                Le contenu de cette page sera bientôt disponible.
                            </p>
                        </div>
                    )}

                    {/* --- CTA DE FIN --- */}
                    <div className="mt-16 rounded-2xl bg-gradient-to-br from-camvie-green to-camvie-green-light p-8 md:p-10 text-center shadow-lg">
                        <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-3xl">
                            Envie de travailler avec nous ?
                        </h2>
                        <p className="mx-auto mb-6 max-w-lg text-white/85">
                            Que ce soit pour un projet foncier, un besoin en commerce général
                            ou une opération d'import-export, notre équipe est à votre écoute.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-6 py-3 font-semibold text-white shadow-md transition hover:bg-white hover:text-camvie-red"
                            >
                                Nous contacter
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white hover:text-camvie-green"
                            >
                                Découvrir nos services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}