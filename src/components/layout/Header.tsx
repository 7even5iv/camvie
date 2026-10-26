// src/components/layout/Header.tsx
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoCamvie from '../../assets/logo-camvie.png';

const navItems = [
    { to: '/', label: 'Accueil' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/services', label: 'Services' },
    { to: '/opportunites', label: 'Opportunités' },
    { to: '/galerie', label: 'Galerie' },
    { to: '/contact', label: 'Contact' },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Ferme le menu mobile au changement de page */
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const handleLinkClick = () => setOpen(false);

    /* Logique de retour intelligent */
    const handleBack = () => {
        if (location.key !== 'default') {
            navigate(-1);
            return;
        }
        if (location.pathname.startsWith('/opportunites/')) {
            navigate('/opportunites');
        } else {
            navigate('/');
        }
    };

    const showBackButton = location.pathname !== '/';

    /* Liens desktop : texte vert, soulignement vert animé */
    const desktopLink = ({ isActive }: { isActive: boolean }) =>
        `relative py-1 font-semibold transition-colors duration-200
         after:absolute after:left-0 after:-bottom-0.5
         after:h-[2px] after:bg-camvie-green after:rounded-full
         after:transition-all after:duration-300
         ${isActive
            ? 'text-camvie-green after:w-full'
            : 'text-camvie-green/80 hover:text-camvie-green after:w-0 hover:after:w-full'}`;

    /* CTA Contact : pilule rouge pleine → inverse au survol */
    const contactLink = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-xl font-semibold shadow-sm transition-all duration-300
         ${isActive
            ? 'bg-camvie-red text-white ring-2 ring-camvie-red/30 shadow-md shadow-camvie-red/30'
            : 'bg-camvie-red text-white hover:bg-white hover:text-camvie-red hover:ring-1 hover:ring-camvie-red/40'}`;

    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4">
            <div
                className={`container mx-auto max-w-6xl rounded-2xl bg-white
                            border border-camvie-green/10 transition-shadow duration-300
                            ${scrolled
                        ? 'shadow-lg shadow-camvie-green/10'
                        : 'shadow-md shadow-black/5'}`}
            >
                {/* ← `relative` permet de centrer le logo en absolu sur mobile */}
                <div className="relative px-3 md:px-6 py-3 flex justify-between items-center">
                    {/* ==================== GROUPE GAUCHE ==================== */}
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Bouton retour — visible partout sauf accueil */}
                        {showBackButton && (
                            <button
                                onClick={handleBack}
                                aria-label="Retour à la page précédente"
                                className="group relative z-10 flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg
                                           border border-camvie-green/15 bg-white text-camvie-green
                                           transition-all duration-300
                                           hover:-translate-x-0.5 hover:border-camvie-green hover:bg-camvie-green hover:text-white
                                           focus:outline-none focus-visible:ring-2 focus-visible:ring-camvie-green/60"
                            >
                                <svg
                                    className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:-translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>

                                {/* Tooltip desktop */}
                                <span className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-camvie-gray-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 md:block">
                                    Retour
                                    <span className="absolute left-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-camvie-gray-900" />
                                </span>
                            </button>
                        )}

                        {/* Logo — centré en absolu sur mobile quand le bouton retour est visible */}
                        <Link
                            to="/"
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 group rounded-lg min-w-0
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-camvie-green/60
                                        ${showBackButton
                                    ? 'max-sm:absolute max-sm:left-1/2 max-sm:top-1/2 max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:z-0'
                                    : ''
                                }`}
                        >
                            <img
                                src={logoCamvie}
                                alt="CAMVIE SARL"
                                className="h-10 md:h-11 w-auto object-contain shrink-0
                                           transition-transform duration-200 group-hover:scale-105"
                            />
                            <span className="hidden sm:block text-xl md:text-2xl font-heading font-bold text-camvie-green truncate">
                                CAMVIE
                                <span className="text-red-600"> SARL</span>
                            </span>
                        </Link>
                    </div>

                    {/* ==================== MENU DESKTOP ==================== */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm shrink-0">
                        {navItems.slice(0, -1).map((item) => (
                            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLink}>
                                {item.label}
                            </NavLink>
                        ))}

                        <NavLink to="/contact" className={contactLink}>
                            Contact
                        </NavLink>
                    </nav>

                    {/* ==================== BURGER MOBILE ==================== */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="relative z-10 md:hidden shrink-0 p-2 rounded-lg text-camvie-green
                                   hover:bg-camvie-green/10 transition
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-camvie-green/60"
                        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        {open ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* ==================== MENU MOBILE ==================== */}
                <div
                    id="mobile-menu"
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-out
                                ${open
                            ? 'max-h-96 opacity-100 border-t border-camvie-green/10'
                            : 'max-h-0 opacity-0'}`}
                >
                    <nav>
                        <div className="px-4 py-3 flex flex-col space-y-1">
                            {navItems.map((item) => {
                                const isContact = item.to === '/contact';
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === '/'}
                                        onClick={handleLinkClick}
                                        className={({ isActive }) =>
                                            `py-2.5 px-3 rounded-lg text-sm font-semibold
                                             transition-colors duration-200
                                             ${isContact
                                                ? isActive
                                                    ? 'bg-camvie-red text-white'
                                                    : 'bg-camvie-red text-white hover:bg-camvie-red/90'
                                                : isActive
                                                    ? 'bg-camvie-green/10 text-camvie-green'
                                                    : 'text-camvie-green/80 hover:bg-camvie-green/10 hover:text-camvie-green'
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}