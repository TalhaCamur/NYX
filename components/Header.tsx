import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import CloseIcon from './icons/CloseIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { useAuth } from '../contexts/AuthContext';

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
    const { user, logout } = useAuth();
    const totalQuantity = getCartTotalQuantity();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
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

    const handleLinkClick = (e: React.MouseEvent, href: string, name: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
        
        if (name === 'Ask NYX') {
            onAskNyxOpen();
            return;
        }

        const pageMapping: { [key: string]: string } = {
            '/': 'home',
            '/products': 'products',
            '/how-it-works': 'how-it-works',
            '/setup-videos': 'setup-videos',
            '/faq': 'faq',
            '/contact': 'contact',
            '/our-story': 'our-story',
            '/why-us': 'why-us',
            '/add-product': 'add-product',
            '/admin-dashboard': 'admin-dashboard',
            '/profile': 'profile',
            '/login': 'login',
        };

        const page = pageMapping[href];
        if (page) {
            navigateTo(page);
        } else if (href.startsWith('#')) {
            navigateTo('home');
            setTimeout(() => {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

     const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        navigateTo('home');
    }
    
    const handleLogout = async () => {
        await logout();
        navigateTo('home');
    }

    const renderNavLinks = (isMobile: boolean = false) => {
        const baseLinkClass = isMobile ? "text-3xl font-semibold text-gray-300 hover:text-white transition-colors" : "text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer";

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
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-10">
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
                    className={baseLinkClass}
                >
                    {link.name}
                </a>
            );
        });
    };

    const renderAuthSection = (isMobile: boolean = false) => {
        if (user) {
             const baseLinkClass = "block px-4 py-2 text-sm text-gray-300 hover:bg-dark hover:text-white text-left w-full";
            return (
                <div 
                    className="relative"
                    onMouseEnter={() => setOpenDropdown('user-menu')}
                    onMouseLeave={() => setOpenDropdown(null)}
                >
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
                        <img 
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
                            alt={user.nickname} 
                            className="w-8 h-8 rounded-full object-cover bg-dark-accent"
                        />
                        <span className="font-semibold">{user.nickname}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === 'user-menu' ? 'rotate-180' : ''}`} />
                    </button>
                     {openDropdown === 'user-menu' && (
                        <div className="absolute top-full right-0 pt-2 z-10">
                            <div className="w-48 bg-dark-accent rounded-lg border border-white/10 shadow-lg py-2">
                                <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Account</p>
                                <button onClick={(e) => handleLinkClick(e, '/profile', 'Profile')} className={baseLinkClass}>My Profile</button>
                                {(user.roles.includes('seller') || user.roles.includes('admin')) && (
                                     <button onClick={(e) => handleLinkClick(e, '/add-product', 'Add Product')} className={baseLinkClass}>Add Product</button>
                                )}
                                {user.roles.includes('admin') && (
                                     <button onClick={(e) => handleLinkClick(e, '/admin-dashboard', 'Admin Panel')} className={baseLinkClass}>Admin Panel</button>
                                )}
                                <div className="border-t border-white/10 my-2"></div>
                                <button onClick={handleLogout} className={baseLinkClass}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return (
            <button
                onClick={(e) => handleLinkClick(e, '/login', 'Login')}
                className="bg-brand-purple text-white font-semibold py-2 px-5 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105"
            >
                Login
            </button>
        );
    }
    
    const renderMobileAuthSection = () => {
         const baseLinkClass = "text-3xl font-semibold text-gray-300 hover:text-white transition-colors";
        if (user) {
            return (
                <>
                    <a href="#" onClick={(e) => handleLinkClick(e, '/profile', 'Profile')} className={baseLinkClass}>My Profile</a>
                    {(user.roles.includes('seller') || user.roles.includes('admin')) && (
                         <a href="#" onClick={(e) => handleLinkClick(e, '/add-product', 'Add Product')} className={baseLinkClass}>Add Product</a>
                    )}
                     {user.roles.includes('admin') && (
                         <a href="#" onClick={(e) => handleLinkClick(e, '/admin-dashboard', 'Admin Panel')} className={baseLinkClass}>Admin Panel</a>
                    )}
                    <button onClick={handleLogout} className={`${baseLinkClass} text-red-500`}>Logout</button>
                </>
            )
        }
        return (
             <a href="#" onClick={(e) => handleLinkClick(e, '/login', 'Login')} className={baseLinkClass}>Login</a>
        )
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
                    <nav className="hidden md:flex items-center space-x-8">
                        {renderNavLinks()}
                    </nav>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex">
                             {renderAuthSection()}
                        </div>
                        <button onClick={openCart} className="relative text-gray-300 hover:text-white transition-colors">
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
                        <div className="border-t border-white/10 w-1/2 my-4"></div>
                        {renderMobileAuthSection()}
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
