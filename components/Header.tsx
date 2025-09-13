import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CloseIcon from './icons/CloseIcon';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { openCart, getCartTotalQuantity } = useCart();
    const totalQuantity = getCartTotalQuantity();

    useEffect(() => {
        const handleScroll = () => {
            // Trigger change when user scrolls past 30% of the viewport height
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

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const targetElement = document.querySelector(href);
        if (targetElement) {
            // A small delay to allow the menu to start closing before scrolling
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

     const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }


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
                        {NAV_LINKS.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                onClick={(e) => handleLinkClick(e, link.href)}
                                className="text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                {link.name}
                            </a>
                        ))}
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
                        {NAV_LINKS.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                onClick={(e) => handleLinkClick(e, link.href)}
                                className="text-3xl font-semibold text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
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