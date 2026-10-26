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

    return (
        <div className="pt-24 md:pt-28">
            <div className="container mx-auto max-w-5xl px-4 pb-16">
                <Seo
                    title="Contact"
                    description="Contactez CAMVIE SARL pour vos projets d'intermédiation foncière, commerce général et import-export au Cameroun."
                />

                <div className="mb-12 text-center">
                    <h1 className="mb-4 font-heading text-3xl font-bold text-camvie-green md:text-4xl">
                        Contactez-nous
                    </h1>
                    <p className="mx-auto max-w-2xl text-camvie-gray-800">
                        Une question ? Un projet foncier ? Écrivez-nous.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Colonne gauche : coordonnées */}
                    <div className="lg:col-span-1">
                        <div className="space-y-4 rounded-lg bg-camvie-gray-50 p-6">
                            <h2 className="mb-4 font-heading text-lg font-bold text-camvie-green">
                                Nos coordonnées
                            </h2>

                            {settings?.phone && (
                                <div>
                                    <p className="mb-1 text-xs uppercase text-camvie-gray-800">Téléphone</p>
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="font-semibold text-camvie-green hover:underline"
                                    >
                                        {settings.phone}
                                    </a>
                                </div>
                            )}

                            {settings?.email && (
                                <div>
                                    <p className="mb-1 text-xs uppercase text-camvie-gray-800">Email</p>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="break-all font-semibold text-camvie-green hover:underline"
                                    >
                                        {settings.email}
                                    </a>
                                </div>
                            )}

                            {settings?.address && (
                                <div>
                                    <p className="mb-1 text-xs uppercase text-camvie-gray-800">Adresse</p>
                                    <p className="text-camvie-gray-800">{settings.address}</p>
                                </div>
                            )}

                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 block w-full rounded-lg bg-green-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-green-700"
                                >
                                    💬 WhatsApp
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Colonne droite : formulaire */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
                            {state?.propertyTitle && (
                                <div className="border-l-4 border-camvie-green bg-camvie-gray-100 p-3 text-sm">
                                    <strong>Demande concernant :</strong> {state.propertyTitle}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-camvie-gray-800">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-camvie-gray-100 px-4 py-2 focus:border-camvie-green focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-camvie-gray-800">
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-camvie-gray-100 px-4 py-2 focus:border-camvie-green focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-camvie-gray-800">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-camvie-gray-100 px-4 py-2 focus:border-camvie-green focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-camvie-gray-800">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-camvie-gray-100 px-4 py-2 focus:border-camvie-green focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-camvie-gray-800">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full rounded-lg border border-camvie-gray-100 px-4 py-2 focus:border-camvie-green focus:outline-none"
                                />
                            </div>

                            {status === 'success' && (
                                <div className="border-l-4 border-green-600 bg-green-50 p-3 text-sm text-green-800">
                                    ✅ Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="border-l-4 border-camvie-red bg-red-50 p-3 text-sm text-camvie-red">
                                    ❌ Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-lg bg-camvie-green px-6 py-3 font-semibold text-white transition hover:bg-camvie-green-light disabled:opacity-50"
                            >
                                {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- SECTION CARTE GOOGLE MAPS --- */}
                <div className="mt-16">
                    <div className="mb-8 text-center">
                        <h2 className="font-heading text-2xl font-bold text-camvie-green">
                            Nous trouver
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-camvie-red" />
                    </div>
                    <div className="overflow-hidden rounded-xl border border-camvie-gray-100 shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d509.3337309685502!2d11.521777192238286!3d3.8099623708575936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bd12201d147b7%3A0x6b146c5c5304b761!2sCAMVIE%20SARL!5e1!3m2!1sfr!2scm!4v1792766904563!5m2!1sfr!2scm"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Localisation de CAMVIE SARL"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}