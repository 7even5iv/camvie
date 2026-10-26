// src/pages/Opportunities.tsx
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
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto px-4 pb-16">
                <Seo
                    title="Opportunités foncières"
                    description="Découvrez notre sélection de biens fonciers disponibles à la vente au Cameroun."
                />

                <div className="mb-12 text-center">
                    <h1 className="mb-4 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                        Opportunités foncières
                    </h1>
                    <p className="mx-auto max-w-2xl text-camvie-gray-800">
                        Découvrez notre sélection de biens disponibles à la vente.
                    </p>
                </div>

                {loading ? (
                    <p className="text-center text-camvie-gray-800">Chargement...</p>
                ) : properties.length === 0 ? (
                    <div className="rounded-lg bg-camvie-gray-50 py-12 text-center">
                        <p className="text-camvie-gray-800">
                            Aucune opportunité publiée pour le moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}