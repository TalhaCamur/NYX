
import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import TwitterIcon from './icons/TwitterIcon';

const Footer = ({ navigateTo }: { navigateTo: (page: string, params?: any) => void }) => {
    return (
        <footer className="bg-dark py-12 md:py-16 border-t border-white/10">
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
                 <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-8 text-sm">
                    <button onClick={() => navigateTo('legal', { slug: 'privacy-policy', title: 'Privacy Policy' })} className="hover:text-white transition-colors">Privacy Policy</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => navigateTo('legal', { slug: 'terms-conditions', title: 'Terms & Conditions' })} className="hover:text-white transition-colors">Terms & Conditions</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => navigateTo('legal', { slug: 'cookie-policy', title: 'Cookie Policy' })} className="hover:text-white transition-colors">Cookie Policy</button>
                </div>
                <p className="text-xs">Copyright © 2025 NYX Smart Home All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;