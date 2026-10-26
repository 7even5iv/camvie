// src/components/StaticPage.tsx
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

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto max-w-3xl px-4 pb-16">
                <h1 className="mb-8 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
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
        </div>
    );
}