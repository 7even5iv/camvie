// src/components/layout/Header.tsx
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLinkClick = () => setOpen(false);

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
                <div className="px-4 md:px-6 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 group rounded-lg
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-camvie-green/60"
                    >
                        <img
                            src={logoCamvie}
                            alt="CAMVIE SARL"
                            className="h-10 md:h-11 w-auto object-contain
                                       transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="hidden sm:block text-xl md:text-2xl font-heading font-bold text-camvie-green">
                            CAMVIE
                            <span className="text-camvie-red"> SARL</span>
                        </span>
                    </Link>

                    {/* Menu desktop */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        {navItems.slice(0, -1).map((item) => (
                            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLink}>
                                {item.label}
                            </NavLink>
                        ))}

                        <NavLink to="/contact" className={contactLink}>
                            Contact
                        </NavLink>
                    </nav>

                    {/* Burger mobile */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 rounded-lg text-camvie-green
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

                {/* Menu mobile — fond blanc plein */}
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