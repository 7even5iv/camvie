// src/pages/About.tsx
import { useEffect, useState } from 'react';
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

    /* État de chargement — padding-top pour passer sous le header */
    if (loading) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
                    <p className="text-camvie-gray-800">Chargement...</p>
                </div>
            </div>
        );
    }

    /* Aucune page rédigée dans Sanity */
    if (!page) {
        return (
            <div className="pt-24 md:pt-28">
                <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
                    <Seo title="À propos" />
                    <h1 className="mb-4 font-heading text-2xl font-bold text-camvie-green">
                        À propos
                    </h1>
                    <p className="text-camvie-gray-800">
                        Cette page n'a pas encore été rédigée dans le Studio Sanity.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto max-w-3xl px-4 pb-16">
                <Seo title="À propos" />
                <h1 className="mb-8 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                    {page.title}
                </h1>
                {page.content && (
                    <div className="prose prose-lg max-w-none text-camvie-gray-800">
                        <PortableText value={page.content} />
                    </div>
                )}
            </div>
        </div>
    );
}