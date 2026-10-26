// src/pages/Contact.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import { siteSettingsQuery } from '../lib/queries';
import { submitContactMessage } from '../lib/submitContact';
import Seo from '../components/Seo';
import type { SiteSettings } from '../types';

export default function Contact() {
    const location = useLocation();
    const state = location.state as { propertyId?: string; propertyTitle?: string } | null;

    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        subject: state?.propertyTitle
            ? `Demande d'information : ${state.propertyTitle}`
            : '',
        message: '',
    });

    useEffect(() => {
        sanityClient
            .fetch<SiteSettings>(siteSettingsQuery)
            .then(setSettings)
            .catch(console.error);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus('idle');

        try {
            await submitContactMessage({
                ...form,
                propertyId: state?.propertyId,
                propertyTitle: state?.propertyTitle,
            });
            setStatus('success');
            setForm({ name: '', phone: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Erreur envoi formulaire:', err);
            setStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappUrl = settings?.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
        : null;

    const inputClass =
        'w-full rounded-xl border border-camvie-gray-100 bg-white px-4 py-3 text-sm text-camvie-gray-800 placeholder-camvie-gray-300 transition-all focus:border-camvie-green focus:outline-none focus:ring-2 focus:ring-camvie-green/10';

    const labelClass =
        'mb-2 block text-xs font-semibold uppercase tracking-wider text-camvie-gray-500';

    return (
        <div className="pt-24 md:pt-28">
            <Seo
                title="Contact"
                description="Contactez CAMVIE SARL pour vos projets d'intermédiation foncière, commerce général et import-export au Cameroun. Réponse sous 24h."
            />

            {/* ---------- HERO ÉDITORIAL ---------- */}
            <section className="relative overflow-hidden bg-camvie-gray-50 py-16 md:py-20">
                <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-camvie-red to-transparent" />

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, #1a7a4a 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                    aria-hidden="true"
                />

                <div className="container relative mx-auto max-w-4xl px-4">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-[2px] w-10 bg-camvie-red" />
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                            Parlons de votre projet
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.1] text-camvie-green md:text-5xl lg:text-6xl">
                        Contactez-nous
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-camvie-gray-800">
                        Une question, un projet foncier, un besoin en commerce ou import-export ?
                        Notre équipe vous répond sous 24h.
                    </p>
                </div>
            </section>

            {/* ---------- CONTENU PRINCIPAL ---------- */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                        {/* ==================== COLONNE GAUCHE : coordonnées ==================== */}
                        <aside className="lg:col-span-2">
                            <div className="space-y-4">
                                {/* Carte coordonnées */}
                                <div className="rounded-2xl border border-camvie-gray-100 bg-white p-6 shadow-sm">
                                    <h2 className="mb-5 flex items-center gap-3 font-heading text-lg font-bold text-camvie-green">
                                        <span className="h-[2px] w-6 bg-camvie-red" />
                                        Nos coordonnées
                                    </h2>

                                    <div className="space-y-4">
                                        {settings?.phone && (
                                            <a
                                                href={`tel:${settings.phone}`}
                                                className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-camvie-green/5"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-camvie-green/10 text-camvie-green transition group-hover:bg-camvie-green group-hover:text-white">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 3.5a2 2 0 01-1 2.17l-1.5.75a11 11 0 005.5 5.5l.75-1.5a2 2 0 012.17-1l3.5.7A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                                        Téléphone
                                                    </p>
                                                    <p className="mt-0.5 font-semibold text-camvie-gray-800 group-hover:text-camvie-green">
                                                        {settings.phone}
                                                    </p>
                                                </div>
                                            </a>
                                        )}

                                        {settings?.email && (
                                            <a
                                                href={`mailto:${settings.email}`}
                                                className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-camvie-green/5"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-camvie-green/10 text-camvie-green transition group-hover:bg-camvie-green group-hover:text-white">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                                        Email
                                                    </p>
                                                    <p className="mt-0.5 break-all font-semibold text-camvie-gray-800 group-hover:text-camvie-green">
                                                        {settings.email}
                                                    </p>
                                                </div>
                                            </a>
                                        )}

                                        {settings?.address && (
                                            <div className="flex items-start gap-3 p-2">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-camvie-red/10 text-camvie-red">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-camvie-gray-500">
                                                        Adresse
                                                    </p>
                                                    <p className="mt-0.5 font-semibold leading-relaxed text-camvie-gray-800">
                                                        {settings.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {whatsappUrl && (
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            Discuter sur WhatsApp
                                        </a>
                                    )}
                                </div>

                                {/* Badge réassurance */}
                                <div className="rounded-2xl border border-camvie-gray-100 bg-gradient-to-br from-camvie-green/5 to-transparent p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-camvie-green text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-camvie-green">
                                                Réponse sous 24h
                                            </p>
                                            <p className="mt-1 text-sm text-camvie-gray-800">
                                                Nous nous engageons à vous répondre dans les
                                                meilleurs délais, du lundi au samedi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ==================== COLONNE DROITE : formulaire ==================== */}
                        <div className="lg:col-span-3">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-2xl border border-camvie-gray-100 bg-white p-6 shadow-sm md:p-8"
                            >
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="h-[2px] w-6 bg-camvie-red" />
                                    <h2 className="font-heading text-lg font-bold text-camvie-green">
                                        Envoyez-nous un message
                                    </h2>
                                </div>

                                {/* Contexte : bien concerné */}
                                {state?.propertyTitle && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border-l-4 border-camvie-green bg-camvie-green/5 p-4">
                                        <svg className="mt-0.5 h-5 w-5 shrink-0 text-camvie-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-camvie-green">
                                                Demande concernant
                                            </p>
                                            <p className="mt-0.5 font-semibold text-camvie-gray-800">
                                                {state.propertyTitle}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Nom + Téléphone */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className={labelClass}>
                                                Nom complet <span className="text-camvie-red">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Jean Dupont"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className={labelClass}>
                                                Téléphone <span className="text-camvie-red">*</span>
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+237 6XX XXX XXX"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className={labelClass}>
                                            Email <span className="text-camvie-red">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="jean.dupont@exemple.com"
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Sujet */}
                                    <div>
                                        <label htmlFor="subject" className={labelClass}>
                                            Sujet
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="Ex : Demande d'information sur un terrain"
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className={labelClass}>
                                            Message <span className="text-camvie-red">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Décrivez votre projet ou votre question..."
                                            className={`${inputClass} resize-y`}
                                        />
                                    </div>

                                    {/* Feedback succès */}
                                    {status === 'success' && (
                                        <div className="flex items-start gap-3 rounded-xl border-l-4 border-green-600 bg-green-50 p-4">
                                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-green-800">
                                                    Message envoyé avec succès !
                                                </p>
                                                <p className="mt-0.5 text-sm text-green-700">
                                                    Nous vous répondrons dans les meilleurs délais.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback erreur */}
                                    {status === 'error' && (
                                        <div className="flex items-start gap-3 rounded-xl border-l-4 border-camvie-red bg-red-50 p-4">
                                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-camvie-red" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-camvie-red">
                                                    Échec de l'envoi
                                                </p>
                                                <p className="mt-0.5 text-sm text-camvie-red/80">
                                                    Veuillez réessayer ou nous contacter par
                                                    téléphone.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bouton submit */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-camvie-green px-6 py-3.5 font-semibold text-white shadow-sm shadow-camvie-green/20 transition hover:bg-camvie-green-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                Envoyer le message
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-camvie-gray-500">
                                        Les champs marqués d'un <span className="text-camvie-red">*</span> sont obligatoires.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- SECTION CARTE ---------- */}
            <section className="bg-camvie-gray-50 py-16 md:py-20">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="mb-10 text-center">
                        <div className="mb-5 inline-flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-camvie-red" />
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-camvie-red">
                                Nous trouver
                            </span>
                            <span className="h-[2px] w-10 bg-camvie-red" />
                        </div>
                        <h2 className="font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                            Rendez-nous visite
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-camvie-gray-800">
                            Nos bureaux sont ouverts du lundi au samedi. N'hésitez pas
                            à passer nous voir.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-camvie-gray-100 shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d509.3337309685502!2d11.521777192238286!3d3.8099623708575936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bd12201d147b7%3A0x6b146c5c5304b761!2sCAMVIE%20SARL!5e1!3m2!1sfr!2scm!4v1792766904563!5m2!1sfr!2scm"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Localisation de CAMVIE SARL"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}