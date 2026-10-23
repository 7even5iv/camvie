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

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    if (!property) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Seo title="Bien introuvable" />
                <h1 className="text-2xl font-heading font-bold text-camvie-green mb-4">
                    Bien introuvable
                </h1>
                <p className="text-camvie-gray-800 mb-6">
                    Cette opportunité n'existe pas ou n'est plus disponible.
                </p>
                <Link
                    to="/opportunites"
                    className="bg-camvie-green text-white px-6 py-3 rounded-lg hover:bg-camvie-green-light transition inline-block"
                >
                    Retour au catalogue
                </Link>
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
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Seo title={property.title} description={seoDescription} />

            <Link
                to="/opportunites"
                className="text-camvie-green hover:underline text-sm mb-6 inline-block"
            >
                ← Retour au catalogue
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche : images + description */}
                <div className="lg:col-span-2">
                    {/* Image principale */}
                    <div className="bg-camvie-gray-100 rounded-lg overflow-hidden mb-3 aspect-[4/3]">
                        {images[activeImage] ? (
                            <img
                                src={urlForImage(images[activeImage]).width(1200).url()}
                                alt={images[activeImage].alt || property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-camvie-gray-800">
                                Photo à venir
                            </div>
                        )}
                    </div>

                    {/* Miniatures */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`aspect-square rounded overflow-hidden border-2 ${activeImage === i ? 'border-camvie-green' : 'border-transparent'
                                        }`}
                                >
                                    <img
                                        src={urlForImage(img).width(200).height(200).url()}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-heading font-bold text-camvie-green mb-4">
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
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <span className="text-xs text-camvie-gray-800 uppercase tracking-wide">
                            Référence {property.reference}
                        </span>
                        <h1 className="text-2xl font-heading font-bold text-camvie-green mt-2 mb-4">
                            {property.title}
                        </h1>

                        <div className="space-y-2 text-sm text-camvie-gray-800 mb-6">
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

                        <div className="border-t border-camvie-gray-100 pt-4 mb-6">
                            <p className="text-xs text-camvie-gray-800 mb-1">Prix / Conditions</p>
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
                                className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 transition mb-3 font-semibold"
                            >
                                💬 Demander via WhatsApp
                            </a>
                        )}

                        <Link
                            to="/contact"
                            state={{ propertyId: property._id, propertyTitle: property.title }}
                            className="block w-full bg-camvie-red text-white text-center px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold"
                        >
                            Formulaire de demande
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}