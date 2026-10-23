import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';
import { publishedPropertiesQuery } from '../lib/queries';
import PropertyCard from '../components/PropertyCard';
import Seo from '../components/Seo';
import type { Property } from '../types';

export default function Opportunities() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch<Property[]>(publishedPropertiesQuery)
            .then((data) => setProperties(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container mx-auto px-4 py-16">
            <Seo
                title="Opportunités foncières"
                description="Découvrez notre sélection de biens fonciers disponibles à la vente au Cameroun."
            />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-heading font-bold text-camvie-green mb-4">
                    Opportunités foncières
                </h1>
                <p className="text-camvie-gray-800 max-w-2xl mx-auto">
                    Découvrez notre sélection de biens disponibles à la vente.
                </p>
            </div>

            {loading ? (
                <p className="text-center text-camvie-gray-800">Chargement...</p>
            ) : properties.length === 0 ? (
                <div className="text-center py-12 bg-camvie-gray-50 rounded-lg">
                    <p className="text-camvie-gray-800">
                        Aucune opportunité publiée pour le moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}