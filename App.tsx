
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import CartSidebar from './components/CartSidebar';
import AskNyx from './pages/AskNyxPage';
import { PRODUCTS_DATA, FAQ_DATA, FEATURES_DATA } from './constants';
import { useCart } from './contexts/CartContext';
import { Product, User, UserRole } from './types';
import EmailCapture from './components/EmailCapture';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import CookieConsentBanner from './components/CookieConsentBanner';


// Define shared icons here to avoid creating new files
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PlusMinusIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></line>
    </svg>
);

// Icons for Contact Page
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);


// Define the Products Page components here to avoid creating new files
const ProductCard: React.FC<{ product: Product; navigateTo: (page: string, params?: any) => void }> = ({ product, navigateTo }) => {
    const { user } = useAuth();
    const { addToCart, openCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin'));

    const handleAddToCart = () => {
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        setTimeout(() => openCart(), 300);
    };

    return (
        <div className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group relative">
             {!product.isVisible && isAuthorized && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    Hidden
                </div>
            )}
            <div className="aspect-square overflow-hidden">
                <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm flex-grow mb-4">{product.tagline}</p>
                 <div className="mt-auto pt-4 space-y-2">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-white">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">€{product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`w-full font-semibold py-3 px-5 rounded-full transition-all duration-300 transform group-hover:scale-105 text-sm ${
                            isAdded 
                                ? 'bg-green-500 text-white cursor-default' 
                                : 'bg-brand-purple text-white hover:bg-brand-purple/80'
                        }`}
                    >
                        {isAdded ? 'Added' : 'Add to Cart'}
                    </button>
                     {isAuthorized && (
                        <button
                            onClick={() => navigateTo('edit-product', { id: product.id })}
                            className="w-full text-center font-semibold py-3 px-5 rounded-full transition-all duration-300 text-sm bg-gray-700 text-white hover:bg-gray-600"
                        >
                            Edit Product
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductsPage: React.FC<{ navigateTo: (page: string) => void, products: Product[] }> = ({ navigateTo, products }) => {
    const { user } = useAuth();
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin'));

    const visibleProducts = isAuthorized ? products : products.filter(p => p.isVisible);

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row justify-between md:items-start mb-12 gap-4">
                    <div>
                        <button 
                            onClick={() => navigateTo('home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </button>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Our Entire Collection</h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                            Explore every piece of the NYX ecosystem. Each device is crafted to enhance your daily life with seamless intelligence and elegant design.
                        </p>
                    </div>
                    {isAuthorized && (
                        <button
                            onClick={() => navigateTo('add-product')}
                            className="bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105 flex-shrink-0"
                        >
                            Add New Product
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// Define How It Works Page components here
const StepIcon1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/>
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5"/><path d="M12 15v-2"/>
        <path d="M5 10l7-4 7 4"/><path d="M12 21a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2z"/>
    </svg>
);
const StepIcon2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 12.55a8 8 0 0 1 14.08 0"/><path d="M1.42 9a12 12 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a4 4 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/>
        <path d="M18 8.01a6 6 0 0 0-12 0"/>
    </svg>
);
const StepIcon3: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2.69l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L15.22 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L18.44 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L21.66 2l-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26L20.44 14l-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26L18.44 20l-.34.26a1.5 1.5 0 0 0-1.32 0l-.34-.26L15.22 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26-1.22-1.22-.34.26a1.5 1.5 0 0 0-1.32 0l-.34-.26L8.78 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26L5.56 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26L2.34 20l.34-.26a1.5 1.5 0 0 0 0-2.68l-.34-.26.34-.26a1.5 1.5 0 0 0 0 2.68l-.34-.26.34-.26a1.5 1.5 0 0 0 0 2.68l-.34-.26L3.56 8l.34-.26a1.5 1.5 0 0 0 0-2.68L3.56 5l.34-.26a1.5 1.5 0 0 0 1.32 0l.34.26L6.78 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34.26L9.66 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26Z"/><path d="M12 8v8"/>
        <path d="M8.5 14h7"/><path d="M8.5 10h7"/>
    </svg>
);


const HowItWorksPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const steps = [
        {
            icon: StepIcon1,
            title: '1. Unbox & Power On',
            description: "Your NYX experience begins with our signature premium unboxing. Every detail is crafted to delight, from the minimalist packaging to the satisfying reveal of the device. Simply plug it in, and it's ready to integrate into your home. No complex wiring, just elegance from the very first touch.",
        },
        {
            icon: StepIcon2,
            title: '2. Connect to NYX App',
            description: "Download the intuitive NYX app. It will automatically detect your new device. With a single tap, connect it to your Wi-Fi network and unlock its full potential.",
        },
        {
            icon: StepIcon3,
            title: '3. Automate Your World',
            description: "Create custom scenes and schedules. Group devices, set triggers based on time or sensor data, and control your entire home from anywhere in the world.",
        }
    ];

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                 <div className="mb-12">
                    <button 
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Simplicity in Three Steps</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        Experience the seamless setup and powerful control of the NYX smart home ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-dark-accent p-8 rounded-2xl border border-white/10 flex flex-col items-center">
                            <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-dark border border-white/10">
                                <step.icon className="w-10 h-10 text-brand-purple" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                            <p className="text-gray-400 text-base flex-grow">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SetupVideosPage: React.FC<{ navigateTo: (page: string) => void, products: Product[] }> = ({ navigateTo, products }) => {
    const videos = products.map(product => ({
        title: `${product.name} Setup`,
        description: `A quick guide to unboxing, connecting, and configuring your ${product.name}.`,
        thumbnail: product.images[0]
    }));

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-12">
                    <button 
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Setup & Installation</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        Step-by-step video guides to get your NYX devices up and running in minutes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <div key={index} className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group cursor-pointer" onClick={() => alert('Video player coming soon!')}>
                            <div className="aspect-video overflow-hidden relative">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                    <div className="w-16 h-16 bg-brand-purple/70 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <PlayIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                                <p className="text-gray-400 text-sm">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FAQPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-12">
                    <button 
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        Find answers to common questions about our products, services, and policies.
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto space-y-4">
                    {FAQ_DATA.map((faq, index) => (
                        <div key={index} className="bg-dark-accent rounded-xl border border-white/10 overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center text-left p-6"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-lg font-semibold text-white">{faq.question}</span>
                                <PlusMinusIcon isOpen={openIndex === index} className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-45' : ''}`} />
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                            >
                                <div className="p-6 pt-0 text-gray-300 text-base leading-relaxed">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ContactPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactInfo = [
        { icon: MapPinIcon, label: 'Address', value: '123 Innovation Drive, Tech City, 90210' },
        { icon: MailIcon, label: 'Email', value: 'support@nyxhome.io' },
        { icon: PhoneIcon, label: 'Phone', value: '+1 (800) 555-0199' }
    ];

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-12">
                    <button 
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        We're here to help. Reach out with questions, feedback, or support inquiries.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        {contactInfo.map(info => (
                            <div key={info.label} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-dark-accent border border-white/10 rounded-full flex items-center justify-center">
                                    <info.icon className="w-6 h-6 text-brand-purple" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{info.label}</h3>
                                    <p className="text-gray-400">{info.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                                <p className="text-gray-300">Your message has been sent. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input type="text" id="name" required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <input type="email" id="email" required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                    <input type="text" id="subject" required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                    <textarea id="message" rows={5} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <EmailCapture />
        </div>
    );
};

const OurStoryPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const storyContent = [
        <p key="p1"><strong>Discovery often begins in the most unexpected places.</strong></p>,
        <p key="p2">Since childhood, I've always had a curious spirit - perhaps a bit too curious. While my classmates focused on their studies, I was trying to understand how the world actually worked. Yes, this sometimes meant putting lessons on the back burner, but somehow I always succeeded. It was as if I had an internal system that rejected conventional paths but still delivered results.</p>,
        <p key="p3"><strong>During my high school years, my passion for technology began to crystallize.</strong> I had decided "I'm going to be a software developer," but I was still moving with that curious spirit of mine - spontaneous, not planned. Perhaps that's why I only made a few serious attempts at learning programming during that period.</p>,
        <p key="p4"><strong>Then life carried me to another continent.</strong> When the opportunity to study abroad presented itself, this wasn't just an educational change for me - it was a chance to become an entirely new version of myself. My financial means were limited, which only made me more determined. "This time will be different," I told myself.</p>,
        <p key="p5"><strong>And it truly was different.</strong></p>,
        <p key="p6">While creating this brand, I combined the energy of that curious child from the past with an adult vision. Every product we make is a result of that impatient curiosity and perfectionism. Even when working alone, I knew I was actually working for all of us - to make your home smarter and more comfortable.</p>,
        <p key="p7"><strong>Our goal is simple: To make you happy.</strong> Because this journey made me happy, and I want to share that happiness with you.</p>
    ];

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-12">
                    <button 
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Our Story</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        From a curious mind to your smart home.
                    </p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                        {storyContent}
                    </div>
                </div>
            </div>
        </div>
    );
};


const WhyUsPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const featuresWithDetails = [
        {
            ...FEATURES_DATA[0], // Adaptive AI Learning
            details: "At NYX, this isn't just a buzzword. Our proprietary algorithms analyze environmental data and user interactions to create a home that truly understands you. It's the difference between a device that follows commands and a system that anticipates your needs, optimizing comfort and energy efficiency without you lifting a finger."
        },
        {
            ...FEATURES_DATA[1], // Extended Battery Life
            details: "We believe smart technology should reduce your worries, not add to them. That's why we obsess over power management. By optimizing both hardware and software, we deliver devices that last for years, not months. This means less maintenance, less waste, and more reliable performance when you need it most."
        },
        {
            ...FEATURES_DATA[2], // Minimalist Aesthetics
            details: "Our design philosophy is simple: technology should enhance your space, not clutter it. Every NYX product is meticulously crafted with premium materials and clean lines to blend seamlessly into any environment. We believe that the most powerful technology is the one you barely notice is there."
        },
        {
            ...FEATURES_DATA[3], // Seamless Integration
            details: "Your smart home should be a unified ecosystem, not a collection of separate gadgets. We are committed to open standards and universal compatibility. This ensures that every NYX device not only works perfectly with our own app but also plays nicely with all major platforms, giving you the freedom to build your smart home your way."
        }
    ];

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-16">
                    <button
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Why Choose NYX?</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        We believe in a smarter, simpler, and more beautiful way of living. Our philosophy is built on four core pillars.
                    </p>
                </div>

                <div className="space-y-20 max-w-5xl mx-auto">
                    {featuresWithDetails.map((feature, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="flex justify-center md:col-span-1">
                                <div className="flex items-center justify-center h-32 w-32 rounded-full bg-dark-accent border border-white/10 shadow-lg">
                                    <feature.icon className="w-16 h-16 text-brand-purple" />
                                </div>
                            </div>
                            <div className="md:col-span-2 text-center md:text-left">
                                <h3 className="text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-4">{feature.description}</p>
                                <p className="text-gray-400 text-base leading-relaxed">
                                    {feature.details}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AuthForm: React.FC<{
    isLogin: boolean;
    navigateTo: (page: string) => void;
}> = ({ isLogin, navigateTo }) => {
    const { login, signup } = useAuth();
    // Signup states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    // Login state
    const [identifier, setIdentifier] = useState('');
    // Common states
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(identifier, password);
            } else {
                await signup(firstName, lastName, nickname, email, password);
            }
            navigateTo('home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-md">
                <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                    <h1 className="text-3xl font-bold text-center text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-center text-gray-400 mb-8">{isLogin ? 'Sign in to continue' : 'Join the future of smart living'}</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                                        <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Surname</label>
                                        <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">Nickname</label>
                                    <input type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                            </>
                        )}
                        {isLogin && (
                             <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-2">Nickname or Email</label>
                                <input type="text" id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                        {!isLogin && (
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms-signup"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-dark text-brand-purple focus:ring-brand-purple focus:ring-offset-dark"
                                />
                                <label htmlFor="terms-signup" className="text-sm text-gray-400">
                                    I have read and agree to the{' '}
                                    <button type="button" onClick={() => navigateTo('terms-conditions')} className="font-semibold text-brand-purple hover:underline focus:outline-none">
                                        Terms of Use
                                    </button>.
                                </label>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button type="submit" disabled={isLoading || (!isLogin && !agreedToTerms)} className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-400 text-sm mt-6">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => navigateTo(isLogin ? 'signup' : 'login')} className="font-semibold text-brand-purple hover:underline">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

const AddProductPage: React.FC<{ navigateTo: (page: string) => void, addProduct: (product: Product) => void }> = ({ navigateTo, addProduct }) => {
    const [product, setProduct] = useState<Omit<Product, 'specs' | 'id' | 'isVisible'>>({
        name: '',
        tagline: '',
        price: 0,
        stock: 0,
        images: [],
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setProduct(prev => ({ ...prev, images: [result] }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product.images.length === 0) {
            alert('Please upload an image for the product.');
            return;
        }
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            isVisible: true,
            ...product,
            images: product.images,
            specs: [ // Add dummy specs for now
                { name: 'Connectivity', value: 'Wi-Fi 2.4GHz' },
                { name: 'Color', value: 'Matte Onyx Black' },
            ]
        };
        addProduct(newProduct);
        alert('Product added successfully!');
        navigateTo('products');
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-8">Add New Product</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-dark-accent p-8 rounded-2xl border border-white/10">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                            <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                        <div>
                            <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                            <input type="text" name="tagline" id="tagline" value={product.tagline} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                <input type="number" name="price" id="price" value={product.price > 0 ? product.price : ''} onChange={handleChange} required min="0" step="0.01" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                                <input type="number" name="stock" id="stock" value={product.stock > 0 ? product.stock : ''} onChange={handleChange} required min="0" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
                            <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-brand-purple/80 cursor-pointer" />
                        </div>
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-300 mb-2">Image Preview:</p>
                                <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-600" />
                            </div>
                        )}
                        <div>
                            <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105">
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const EditProductPage: React.FC<{
    navigateTo: (page: string, params?: any) => void,
    products: Product[],
    updateProduct: (product: Product) => void,
    deleteProduct: (productId: string) => void,
    productId: string
}> = ({ navigateTo, products, updateProduct, deleteProduct, productId }) => {
    const productToEdit = products.find(p => p.id === productId);
    const [product, setProduct] = useState<Product | null>(productToEdit || null);
    const [imagePreview, setImagePreview] = useState<string | null>(productToEdit?.images[0] || null);
    const [isDiscounted, setIsDiscounted] = useState<boolean>(!!productToEdit?.originalPrice);

    useEffect(() => {
        const productToEdit = products.find(p => p.id === productId);
        if (!productToEdit) {
            alert("Product not found.");
            navigateTo('products');
        } else {
            setProduct(productToEdit);
            setIsDiscounted(!!productToEdit.originalPrice);
            setImagePreview(productToEdit.images[0] || null);
        }
    }, [productId, products, navigateTo]);

    if (!product) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? (parseFloat(value) || 0) : value;
        setProduct(prev => prev ? { ...prev, [name]: parsedValue } : null);
    };

    const handleDiscountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isEnabled = e.target.checked;
        setIsDiscounted(isEnabled);

        setProduct(prev => {
            if (!prev) return null;
            if (isEnabled) {
                // When enabling discount, set originalPrice to current price if it's not already set
                return { ...prev, originalPrice: prev.originalPrice || prev.price };
            } else {
                // When disabling discount, restore original price and clear originalPrice field
                return { ...prev, price: prev.originalPrice || prev.price, originalPrice: undefined };
            }
        });
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setProduct(prev => prev ? { ...prev, isVisible: checked } : null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setProduct(prev => prev ? { ...prev, images: [result] } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            if (isDiscounted && product.originalPrice && product.price >= product.originalPrice) {
                alert('Discounted price must be lower than the original price.');
                return;
            }
            updateProduct(product);
            alert('Product updated successfully!');
            navigateTo('products');
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            deleteProduct(product.id);
            alert('Product deleted successfully.');
            navigateTo('products');
        }
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => navigateTo('products')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Products
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-8">Edit Product</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-dark-accent p-8 rounded-2xl border border-white/10">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                            <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                        <div>
                            <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                            <input type="text" name="tagline" id="tagline" value={product.tagline} onChange={handleChange} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>

                        <div className="flex items-center justify-between bg-dark p-4 rounded-lg border border-gray-700">
                            <div>
                                <label htmlFor="isDiscounted" className="text-sm font-medium text-gray-300">Apply Discount</label>
                                <p className="text-xs text-gray-500">Show a discounted price next to the original price.</p>
                            </div>
                            <label htmlFor="isDiscounted" className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" checked={isDiscounted} onChange={handleDiscountToggle} id="isDiscounted" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-purple peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                            </label>
                        </div>

                        {isDiscounted ? (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-300 mb-2">Original Price</label>
                                    <input type="number" name="originalPrice" id="originalPrice" value={product.originalPrice || ''} onChange={handleChange} required min="0" step="0.01" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Discounted Price</label>
                                    <input type="number" name="price" id="price" value={product.price > 0 ? product.price : ''} onChange={handleChange} required min="0" step="0.01" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                <input type="number" name="price" id="price" value={product.price > 0 ? product.price : ''} onChange={handleChange} required min="0" step="0.01" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        )}

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                            <input type="number" name="stock" id="stock" value={product.stock > 0 ? product.stock : ''} onChange={handleChange} required min="0" className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
                            <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} className="w-full bg-dark border border-gray-600 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-brand-purple/80 cursor-pointer" />
                        </div>
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-300 mb-2">Image Preview:</p>
                                <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-600" />
                            </div>
                        )}
                        <div className="flex items-center justify-between bg-dark p-4 rounded-lg border border-gray-700">
                            <div>
                                <label htmlFor="isVisible" className="text-sm font-medium text-gray-300">Product Visibility</label>
                                <p className="text-xs text-gray-500">When hidden, product will not be visible to customers.</p>
                            </div>
                            <label htmlFor="isVisible" className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" checked={product.isVisible} onChange={handleVisibilityChange} id="isVisible" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-purple peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-grow bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105">
                                Save Changes
                            </button>
                             <button type="button" onClick={handleDelete} className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-500 transition-colors duration-300">
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { allUsers, setAllUsers, user: currentUser } = useAuth();
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const editingUserRef = useRef<HTMLDivElement>(null);

    const availableRoles: UserRole[] = ['user', 'seller', 'admin', 'Web Developer', 'UI/UX Designer', 'Content Writer'];

    const handleDeleteUser = (userId: string) => {
        const userToDelete = allUsers.find(u => u.id === userId);
        if (userToDelete?.roles.includes('super-admin')) {
            alert("The Super Admin account cannot be deleted.");
            return;
        }
        if (userId === currentUser?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            setAllUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const handleRoleChange = (userId: string, role: UserRole, isChecked: boolean) => {
        const userToChange = allUsers.find(u => u.id === userId);
        if (userToChange?.roles.includes('super-admin')) {
            alert("The Super Admin's roles cannot be changed.");
            return;
        }

        setAllUsers(prevUsers =>
            prevUsers.map(u => {
                if (u.id === userId) {
                    if (!isChecked && u.roles.length === 1 && u.roles.includes(role)) {
                         alert("A user must have at least one role.");
                         return u;
                    }
                    const newRoles = isChecked
                        ? Array.from(new Set([...u.roles, role]))
                        : u.roles.filter(r => r !== role);
                    return { ...u, roles: newRoles };
                }
                return u;
            })
        );
    };

    const formatRoleName = (role: string) => {
        return role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editingUserRef.current && !editingUserRef.current.contains(event.target as Node)) {
                setEditingUserId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </button>
                <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
                <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-800 hover:bg-dark">
                                        <td className="p-4 text-white font-medium flex items-center gap-3">
                                            <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1D1D1D&color=fff`} alt={user.nickname} className="w-10 h-10 rounded-full object-cover"/>
                                            {`${user.firstName} ${user.lastName}`}
                                        </td>
                                        <td className="p-4 text-gray-300">{user.email}</td>
                                        <td className="p-4 text-gray-300">
                                            {user.roles.includes('super-admin') ? (
                                                <span className="bg-brand-pink text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                                    Super Admin
                                                </span>
                                            ) : (
                                                <div className="relative" ref={editingUserId === user.id ? editingUserRef : null}>
                                                    <button
                                                        onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                                                        disabled={user.id === currentUser?.id}
                                                        className="w-full text-left bg-dark border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                                                    >
                                                        <span className="flex flex-wrap gap-1">
                                                            {user.roles.length > 0 ? (
                                                                user.roles.map(role => (
                                                                    <span key={role} className="bg-gray-700 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                                        {formatRoleName(role)}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-500">No Roles</span>
                                                            )}
                                                        </span>
                                                    </button>

                                                    {editingUserId === user.id && (
                                                        <div className="absolute z-10 mt-1 w-64 bg-dark-accent rounded-lg border border-white/10 shadow-lg p-4 right-0">
                                                            <p className="text-sm font-semibold text-white mb-2">Assign Roles</p>
                                                            <div className="space-y-2">
                                                                {availableRoles.map(role => (
                                                                    <label key={role} htmlFor={`${user.id}-${role}`} className="flex items-center gap-3 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`${user.id}-${role}`}
                                                                            checked={user.roles.includes(role)}
                                                                            onChange={(e) => handleRoleChange(user.id, role, e.target.checked)}
                                                                            className="w-4 h-4 text-brand-purple bg-gray-700 border-gray-600 rounded focus:ring-brand-purple focus:ring-2"
                                                                        />
                                                                        <span className="text-gray-300">{formatRoleName(role)}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={user.roles.includes('super-admin') || user.id === currentUser?.id}
                                                aria-label={`Delete user ${user.firstName} ${user.lastName}`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImageCropModal: React.FC<{
    imageSrc: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
}> = ({ imageSrc, isOpen, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef(new Image());
    const [scale, setScale] = useState(1);
    const [minScale, setMinScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const CROP_DIAMETER = 280;
    const CANVAS_DIM = 350;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const image = imageRef.current;

        ctx.clearRect(0, 0, CANVAS_DIM, CANVAS_DIM);

        // Draw the image
        if (image.src) {
            ctx.drawImage(
                image,
                position.x,
                position.y,
                image.width * scale,
                image.height * scale
            );
        }

        // Draw the overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.rect(0, 0, CANVAS_DIM, CANVAS_DIM);
        ctx.arc(CANVAS_DIM / 2, CANVAS_DIM / 2, CROP_DIAMETER / 2, 0, Math.PI * 2, true);
        ctx.fill();

        // Draw the crop circle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(CANVAS_DIM / 2, CANVAS_DIM / 2, CROP_DIAMETER / 2, 0, Math.PI * 2);
        ctx.stroke();

    }, [position, scale]);

    useEffect(() => {
        if (imageSrc) {
            const image = imageRef.current;
            image.onload = () => {
                const hRatio = CANVAS_DIM / image.width;
                const vRatio = CANVAS_DIM / image.height;
                const initialScale = Math.max(hRatio, vRatio);

                const minFitScale = Math.max(CROP_DIAMETER / image.width, CROP_DIAMETER / image.height);
                setMinScale(minFitScale);
                setScale(minFitScale);

                const initialX = (CANVAS_DIM - image.width * minFitScale) / 2;
                const initialY = (CANVAS_DIM - image.height * minFitScale) / 2;
                setPosition({ x: initialX, y: initialY });
            };
            image.src = imageSrc;
        }
    }, [imageSrc]);

    useEffect(() => {
        draw();
    }, [draw]);
    
    const getClampedPosition = (x: number, y: number, currentScale: number) => {
        const image = imageRef.current;
        const cropRadius = CROP_DIAMETER / 2;
        const centerX = CANVAS_DIM / 2;
        const centerY = CANVAS_DIM / 2;

        const scaledWidth = image.width * currentScale;
        const scaledHeight = image.height * currentScale;

        const minX = centerX - scaledWidth + cropRadius;
        const maxX = centerX - cropRadius;
        const minY = centerY - scaledHeight + cropRadius;
        const maxY = centerY - cropRadius;

        return {
            x: Math.max(minX, Math.min(x, maxX)),
            y: Math.max(minY, Math.min(y, maxY)),
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition(getClampedPosition(newX, newY, scale));
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    
    const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newScale = parseFloat(e.target.value);
        setScale(newScale);
        setPosition(pos => getClampedPosition(pos.x, pos.y, newScale));
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image.src) return;

        const cropCanvas = document.createElement('canvas');
        const outputSize = 256; // High-resolution output
        cropCanvas.width = outputSize;
        cropCanvas.height = outputSize;
        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) return;

        const sourceSize = CROP_DIAMETER / scale;
        const sourceX = (CANVAS_DIM / 2 - position.x) / scale - (sourceSize / 2);
        const sourceY = (CANVAS_DIM / 2 - position.y) / scale - (sourceSize / 2);

        // Create a circular clipping path. This ensures the output is circular like the preview.
        cropCtx.beginPath();
        cropCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2, true);
        cropCtx.clip();

        // Draw the cropped portion of the image onto the new canvas.
        cropCtx.drawImage(
            image,
            sourceX, sourceY, sourceSize, sourceSize,
            0, 0, outputSize, outputSize
        );

        // Return as PNG to support transparency from the circular clip.
        onSave(cropCanvas.toDataURL('image/png'));
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
            <div className="bg-dark-accent rounded-2xl border border-white/10 shadow-2xl shadow-brand-purple/20 flex flex-col p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Edit Profile Picture</h3>
                <canvas
                    ref={canvasRef}
                    width={CANVAS_DIM}
                    height={CANVAS_DIM}
                    className="rounded-lg cursor-grab active:cursor-grabbing mx-auto"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
                <div className="my-4">
                    <label htmlFor="zoom" className="block text-sm font-medium text-gray-300 mb-2">Zoom</label>
                    <input
                        type="range"
                        id="zoom"
                        min={minScale}
                        max={minScale * 3}
                        step="0.01"
                        value={scale}
                        onChange={handleZoom}
                        className="w-full h-2 bg-dark rounded-lg appearance-none cursor-pointer accent-brand-purple"
                    />
                </div>
                <div className="flex gap-4">
                    <button onClick={onClose} className="w-full bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-colors duration-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="w-full bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-colors duration-300">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfilePage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { user, updateUser, changePassword } = useAuth();
    
    // State for profile form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setNickname(user.nickname);
            setProfilePicture(user.profilePicture);
        } else {
            // If user is somehow null, redirect to login
            navigateTo('login');
        }
    }, [user, navigateTo]);
    
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
             e.target.value = ''; // Reset file input
        }
    };
    
    const handleSaveCroppedImage = async (croppedImageDataUrl: string) => {
        if (!user) return;
        setProfilePicture(croppedImageDataUrl);
        setIsCropModalOpen(false);
        setImageToCrop(null);

        try {
            await updateUser(user.id, { profilePicture: croppedImageDataUrl });
            setProfileMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (err: any) {
            setProfileMessage({ type: 'error', text: err.message });
            setProfilePicture(user.profilePicture); // Revert on error
        } finally {
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsSavingProfile(true);
        setProfileMessage({ type: '', text: '' });

        try {
            await updateUser(user.id, { firstName, lastName, nickname });
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setProfileMessage({ type: 'error', text: err.message });
        } finally {
            setIsSavingProfile(false);
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }

        setIsChangingPassword(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await changePassword(user.id, currentPassword, newPassword);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            // Clear password fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordMessage({ type: 'error', text: err.message });
        } finally {
            setIsChangingPassword(false);
            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
        }
    };
    
    if (!user) return null; // Or a loading spinner

    return (
        <div className="bg-dark pt-24 animate-fade-in min-h-screen">
             <ImageCropModal 
                isOpen={isCropModalOpen}
                imageSrc={imageToCrop}
                onClose={() => {
                    setIsCropModalOpen(false);
                    setImageToCrop(null);
                }}
                onSave={handleSaveCroppedImage}
            />
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
                    
                    {/* Profile Picture Section */}
                    <div className="flex justify-center mb-10">
                        <div className="relative group">
                            <img 
                                src={profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1D1D1D&color=fff`} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-dark-accent shadow-lg" 
                            />
                            <label htmlFor="profilePictureInput" className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span>Change</span>
                            </label>
                            <input 
                                type="file" 
                                id="profilePictureInput" 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                    </div>

                    {/* Profile Details Form */}
                    <div className="bg-dark-accent p-8 rounded-2xl border border-white/10 mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="prof-firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                                    <input type="text" id="prof-firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="prof-lastName" className="block text-sm font-medium text-gray-300 mb-2">Surname</label>
                                    <input type="text" id="prof-lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="prof-nickname" className="block text-sm font-medium text-gray-300 mb-2">Nickname</label>
                                <input type="text" id="prof-nickname" value={nickname} onChange={e => setNickname(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div>
                                <label htmlFor="prof-email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input type="email" id="prof-email" value={user.email} disabled className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-gray-400 cursor-not-allowed" />
                            </div>
                            
                            {profileMessage.text && (
                                <p className={`text-sm text-center ${profileMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {profileMessage.text}
                                </p>
                            )}

                            <div className="flex justify-end">
                                <button type="submit" disabled={isSavingProfile} className="bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-dark-accent p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>
                         <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-dark border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                                </div>
                            </div>

                             {passwordMessage.text && (
                                <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordMessage.text}
                                </p>
                            )}

                             <div className="flex justify-end">
                                <button type="submit" disabled={isChangingPassword} className="bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                                    {isChangingPassword ? 'Updating...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [page, setPage] = useState<{name: string, params: any}>({ name: 'home', params: {} });
    const [isAskNyxOpen, setIsAskNyxOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('nyx-cookie-consent');
        if (!consent) {
            setShowCookieBanner(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('nyx-cookie-consent', 'accepted');
        setShowCookieBanner(false);
    };

    const handleDeclineCookies = () => {
        localStorage.setItem('nyx-cookie-consent', 'declined');
        setShowCookieBanner(false);
    };

    const navigateTo = (pageName: string, params: any = {}) => {
        setPage({ name: pageName, params });
        window.scrollTo(0, 0);
    };
    
    const addProduct = (product: Product) => {
        setProducts(prev => [product, ...prev]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };


    const renderPage = () => {
        switch (page.name) {
            case 'home':
                return <HomePage navigateTo={navigateTo} products={products} />;
            case 'products':
                return <ProductsPage navigateTo={navigateTo} products={products} />;
            case 'how-it-works':
                return <HowItWorksPage navigateTo={navigateTo} />;
            case 'setup-videos':
                return <SetupVideosPage navigateTo={navigateTo} products={products}/>;
            case 'faq':
                return <FAQPage navigateTo={navigateTo} />;
            case 'contact':
                return <ContactPage navigateTo={navigateTo} />;
            case 'our-story':
                return <OurStoryPage navigateTo={navigateTo} />;
            case 'why-us':
                return <WhyUsPage navigateTo={navigateTo} />;
            case 'terms-conditions':
                return <TermsAndConditionsPage navigateTo={navigateTo} />;
            case 'login':
                return <AuthForm isLogin={true} navigateTo={navigateTo} />;
            case 'signup':
                return <AuthForm isLogin={false} navigateTo={navigateTo} />;
            case 'add-product':
                 return <AddProductPage navigateTo={navigateTo} addProduct={addProduct} />;
            case 'edit-product':
                 return <EditProductPage navigateTo={navigateTo} products={products} updateProduct={updateProduct} deleteProduct={deleteProduct} productId={page.params.id} />;
            case 'admin-dashboard':
                return <AdminDashboard navigateTo={navigateTo} />;
            case 'profile':
                return <ProfilePage navigateTo={navigateTo} />;
            default:
                return <HomePage navigateTo={navigateTo} products={products}/>;
        }
    };

    return (
        <AuthProvider>
            <CartProvider>
                <div className="bg-dark text-gray-200 font-sans">
                    <Header onAskNyxOpen={() => setIsAskNyxOpen(true)} navigateTo={navigateTo} />
                    <main>
                        {renderPage()}
                    </main>
                    <Footer navigateTo={navigateTo} />
                    <CartSidebar navigateTo={navigateTo} />
                    <AskNyx isOpen={isAskNyxOpen} onClose={() => setIsAskNyxOpen(false)} />
                    {showCookieBanner && (
                        <CookieConsentBanner
                            onAccept={handleAcceptCookies}
                            onDecline={handleDeclineCookies}
                        />
                    )}
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
