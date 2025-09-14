

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import CartSidebar from './components/CartSidebar';
import AskNyx from './pages/AskNyxPage';
import { PRODUCTS_DATA, FAQ_DATA, FEATURES_DATA } from './constants';
import { useCart } from './contexts/CartContext';
import { Product } from './types';
import EmailCapture from './components/EmailCapture';


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
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart, openCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        setTimeout(() => openCart(), 300);
    };

    return (
        <div className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group">
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
                <div className="flex justify-between items-center mt-auto">
                    <div>
                        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`font-semibold py-2 px-5 rounded-full transition-all duration-300 transform group-hover:scale-105 text-sm ${
                            isAdded 
                                ? 'bg-green-500 text-white cursor-default' 
                                : 'bg-brand-purple text-white hover:bg-brand-purple/80'
                        }`}
                    >
                        {isAdded ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductsPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
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
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">Our Entire Collection</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
                        Explore every piece of the NYX ecosystem. Each device is crafted to enhance your daily life with seamless intelligence and elegant design.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {PRODUCTS_DATA.map((product) => (
                        <ProductCard key={product.name} product={product} />
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
        <path d="M12 2.69l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L15.22 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L18.44 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L21.66 2l-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26L20.44 14l-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26-.34.26a1.5 1.5 0 0 0 0 2.68l.34.26L18.44 20l-.34.26a1.5 1.5 0 0 0-1.32 0l-.34-.26L15.22 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26-1.22-1.22-.34.26a1.5 1.5 0 0 0-1.32 0l-.34-.26L8.78 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26L5.56 22l-.34-.26a1.5 1.5 0 0 0-1.32 0l-.34.26L2.34 20l.34-.26a1.5 1.5 0 0 0 0-2.68l-.34-.26.34-.26a1.5 1.5 0 0 0 0-2.68l-.34-.26.34-.26a1.5 1.5 0 0 0 0-2.68l-.34-.26L3.56 8l.34-.26a1.5 1.5 0 0 0 0-2.68L3.56 5l.34-.26a1.5 1.5 0 0 0 1.32 0l.34.26L6.78 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26L9.66 2l.34.26a1.5 1.5 0 0 0 1.32 0l.34-.26Z"/><path d="M12 8v8"/>
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

const SetupVideosPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const videos = PRODUCTS_DATA.map(product => ({
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


const App: React.FC = () => {
    const [isAskNyxOpen, setIsAskNyxOpen] = useState(false);
    const [page, setPage] = useState('home');

    const navigateTo = (pageName: string) => {
        setPage(pageName);
        window.scrollTo(0, 0);
    };

    return (
        <CartProvider>
            <div className="bg-dark-accent min-h-screen overflow-x-hidden">
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header onAskNyxOpen={() => setIsAskNyxOpen(true)} navigateTo={navigateTo} />
                    <main className="flex-grow">
                        {page === 'home' && <HomePage navigateTo={navigateTo} />}
                        {page === 'products' && <ProductsPage navigateTo={navigateTo} />}
                        {page === 'how-it-works' && <HowItWorksPage navigateTo={navigateTo} />}
                        {page === 'setup-videos' && <SetupVideosPage navigateTo={navigateTo} />}
                        {page === 'faq' && <FAQPage navigateTo={navigateTo} />}
                        {page === 'contact' && <ContactPage navigateTo={navigateTo} />}
                        {page === 'our-story' && <OurStoryPage navigateTo={navigateTo} />}
                        {page === 'why-us' && <WhyUsPage navigateTo={navigateTo} />}
                    </main>
                    <Footer />
                </div>
                <CartSidebar />
                <AskNyx isOpen={isAskNyxOpen} onClose={() => setIsAskNyxOpen(false)} />
            </div>
        </CartProvider>
    );
};

export default App;
