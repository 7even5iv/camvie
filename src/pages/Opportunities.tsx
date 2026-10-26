// src/pages/Opportunities.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { publishedPropertiesQuery } from '../lib/queries';
import PropertyCard from '../components/PropertyCard';
import Seo from '../components/Seo';
import type { Property } from '../types';

/* ------------------------------------------------------------------
   Libellés FR pour les types de bien (fallback : le type brut)
   ------------------------------------------------------------------ */
const TYPE_LABELS: Record<string, string> = {
    terrain: 'Terrain',
    maison: 'Maison',
    appartement: 'Appartement',
    bureau: 'Bureau',
    commerce: 'Local commercial',
    autre: 'Autre',
};

function getTypeLabel(type?: string): string {
    if (!type) return 'Autre';
    return TYPE_LABELS[type] ?? type;
}

/* Filtre actif : 'all' ou un type de bien */
type Filter = string;

export default function Opportunities() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');

    useEffect(() => {
        sanityClient
            .fetch<Property[]>(publishedPropertiesQuery)
            .then((data) => setProperties(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    /* ---- Filtres dynamiques : types réellement présents ---- */
    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const p of properties) {
            const key = p.type || 'autre';
            counts[key] = (counts[key] || 0) + 1;
        }
        return counts;
    }, [properties]);

    const availableTypes = useMemo(() => Object.keys(typeCounts), [typeCounts]);

    /* ---- Résultats filtrés ---- */
    const filtered = useMemo(() => {
        if (filter === 'all') return properties;
        return properties.filter((p) => (p.type || 'autre') === filter);
    }, [properties, filter]);

    /* ---- Statistiques dérivées ---- */
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
        <div className="pt-24 md:pt-28">
            <Seo
                title="Opportunités foncières"
                description="Découvrez notre sélection de biens fonciers disponibles à la vente au Cameroun : terrains, maisons, appartements et locaux commerciaux."
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
                            Notre catalogue
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl lg:text-6xl">
                        Opportunités foncières
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-camvie-gray-800">
                        Des biens vérifiés, sécurisés et documentés. Chaque opportunité est
                        accompagnée par notre équipe, de la visite à la signature.
                    </p>
                </div>
            </section>

            {/* ---------- BARRE DE STATS ---------- */}
            {!loading && properties.length > 0 && (
                <section className="bg-white">
                    <div className="container mx-auto px-4">
                        <div className="-mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    </div>
                </section>
            )}

            {/* ---------- FILTRES ---------- */}
            {!loading && properties.length > 0 && availableTypes.length > 1 && (
                <section className="bg-white pt-12">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-2 text-sm font-semibold text-camvie-gray-500">
                                Filtrer :
                            </span>

                            <button
                                onClick={() => setFilter('all')}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === 'all'
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
                                    {properties.length}
                                </span>
                            </button>

                            {availableTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === type
                                            ? 'border-camvie-green bg-camvie-green text-white shadow-sm'
                                            : 'border-camvie-gray-100 bg-white text-camvie-gray-800 hover:border-camvie-green/40 hover:text-camvie-green'
                                        }`}
                                >
                                    {getTypeLabel(type)}
                                    <span
                                        className={`rounded-full px-1.5 text-xs ${filter === type
                                                ? 'bg-white/20 text-white'
                                                : 'bg-camvie-gray-100 text-camvie-gray-800'
                                            }`}
                                    >
                                        {typeCounts[type]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- GRILLE DES BIENS ---------- */}
            <section className="bg-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-96 animate-pulse rounded-2xl bg-camvie-gray-100" />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed border-camvie-gray-100 bg-camvie-gray-50 py-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camvie-green/10 text-camvie-green">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="mb-2 text-lg font-semibold text-camvie-green">
                                Aucune opportunité publiée
                            </p>
                            <p className="mb-6 text-camvie-gray-800">
                                De nouvelles annonces arrivent régulièrement. Revenez bientôt
                                ou contactez-nous pour être informé en priorité.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-6 py-3 font-semibold text-white transition hover:bg-camvie-green"
                            >
                                Être informé
                            </Link>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl bg-camvie-gray-50 py-16 text-center">
                            <p className="mb-4 text-camvie-gray-800">
                                Aucun bien de ce type pour le moment.
                            </p>
                            <button
                                onClick={() => setFilter('all')}
                                className="inline-flex items-center gap-2 rounded-lg bg-camvie-green px-5 py-2.5 font-semibold text-white transition hover:bg-camvie-green-light"
                            >
                                Voir tous les biens
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-sm text-camvie-gray-500">
                                <span className="font-semibold text-camvie-green">
                                    {filtered.length}
                                </span>{' '}
                                bien{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                                {filter !== 'all' && (
                                    <> · filtre&nbsp;: <span className="font-semibold text-camvie-green">{getTypeLabel(filter)}</span></>
                                )}
                            </p>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((property) => (
                                    <PropertyCard key={property._id} property={property} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ---------- CTA DE FIN ---------- */}
            {!loading && properties.length > 0 && (
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
                                    Vous ne trouvez pas ce que vous cherchez ?
                                </h2>
                                <p className="mx-auto mb-8 max-w-xl text-white/85">
                                    Notre équipe peut rechercher pour vous le bien idéal
                                    selon vos critères, votre budget et votre localisation.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 rounded-lg bg-camvie-red px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-white hover:text-camvie-red"
                                    >
                                        Décrire mon projet
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white hover:text-camvie-green"
                                    >
                                        Voir nos services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}