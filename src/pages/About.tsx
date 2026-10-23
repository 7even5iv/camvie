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

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    if (!page) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Seo title="À propos" />
                <h1 className="text-2xl font-heading font-bold text-camvie-green mb-4">À propos</h1>
                <p className="text-camvie-gray-800">
                    Cette page n'a pas encore été rédigée dans le Studio Sanity.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <Seo title="À propos" />
            <h1 className="text-4xl font-heading font-bold text-camvie-green mb-8">
                {page.title}
            </h1>
            {page.content && (
                <div className="prose prose-lg max-w-none text-camvie-gray-800">
                    <PortableText value={page.content} />
                </div>
            )}
        </div>
    );
}