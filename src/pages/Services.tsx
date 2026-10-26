// src/pages/Services.tsx
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

    /* État de chargement — padding-top pour passer sous le header */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-camvie-gray-800">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto px-4 pb-16">
                <Seo title="Nos services" />

                <div className="mb-12 text-center">
                    <h1 className="mb-4 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                        Nos services
                    </h1>
                    <p className="mx-auto max-w-2xl text-camvie-gray-800">
                        Trois pôles d'activité pour répondre à vos besoins.
                    </p>
                </div>

                {services.length === 0 ? (
                    <p className="text-center text-camvie-gray-800">
                        Aucun service publié pour le moment.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="rounded-lg border-t-4 border-camvie-green bg-white p-6 shadow-md transition hover:shadow-lg"
                            >
                                <h2 className="mb-3 font-heading text-xl font-bold text-camvie-green">
                                    {service.title}
                                </h2>
                                {service.short_description && (
                                    <p className="text-sm text-camvie-gray-800">
                                        {service.short_description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}