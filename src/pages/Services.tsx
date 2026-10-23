import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';
import { activeServicesQuery } from '../lib/queries';
import type { Service } from '../types';
import Seo from '../components/Seo';

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

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    return (
        <div className="container mx-auto px-4 py-16">
            <Seo title="Nos services" />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-heading font-bold text-camvie-green mb-4">
                    Nos services
                </h1>
                <p className="text-camvie-gray-800 max-w-2xl mx-auto">
                    Trois pôles d'activité pour répondre à vos besoins.
                </p>
            </div>

            {services.length === 0 ? (
                <p className="text-center text-camvie-gray-800">
                    Aucun service publié pour le moment.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="bg-white rounded-lg shadow-md p-6 border-t-4 border-camvie-green hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-heading font-bold text-camvie-green mb-3">
                                {service.title}
                            </h2>
                            {service.short_description && (
                                <p className="text-camvie-gray-800 text-sm">
                                    {service.short_description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}