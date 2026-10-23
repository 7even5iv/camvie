import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../lib/sanity';
import { pageBySlugQuery } from '../lib/queries';
import type { Page } from '../types';

interface Props {
    slug: string;
    fallbackTitle: string;
}

export default function StaticPage({ slug, fallbackTitle }: Props) {
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sanityClient
            .fetch<Page>(pageBySlugQuery, { slug })
            .then(setPage)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="text-center py-12">Chargement...</div>;

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <h1 className="text-4xl font-heading font-bold text-camvie-green mb-8">
                {page?.title || fallbackTitle}
            </h1>

            {page?.content ? (
                <div className="prose prose-lg max-w-none text-camvie-gray-800">
                    <PortableText value={page.content} />
                </div>
            ) : (
                <p className="text-camvie-gray-800">
                    Cette page n'a pas encore été rédigée. Merci de la compléter dans Sanity Studio.
                </p>
            )}
        </div>
    );
}