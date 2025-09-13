import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import TwitterIcon from './icons/TwitterIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark py-12 border-t border-white/10">
            <div className="container mx-auto px-4 text-center text-gray-400">
                <div className="flex justify-center items-center mb-4">
                     <span className="text-2xl font-bold tracking-widest bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                        NYX
                    </span>
                </div>
                <p className="max-w-md mx-auto mb-8 text-sm">
                    Pioneering the future of smart home technology with intuitive design and intelligent automation.
                </p>
                <div className="flex justify-center space-x-6 mb-8">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                </div>
                <p className="text-xs">&copy; {new Date().getFullYear()} NYX Smart Home. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;