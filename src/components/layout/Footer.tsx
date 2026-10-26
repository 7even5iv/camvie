// src/components/Footer.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReactElement } from 'react'; 
import { sanityClient } from "../../lib/sanity";
import { siteSettingsQuery } from "../../lib/queries";
import logoCamvie from "../../assets/logo-camvie.png";
import type { SiteSettings } from '../../types';

/* ------------------------------------------------------------------
   Icônes sociales (mappées par nom de plateforme)
   ------------------------------------------------------------------ */
function SocialIcon({ platform, url }: { platform: string; url: string }) {
    const common = 'h-4 w-4';

    const icons: Record<string, ReactElement> = {
        facebook: (
            <svg className={common} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        instagram: (
            <svg className={common} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        linkedin: (
            <svg className={common} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        twitter: (
            <svg className={common} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        youtube: (
            <svg className={common} fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    };

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Suivez-nous sur ${platform}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-camvie-red hover:text-white"
        >
            {icons[platform] ?? icons.facebook}
        </a>
    );
}

/* ------------------------------------------------------------------
   Footer
   ------------------------------------------------------------------ */
export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        sanityClient
            .fetch<SiteSettings>(siteSettingsQuery)
            .then(setSettings)
            .catch(console.error);
    }, []);

    const whatsappDigits = settings?.whatsapp?.replace(/\D/g, '');

    const socials = settings?.socialLinks
        ? (Object.entries(settings.socialLinks).filter(([, url]) => !!url) as [string, string][])
        : [];

    return (
        <footer className="relative overflow-hidden bg-camvie-gray-900 text-white">
            {/* Décor : halo vert discret */}
            <div
                className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-camvie-green/20 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-camvie-red/10 blur-3xl"
                aria-hidden="true"
            />

            {/* Liseré supérieur vert → rouge */}
            <div className="relative h-1 bg-gradient-to-r from-camvie-green via-camvie-red to-camvie-green" />

            <div className="relative container mx-auto px-4 py-14 md:py-16">
                {/* ---------- GRILLE PRINCIPALE ---------- */}
                <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* COL 1 — Marque + contact */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="group inline-flex items-center gap-3">
                            {/* Logo réel (pastille blanche pour visibilité sur fond sombre) */}
                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 shadow-sm">
                                <img
                                    src={logoCamvie}
                                    alt="Logo CAMVIE SARL"
                                    className="h-full w-full object-contain"
                                    loading="eager"
                                />
                            </div>
                            <span className="font-heading text-xl font-bold text-white transition-colors group-hover:text-camvie-red">
                                CAMVIE SARL
                            </span>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                            Intermédiation foncière, commerce général et import-export.
                            Votre partenaire de confiance au Cameroun et au-delà.
                        </p>

                        {/* Contact rapide */}
                        <div className="mt-6 space-y-2.5 text-sm">
                            {settings?.phone && (
                                <a
                                    href={`tel:${settings.phone}`}
                                    className="flex items-center gap-2.5 text-white/70 transition hover:text-white"
                                >
                                    <svg className="h-4 w-4 text-camvie-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 3.5a2 2 0 01-1 2.17l-1.5.75a11 11 0 005.5 5.5l.75-1.5a2 2 0 012.17-1l3.5.7A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {settings.phone}
                                </a>
                            )}
                            {settings?.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="flex items-center gap-2.5 text-white/70 transition hover:text-white"
                                >
                                    <svg className="h-4 w-4 text-camvie-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {settings.email}
                                </a>
                            )}
                            {settings?.address && (
                                <div className="flex items-start gap-2.5 text-white/70">
                                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-camvie-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="leading-relaxed">{settings.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Réseaux sociaux */}
                        {socials.length > 0 && (
                            <div className="mt-6 flex items-center gap-2">
                                {socials.map(([platform, url]) => (
                                    <SocialIcon key={platform} platform={platform} url={url} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COL 2 — Navigation */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                            <span className="h-px w-4 bg-camvie-red" />
                            Navigation
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <FooterLink to="/">Accueil</FooterLink>
                            <FooterLink to="/a-propos">À propos</FooterLink>
                            <FooterLink to="/services">Services</FooterLink>
                            <FooterLink to="/opportunites">Opportunités</FooterLink>
                            <FooterLink to="/galerie">Galerie</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* COL 3 — Légal + CTA */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                            <span className="h-px w-4 bg-camvie-red" />
                            Informations
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <FooterLink to="/mentions-legales">Mentions légales</FooterLink>
                            <FooterLink to="/politique-de-confidentialite">
                                Politique de confidentialité
                            </FooterLink>
                            {whatsappDigits && (
                                <li>
                                    <a
                                        href={`https://wa.me/${whatsappDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-white/70 transition hover:text-camvie-red"
                                    >
                                        WhatsApp
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </li>
                            )}
                        </ul>

                        {/* Mini CTA */}
                        <Link
                            to="/contact"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-camvie-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-camvie-red/30 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-camvie-red"
                        >
                            Nous contacter
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* ---------- BARRE INFÉRIEURE ---------- */}
                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} CAMVIE SARL — Tous droits réservés.
                    </p>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-camvie-red/40 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-camvie-red/20"
                        aria-label="Retour en haut de page"
                    >
                        {/* Halo rouge au hover */}
                        <span
                            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-camvie-red/0 via-camvie-red/10 to-camvie-red/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            aria-hidden="true"
                        />

                        {/* Icône flèche dans une pastille qui change de couleur */}
                        <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-camvie-red/15 text-camvie-red transition-colors duration-300 group-hover:bg-camvie-red group-hover:text-white">
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                        </span>

                        <span>Retour en haut</span>
                    </button>
                </div>
            </div>
        </footer>
    );
}

/* ------------------------------------------------------------------
   Lien de navigation réutilisable
   ------------------------------------------------------------------ */
function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                to={to}
                className="group inline-flex items-center gap-1.5 text-white/70 transition hover:text-white"
            >
                <span className="h-px w-0 bg-camvie-red transition-all duration-200 group-hover:w-3" />
                {children}
            </Link>
        </li>
    );
}