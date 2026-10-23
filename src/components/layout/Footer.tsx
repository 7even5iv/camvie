import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-camvie-gray-900 text-white py-10 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    <div>
                        <h3 className="text-lg font-heading font-bold mb-3">CAMVIE SARL</h3>
                        <p className="text-sm text-camvie-gray-100">
                            Intermédiation foncière et conseils • Commerce général • Import & Export
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase mb-3">Navigation</h3>
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/" className="hover:text-camvie-red transition">Accueil</Link></li>
                            <li><Link to="/opportunites" className="hover:text-camvie-red transition">Opportunités</Link></li>
                            <li><Link to="/contact" className="hover:text-camvie-red transition">Contact</Link></li>
                            <li><Link to="/galerie" className="hover:text-camvie-red transition">Galerie</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase mb-3">Informations légales</h3>
                        <ul className="space-y-1 text-sm">
                            <li><Link to="/mentions-legales" className="hover:text-camvie-red transition">Mentions légales</Link></li>
                            <li><Link to="/politique-de-confidentialite" className="hover:text-camvie-red transition">Politique de confidentialité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-4 text-center">
                    <p className="text-xs text-camvie-gray-100">
                        © {new Date().getFullYear()} CAMVIE SARL — Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}