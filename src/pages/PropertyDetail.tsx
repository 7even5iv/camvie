// src/pages/PropertyDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../lib/sanity';
import { propertyBySlugQuery, siteSettingsQuery } from '../lib/queries';
import { urlForImage } from '../lib/imageUrl';
import Seo from '../components/Seo';
import type { Property, SiteSettings, PortableTextBlock } from '../types';

/* ------------------------------------------------------------------
   Libellés FR pour les types de bien
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
    if (!type) return 'Bien immobilier';
    return TYPE_LABELS[type] ?? type;
}

/* Extrait le texte brut des blocs PortableText pour la meta description */
function extractText(blocks: PortableTextBlock[] | undefined, maxLength = 160): string | undefined {
    if (!blocks || blocks.length === 0) return undefined;
    const text = blocks
        .filter((b) => b._type === 'block')
        .map((b) =>
            (b.children || [])
                .map((child) => child.text || '')
                .join('')
        )
        .join(' ')
        .trim();
    if (!text) return undefined;
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export default function PropertyDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prop, set] = await Promise.all([
                    sanityClient.fetch<Property | null>(propertyBySlugQuery, { slug }),
                    sanityClient.fetch<SiteSettings>(siteSettingsQuery),
                ]);
                setProperty(prop);
                setSettings(set);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    /* ---------- CHARGEMENT : squelette éditorial ---------- */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-6xl px-4 py-12">
                    <div className="mb-6 h-4 w-48 animate-pulse rounded-full bg-camvie-gray-100" />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="mb-3 aspect-[4/3] animate-pulse rounded-2xl bg-camvie-gray-100" />
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-square animate-pulse rounded-lg bg-camvie-gray-100" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-camvie-gray-100 bg-white p-6 shadow-sm">
                                <div className="mb-4 h-4 w-24 animate-pulse rounded bg-camvie-gray-100" />
                                <div className="mb-3 h-8 w-3/4 animate-pulse rounded bg-camvie-gray-100" />
                                <div className="mb-6 h-20 animate-pulse rounded bg-camvie-gray-100" />
                                <div className="h-14 animate-pulse rounded-lg bg-camvie-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- BIEN INTROUVABLE ---------- */
    if (!property) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
                    <Seo title="Bien introuvable" />
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-camvie-red/10 text-camvie-red">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="mb-3 font-heading text-3xl font-bold text-camvie-green">
                        Bien introuvable
                    </h1>
                    <p className="mx-auto mb-8 max-w-md text-camvie-gray-800">
                        Cette opportunité n'existe pas ou n'est plus disponible.
                        Découvrez les autres biens actuellement en vente.
                    </p>
                    <Link
                        to="/opportunites"
                        className="inline-flex items-center gap-2 rounded-lg bg-camvie-green px-6 py-3 font-semibold text-white transition hover:bg-camvie-green-light"
                    >
                        Retour au catalogue
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    /* ---------- DONNÉES DÉRIVÉES ---------- */
    const images = property.images || [];
    const typeLabel = getTypeLabel(property.type);

    /* URL absolue du bien (pour partage + message WhatsApp) */
    const propertyUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/opportunites/${property.slug.current}`
            : `/opportunites/${property.slug.current}`;

    /* ============================================================
       📱 MESSAGE WHATSAPP ENRICHI — Contact direct
       Inclut tous les détails du bien + URL cliquable
       ============================================================ */
    const whatsappContactMessage = encodeURIComponent(
        `Bonjour CAMVIE SARL 👋\n\n` +
        `Je suis intéressé(e) par ce bien :\n\n` +
        `🏠 *${property.title}*\n` +
        `📋 Réf. : ${property.reference}\n` +
        `${property.type ? `🏷️ Type : ${typeLabel}\n` : ''}` +
        `${property.location ? `📍 Localisation : ${property.location}\n` : ''}` +
        `${property.area ? `📐 Superficie : ${property.area.toLocaleString('fr-FR')} m²\n` : ''}` +
        `${property.price ? `💰 Prix : ${property.price.toLocaleString('fr-FR')} FCFA\n` : ''}` +
        `\n🔗 Voir le bien : ${propertyUrl}\n\n` +
        `Pouvez-vous me donner plus d'informations ?`
    );

    const whatsappUrl = settings?.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${whatsappContactMessage}`
        : null;

    /* ============================================================
       📤 MESSAGE DE PARTAGE — Plus court, pour recommander à un proche
       ============================================================ */
    const whatsappShareMessage = encodeURIComponent(
        `Découvrez ce bien sur CAMVIE SARL :\n\n` +
        `🏠 *${property.title}*\n` +
        `${property.location ? `📍 ${property.location}\n` : ''}` +
        `${property.area ? `📐 ${property.area.toLocaleString('fr-FR')} m²\n` : ''}` +
        `${property.price ? `💰 ${property.price.toLocaleString('fr-FR')} FCFA\n` : ''}` +
        `\n🔗 ${propertyUrl}`
    );

    const whatsappShareUrl = `https://wa.me/?text=${whatsappShareMessage}`;

    /* Partage natif (mobile) avec fallback WhatsApp */
    const handleShare = async () => {
        const shareData = {
            title: property.title,
            text: `Découvrez ce bien sur CAMVIE SARL : ${property.title}`,
            url: propertyUrl,
        };

        // 1. API native (mobile + certains navigateurs)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // L'utilisateur a annulé → on ne fait rien
                if (err instanceof Error && err.name === 'AbortError') return;
                // Sinon on continue avec le fallback
            }
        }

        // 2. Fallback : copier le lien
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(propertyUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
            } catch {
                // Clipboard indisponible → ultime fallback
            }
        }

        // 3. Ultime fallback : ouvrir WhatsApp share
        window.open(whatsappShareUrl, '_blank', 'noopener,noreferrer');
    };

    const seoDescription =
        extractText(property.description) ||
        [
            property.title,
            property.type ? `Type : ${typeLabel}` : null,
            property.location ? `à ${property.location}` : null,
            property.area ? `${property.area} m²` : null,
            `Réf. ${property.reference}`,
        ]
            .filter(Boolean)
            .join(' — ');

    const goPrevImage = () =>
        setActiveImage((i) => (i - 1 + images.length) % images.length);
    const goNextImage = () => setActiveImage((i) => (i + 1) % images.length);

    /* ---------- RENDU PRINCIPAL ---------- */
    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto max-w-6xl px-4 pb-16">
                <Seo title={property.title} description={seoDescription} />

                {/* ---------- BREADCRUMB ---------- */}
                <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-2 text-sm">
                    <Link to="/" className="text-camvie-gray-500 transition hover:text-camvie-green">
                        Accueil
                    </Link>
                    <span className="text-camvie-gray-300">/</span>
                    <Link to="/opportunites" className="text-camvie-gray-500 transition hover:text-camvie-green">
                        Opportunités
                    </Link>
                    <span className="text-camvie-gray-300">/</span>
                    <span className="truncate font-semibold text-camvie-green">{property.title}</span>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* ============================================================
                        COLONNE GAUCHE : galerie + description
                        ============================================================ */}
                    <div className="lg:col-span-2">
                        {/* ---- GALERIE PRINCIPALE ---- */}
                        <div className="mb-4">
                            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-camvie-gray-100 shadow-sm">
                                {images[activeImage] ? (
                                    <img
                                        src={urlForImage(images[activeImage]).width(1600).url()}
                                        alt={images[activeImage].alt || property.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="eager"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-camvie-gray-500">
                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">Photo à venir</span>
                                    </div>
                                )}

                                {/* Compteur */}
                                {images.length > 1 && (
                                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                        {activeImage + 1} / {images.length}
                                    </div>
                                )}

                                {/* Badge "À la une" */}
                                {property.is_featured && (
                                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-camvie-red px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        À la une
                                    </div>
                                )}

                                {/* Flèches de navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={goPrevImage}
                                            aria-label="Image précédente"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-camvie-green group-hover:opacity-100"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={goNextImage}
                                            aria-label="Image suivante"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-camvie-green group-hover:opacity-100"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* ---- MINIATURES ---- */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                                activeImage === i
                                                    ? 'border-camvie-green ring-2 ring-camvie-green/20'
                                                    : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                            aria-label={`Voir la photo ${i + 1}`}
                                        >
                                            <img
                                                src={urlForImage(img).width(200).height(200).url()}
                                                alt=""
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ---- DESCRIPTION ---- */}
                        <article className="rounded-2xl border border-camvie-gray-100 bg-white p-6 shadow-sm md:p-8">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-[2px] w-8 bg-camvie-red" />
                                <h2 className="font-heading text-2xl font-bold text-camvie-green">
                                    Description
                                </h2>
                            </div>

                            {property.description && property.description.length > 0 ? (
                                <div
                                    className="prose prose-lg max-w-none
                                               prose-headings:font-heading prose-headings:text-camvie-green prose-headings:font-bold
                                               prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                                               prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                                               prose-p:text-camvie-gray-800 prose-p:leading-relaxed prose-p:mb-4
                                               prose-a:text-camvie-red prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                               prose-strong:text-camvie-green prose-strong:font-semibold
                                               prose-ul:my-4 prose-ul:pl-5
                                               prose-li:text-camvie-gray-800 prose-li:mb-1.5 prose-li:marker:text-camvie-red
                                               prose-blockquote:border-l-4 prose-blockquote:border-camvie-red prose-blockquote:bg-camvie-gray-50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-camvie-green"
                                >
                                    <PortableText value={property.description} />
                                </div>
                            ) : (
                                <div className="rounded-xl bg-camvie-gray-50 py-10 text-center">
                                    <p className="text-camvie-gray-500">
                                        Aucune description détaillée n'a été fournie pour ce bien.
                                        Contactez-nous pour plus d'informations.
                                    </p>
                                </div>
                            )}
                        </article>
                    </div>

                    {/* ============================================================
                        COLONNE DROITE : sidebar sticky
                        ============================================================ */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4">
                            {/* ---- CARTE PRINCIPALE ---- */}
                            <div className="overflow-hidden rounded-2xl border border-camvie-gray-100 bg-white shadow-sm">
                                {/* Bandeau référence + type */}
                                <div className="flex items-center justify-between border-b border-camvie-gray-100 bg-camvie-gray-50 px-5 py-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                        Réf. {property.reference}
                                    </span>
                                    <span className="rounded-full bg-camvie-green/10 px-2.5 py-1 text-xs font-semibold text-camvie-green">
                                        {typeLabel}
                                    </span>
                                </div>

                                <div className="p-5 md:p-6">
                                    {/* Titre + bouton partage */}
                                    <div className="mb-5 flex items-start justify-between gap-3">
                                        <h1 className="font-heading text-2xl font-bold leading-tight text-camvie-green">
                                            {property.title}
                                        </h1>

                                        <button
                                            onClick={handleShare}
                                            aria-label="Partager ce bien"
                                            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-camvie-gray-100 bg-white text-camvie-gray-500 transition-all hover:border-camvie-green/30 hover:bg-camvie-green/5 hover:text-camvie-green"
                                        >
                                            {copied ? (
                                                /* Icône "check" quand le lien est copié */
                                                <svg className="h-4 w-4 text-camvie-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                /* Icône partage classique */
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                            )}

                                            {/* Tooltip */}
                                            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-camvie-gray-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                                {copied ? 'Lien copié !' : 'Partager'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Caractéristiques avec icônes */}
                                    <div className="mb-5 space-y-3">
                                        {property.location && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-camvie-green/10 text-camvie-green">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-camvie-gray-500">Localisation</div>
                                                    <div className="font-semibold text-camvie-gray-800">
                                                        {property.location}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {property.area && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-camvie-green/10 text-camvie-green">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-camvie-gray-500">Superficie</div>
                                                    <div className="font-semibold text-camvie-gray-800">
                                                        {property.area.toLocaleString('fr-FR')} m²
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-camvie-green/10 text-camvie-green">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs text-camvie-gray-500">Statut</div>
                                                <div className="font-semibold text-camvie-green">
                                                    Disponible
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prix */}
                                    <div className="mb-5 rounded-xl border border-camvie-red/10 bg-gradient-to-br from-camvie-red/5 to-transparent p-4">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                            Prix
                                        </p>
                                        <p className="font-heading text-2xl font-bold text-camvie-red">
                                            {property.price
                                                ? `${property.price.toLocaleString('fr-FR')} FCFA`
                                                : 'Sur demande'}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div className="space-y-2">
                                        {whatsappUrl && (
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1FBE5A] hover:shadow-md hover:shadow-green-600/20"
                                            >
                                                <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Contacter sur WhatsApp
                                            </a>
                                        )}

                                        <Link
                                            to="/contact"
                                            state={{ propertyId: property._id, propertyTitle: property.title }}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-camvie-red px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-camvie-green"
                                        >
                                            Formulaire de demande
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Bouton "Partager sur WhatsApp" secondaire */}
                                    <div className="mt-3 border-t border-camvie-gray-100 pt-3">
                                        <a
                                            href={whatsappShareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-camvie-gray-500 transition hover:text-[#25D366]"
                                        >
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            Partager sur WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* ---- BADGES DE CONFIANCE ---- */}
                            <div className="rounded-2xl border border-camvie-gray-100 bg-white p-5 shadow-sm">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                    Nos garanties
                                </p>
                                <ul className="space-y-2.5 text-sm">
                                    <li className="flex items-start gap-2.5 text-camvie-gray-800">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-camvie-green" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Bien vérifié et documenté</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-camvie-gray-800">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-camvie-green" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Accompagnement de A à Z</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-camvie-gray-800">
                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-camvie-green" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Transaction transparente</span>
                                    </li>
                                </ul>
                            </div>

                            {/* ---- RETOUR CATALOGUE ---- */}
                            <Link
                                to="/opportunites"
                                className="flex items-center justify-center gap-2 rounded-xl border border-camvie-gray-100 bg-white px-5 py-3 text-sm font-semibold text-camvie-gray-800 shadow-sm transition hover:border-camvie-green/30 hover:text-camvie-green"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voir tous les biens
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}