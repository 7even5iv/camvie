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
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <Seo
                title="Contact"
                description="Contactez CAMVIE SARL pour vos projets d'intermédiation foncière, commerce général et import-export au Cameroun."
            />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-heading font-bold text-camvie-green mb-4">
                    Contactez-nous
                </h1>
                <p className="text-camvie-gray-800 max-w-2xl mx-auto">
                    Une question ? Un projet foncier ? Écrivez-nous.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche : coordonnées */}
                <div className="lg:col-span-1">
                    <div className="bg-camvie-gray-50 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-heading font-bold text-camvie-green mb-4">
                            Nos coordonnées
                        </h2>

                        {settings?.phone && (
                            <div>
                                <p className="text-xs text-camvie-gray-800 uppercase mb-1">Téléphone</p>
                                <a href={`tel:${settings.phone}`} className="text-camvie-green font-semibold hover:underline">
                                    {settings.phone}
                                </a>
                            </div>
                        )}

                        {settings?.email && (
                            <div>
                                <p className="text-xs text-camvie-gray-800 uppercase mb-1">Email</p>
                                <a href={`mailto:${settings.email}`} className="text-camvie-green font-semibold hover:underline break-all">
                                    {settings.email}
                                </a>
                            </div>
                        )}

                        {settings?.address && (
                            <div>
                                <p className="text-xs text-camvie-gray-800 uppercase mb-1">Adresse</p>
                                <p className="text-camvie-gray-800">{settings.address}</p>
                            </div>
                        )}

                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold mt-4"
                            >
                                💬 WhatsApp
                            </a>
                        )}
                    </div>
                </div>

                {/* Colonne droite : formulaire */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        {state?.propertyTitle && (
                            <div className="bg-camvie-gray-100 border-l-4 border-camvie-green p-3 text-sm">
                                <strong>Demande concernant :</strong> {state.propertyTitle}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-camvie-gray-800 mb-1">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-camvie-gray-100 rounded-lg focus:outline-none focus:border-camvie-green"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-camvie-gray-800 mb-1">
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-camvie-gray-100 rounded-lg focus:outline-none focus:border-camvie-green"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-camvie-gray-800 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-camvie-gray-100 rounded-lg focus:outline-none focus:border-camvie-green"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-camvie-gray-800 mb-1">
                                Sujet
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-camvie-gray-100 rounded-lg focus:outline-none focus:border-camvie-green"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-camvie-gray-800 mb-1">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full px-4 py-2 border border-camvie-gray-100 rounded-lg focus:outline-none focus:border-camvie-green"
                            />
                        </div>

                        {status === 'success' && (
                            <div className="bg-green-50 border-l-4 border-green-600 p-3 text-green-800 text-sm">
                                ✅ Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="bg-red-50 border-l-4 border-camvie-red p-3 text-camvie-red text-sm">
                                ❌ Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-camvie-green text-white px-6 py-3 rounded-lg hover:bg-camvie-green-light transition font-semibold disabled:opacity-50"
                        >
                            {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}