// src/pages/PropertyDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../lib/sanity';
import { propertyBySlugQuery, siteSettingsQuery } from '../lib/queries';
import { urlForImage } from '../lib/imageUrl';
import Seo from '../components/Seo';
import type { Property, SiteSettings } from '../types';

// Extrait le texte brut des blocs PortableText pour la meta description
function extractText(blocks: any[] | undefined, maxLength = 160): string | undefined {
    if (!blocks || blocks.length === 0) return undefined;
    const text = blocks
        .filter((b) => b._type === 'block')
        .map((b) =>
            (b.children || [])
                .map((child: any) => child.text || '')
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

    /* État de chargement — padding-top pour passer sous le header */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-6xl px-4 py-12 text-center">
                    <p className="text-camvie-gray-800">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
                    <Seo title="Bien introuvable" />
                    <h1 className="mb-4 font-heading text-2xl font-bold text-camvie-green">
                        Bien introuvable
                    </h1>
                    <p className="mb-6 text-camvie-gray-800">
                        Cette opportunité n'existe pas ou n'est plus disponible.
                    </p>
                    <Link
                        to="/opportunites"
                        className="inline-block rounded-lg bg-camvie-green px-6 py-3 text-white transition hover:bg-camvie-green-light"
                    >
                        Retour au catalogue
                    </Link>
                </div>
            </div>
        );
    }

    const images = property.images || [];
    const whatsappMessage = encodeURIComponent(
        `Bonjour, je suis intéressé(e) par le bien "${property.title}" (réf. ${property.reference}). Pouvez-vous me donner plus d'informations ?`
    );
    const whatsappUrl = settings?.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`
        : null;

    // Description SEO : soit le texte de la description Sanity, soit composée des champs
    const seoDescription =
        extractText(property.description) ||
        [
            property.title,
            property.type ? `Type : ${property.type}` : null,
            property.location ? `à ${property.location}` : null,
            property.area ? `${property.area} m²` : null,
            `Réf. ${property.reference}`,
        ]
            .filter(Boolean)
            .join(' — ');

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto max-w-6xl px-4 pb-12">
                <Seo title={property.title} description={seoDescription} />

                <Link
                    to="/opportunites"
                    className="mb-6 inline-block text-sm text-camvie-green hover:underline"
                >
                    ← Retour au catalogue
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Colonne gauche : images + description */}
                    <div className="lg:col-span-2">
                        {/* Image principale */}
                        <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-camvie-gray-100">
                            {images[activeImage] ? (
                                <img
                                    src={urlForImage(images[activeImage]).width(1200).url()}
                                    alt={images[activeImage].alt || property.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-camvie-gray-800">
                                    Photo à venir
                                </div>
                            )}
                        </div>

                        {/* Miniatures */}
                        {images.length > 1 && (
                            <div className="mb-8 grid grid-cols-4 gap-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square overflow-hidden rounded border-2 ${activeImage === i ? 'border-camvie-green' : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={urlForImage(img).width(200).height(200).url()}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-4 font-heading text-2xl font-bold text-camvie-green">
                                Description
                            </h2>
                            {property.description ? (
                                <div className="prose prose-camvie max-w-none text-camvie-gray-800">
                                    <PortableText value={property.description} />
                                </div>
                            ) : (
                                <p className="text-camvie-gray-800">Aucune description fournie.</p>
                            )}
                        </div>
                    </div>

                    {/* Colonne droite : infos + contact */}
                    <div className="lg:col-span-1">
                        {/* sticky top-28 = 112px : reste sous le header flottant */}
                        <div className="sticky top-28 rounded-lg bg-white p-6 shadow-md">
                            <span className="text-xs uppercase tracking-wide text-camvie-gray-800">
                                Référence {property.reference}
                            </span>
                            <h1 className="mb-4 mt-2 font-heading text-2xl font-bold text-camvie-green">
                                {property.title}
                            </h1>

                            <div className="mb-6 space-y-2 text-sm text-camvie-gray-800">
                                {property.type && (
                                    <p><strong>Type :</strong> {property.type}</p>
                                )}
                                {property.location && (
                                    <p><strong>Localisation :</strong> {property.location}</p>
                                )}
                                {property.area && (
                                    <p><strong>Superficie :</strong> {property.area} m²</p>
                                )}
                            </div>

                            <div className="mb-6 border-t border-camvie-gray-100 pt-4">
                                <p className="mb-1 text-xs text-camvie-gray-800">Prix / Conditions</p>
                                <p className="text-2xl font-bold text-camvie-red">
                                    {property.price
                                        ? `${property.price.toLocaleString('fr-FR')} FCFA`
                                        : 'Sur demande'}
                                </p>
                            </div>

                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-3 block w-full rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                                >
                                    💬 Demander via WhatsApp
                                </a>
                            )}

                            <Link
                                to="/contact"
                                state={{ propertyId: property._id, propertyTitle: property.title }}
                                className="block w-full rounded-lg bg-camvie-red px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                            >
                                Formulaire de demande
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}