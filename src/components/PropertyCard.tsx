// src/components/PropertyCard.tsx
import { Link } from 'react-router-dom';
import { urlForImage } from '../lib/imageUrl';
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

function getTypeLabel(type?: string): string | null {
    if (!type) return null;
    return TYPE_LABELS[type] ?? type;
}

export default function PropertyCard({ property }: { property: Property }) {
    const coverImage = property.images?.[0];
    const typeLabel = getTypeLabel(property.type);

    return (
        <Link
            to={`/opportunites/${property.slug.current}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-camvie-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-camvie-green/30 hover:shadow-xl"
        >
            {/* ---------- IMAGE ---------- */}
            <div className="relative aspect-[4/3] overflow-hidden bg-camvie-gray-100">
                {coverImage ? (
                    <img
                        src={urlForImage(coverImage).width(600).height(450).url()}
                        alt={coverImage.alt || property.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-camvie-gray-500">
                        <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-xs font-medium">Photo à venir</span>
                    </div>
                )}

                {/* Dégradé bas pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Badge "À la une" (haut gauche) */}
                {property.is_featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-camvie-red px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        À la une
                    </span>
                )}

                {/* Badge type de bien (haut droit) */}
                {typeLabel && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-camvie-green shadow-sm backdrop-blur-sm">
                        {typeLabel}
                    </span>
                )}

                {/* Référence (bas gauche) */}
                <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Réf. {property.reference}
                </span>
            </div>

            {/* ---------- CONTENU ---------- */}
            <div className="flex flex-1 flex-col p-5">
                {/* Titre */}
                <h3 className="mb-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-camvie-green transition-colors duration-200 group-hover:text-camvie-red">
                    {property.title}
                </h3>

                {/* Localisation + superficie */}
                <div className="mb-4 space-y-1.5 text-sm text-camvie-gray-800">
                    {property.location && (
                        <div className="flex items-center gap-2">
                            <svg
                                className="h-4 w-4 shrink-0 text-camvie-red"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <span className="line-clamp-1">{property.location}</span>
                        </div>
                    )}

                    {property.area && (
                        <div className="flex items-center gap-2">
                            <svg
                                className="h-4 w-4 shrink-0 text-camvie-red"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                            <span>{property.area.toLocaleString('fr-FR')} m²</span>
                        </div>
                    )}
                </div>

                {/* Prix + CTA */}
                <div className="mt-auto flex items-end justify-between border-t border-camvie-gray-100 pt-4">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-camvie-gray-500">
                            Prix
                        </p>
                        <p className="text-lg font-bold text-camvie-red">
                            {property.price
                                ? `${property.price.toLocaleString('fr-FR')} FCFA`
                                : 'Sur demande'}
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-camvie-green transition-all duration-200 group-hover:gap-2 group-hover:text-camvie-red">
                        Voir
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}