
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmailCapture: React.FC = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isPrivilegedUser = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
    if (isPrivilegedUser) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            console.log('Email submitted:', email);
            setSubmitted(true);
        }
    };

    return (
        <section id="email-capture" className="py-20 md:py-32 bg-dark-accent">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                 <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay ahead of the curve.</h2>
                 <p className="text-gray-300 text-lg mb-8">
                    Get updates on new products, exclusive offers, and the latest in smart home innovation from NYX.
                 </p>
                 {submitted ? (
                     <div className="text-brand-purple text-xl font-semibold">Thank you for subscribing!</div>
                 ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-grow bg-dark border border-gray-600 rounded-full py-3 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            required
                        />
                        <button 
                            type="submit" 
                            className="bg-brand-purple text-white font-bold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105"
                        >
                            Subscribe
                        </button>
                    </form>
                 )}
            </div>
        </section>
    );
};

export default EmailCapture;
