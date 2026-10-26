// src/components/FloatingSocial.tsx
import { useEffect, useState, useRef } from 'react';
import type { ReactElement } from 'react';
import { sanityClient } from '../lib/sanity';
import { siteSettingsQuery } from '../lib/queries';
import type { SiteSettings } from '../types';

type SocialLink = {
    platform: string;
    url: string;
    label: string;
    bg: string;
    icon: ReactElement;
};

export default function FloatingSocial() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        sanityClient
            .fetch<SiteSettings>(siteSettingsQuery)
            .then((data) => {
                console.log('[FloatingSocial] settings fetched:', data);
                setSettings(data);
            })
            .catch((err) => {
                console.error('[FloatingSocial] fetch error:', err);
            });
    }, []);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    const whatsappDigits = settings?.whatsapp?.replace(/\D/g, '');

    const links: SocialLink[] = [];

    // ⚠️ FALLBACK : si WhatsApp est vide, on utilise un numéro de démo
    links.push({
        platform: 'whatsapp',
        url: whatsappDigits
            ? `https://wa.me/${whatsappDigits}`
            : 'https://wa.me/237688126544', // ← numéro fictif
        label: 'WhatsApp',
        bg: 'bg-[#25D366] hover:bg-[#1FBE5A]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
        ),
    });

    // ⚠️ FALLBACK : Facebook forcé
    links.push({
        platform: 'facebook',
        url: settings?.socialLinks?.facebook || 'https://www.facebook.com/profile.php?id=61591642154039',
        label: 'Facebook',
        bg: 'bg-[#1877F2] hover:bg-[#0F5FC4]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    });

    // ⚠️ FALLBACK : TikTok forcé
    links.push({
        platform: 'tiktok',
        url: settings?.socialLinks?.tiktok || 'https://tiktok.com/@camvie',
        label: 'TikTok',
        bg: 'bg-black hover:bg-[#1a1a1a]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        ),
    });

    return (
        <div
            ref={containerRef}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
            {links.map((link, index) => (
                <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir ${link.label}`}
                    tabIndex={open ? 0 : -1}
                    className={`group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out ${link.bg} ${open
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none translate-y-3 scale-75 opacity-0'
                        }`}
                    style={{
                        transitionDelay: open ? `${(links.length - 1 - index) * 70}ms` : '0ms',
                    }}
                >
                    {link.icon}
                    <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-camvie-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                        {link.label}
                        <span className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-camvie-gray-900" />
                    </span>
                </a>
            ))}

            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? 'Fermer les réseaux sociaux' : 'Ouvrir les réseaux sociaux'}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-camvie-red text-white shadow-lg shadow-camvie-red/30 transition-all duration-300 hover:scale-105 hover:bg-camvie-green hover:shadow-xl hover:shadow-camvie-green/30"
            >
                {!open && (
                    <span
                        className="absolute inset-0 -z-10 animate-ping rounded-full bg-camvie-red opacity-20"
                        style={{ animationDuration: '2.5s' }}
                        aria-hidden="true"
                    />
                )}
                <svg
                    className={`relative h-6 w-6 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    )}
                </svg>
            </button>
        </div>
    );
}