
import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CloseIcon from './icons/CloseIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HeaderProps {
    onAskNyxOpen: () => void;
    navigateTo: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAskNyxOpen, navigateTo }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
    const { openCart, getCartTotalQuantity } = useCart();
    const totalQuantity = getCartTotalQuantity();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > window.innerHeight * 0.3);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
             document.body.style.overflow = 'auto';
        }
    }, [isMobileMenuOpen]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        
        if (name === 'Ask NYX') {
            onAskNyxOpen();
            return;
        }

        switch (href) {
            case '/':
                navigateTo('home');
                break;
            case '/products':
                navigateTo('products');
                break;
            case '/how-it-works':
                navigateTo('how-it-works');
                break;
            case '/setup-videos':
                navigateTo('setup-videos');
                break;
            case '/faq':
                navigateTo('faq');
                break;
            case '/contact':
                navigateTo('contact');
                break;
            case '/our-story':
                navigateTo('our-story');
                break;
            case '/why-us':
                navigateTo('why-us');
                break;
            case '#':
                console.log(`Navigate to ${name}`);
                break;
            default:
                if (href.startsWith('#')) {
                    navigateTo('home');
                    setTimeout(() => {
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
                break;
        }
    };

     const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        navigateTo('home');
    }

    const renderNavLinks = (isMobile: boolean = false) => {
        return NAV_LINKS.map((link) => {
            if (link.sublinks) {
                if (isMobile) {
                    return (
                        <div key={link.name}>
                            <button
                                onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.name ? null : link.name)}
                                className="w-full flex justify-center items-center gap-2 text-3xl font-semibold text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                                <ChevronDownIcon className={`w-6 h-6 transition-transform ${openMobileSubmenu === link.name ? 'rotate-180' : ''}`} />
                            </button>
                            {openMobileSubmenu === link.name && (
                                <div className="mt-4 space-y-4">
                                    {link.sublinks.map(sublink => (
                                        <a
                                            key={sublink.name}
                                            href={sublink.href}
                                            onClick={(e) => handleLinkClick(e, sublink.href, sublink.name)}
                                            className="block text-xl text-gray-400 hover:text-white"
                                        >
                                            {sublink.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }
                return (
                    <div
                        key={link.name}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(link.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
                            {link.name}
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === link.name && (
                            <div className="absolute top-full left-0 pt-2 z-10">
                                <div className="w-48 bg-dark-accent rounded-lg border border-white/10 shadow-lg py-2">
                                    {link.sublinks.map(sublink => (
                                        <a
                                            key={sublink.name}
                                            href={sublink.href}
                                            onClick={(e) => handleLinkClick(e, sublink.href, sublink.name)}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark hover:text-white"
                                        >
                                            {sublink.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            if (link.name === 'Ask NYX') {
                return (
                    <button
                        key={link.name}
                        onClick={(e) => handleLinkClick(e as any, link.href!, link.name)}
                        className={
                            isMobile 
                                ? "text-3xl font-semibold animate-gradient-flow text-white py-4 px-8 rounded-full"
                                : "animate-gradient-flow text-white font-semibold py-2 px-5 rounded-full hover:shadow-lg hover:shadow-brand-purple/20 transition-all duration-300 transform hover:scale-105"
                        }
                    >
                        {link.name}
                    </button>
                );
            }

            return (
                <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href!, link.name)}
                    className={isMobile ? "text-3xl font-semibold text-gray-300 hover:text-white transition-colors" : "text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"}
                >
                    {link.name}
                </a>
            );
        });
    };


    return (
        <>
            <header className={`
                fixed top-0 z-50 w-full transition-all duration-300 ease-in-out
                ${isScrolled ? 'py-4 bg-dark/80 backdrop-blur-lg border-b border-white/10' : 'py-6 bg-transparent'}
            `}>
                <div className="container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-16">
                    <a href="#" onClick={handleLogoClick} >
                        <span className="text-xl font-bold tracking-widest bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                            NYX
                        </span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-10">
                        {renderNavLinks()}
                    </nav>
                    <div className="flex items-center gap-4">
                        <button onClick={openCart} className="hidden md:flex relative text-gray-300 hover:text-white transition-colors">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-xs font-bold text-white">
                                    {totalQuantity}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-gray-300"
                            aria-label="Open menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`
                fixed inset-0 z-[101] bg-dark/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full flex flex-col">
                    <div className="flex justify-between items-center py-6">
                        <a href="#" onClick={handleLogoClick}>
                            <span className="text-xl font-bold tracking-widest bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                                NYX
                            </span>
                        </a>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 p-2" aria-label="Close menu">
                            <CloseIcon className="w-8 h-8"/>
                        </button>
                    </div>
                    <nav className="flex flex-col items-center justify-center flex-grow text-center space-y-8">
                        {renderNavLinks(true)}
                         <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); openCart(); setIsMobileMenuOpen(false);}}
                            className="text-3xl font-semibold text-gray-300 hover:text-white transition-colors"
                        >
                            Cart
                            {totalQuantity > 0 && ` (${totalQuantity})`}
                        </a>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Header;