import React, { useState, useEffect } from 'react';

const Hero = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
    const [isArrowVisible, setIsArrowVisible] = useState(true);

    useEffect(() => {
        const handleVisibility = () => {
            // Hide arrow if scrolled past the "peek" amount
            if (window.scrollY > 80) {
                setIsArrowVisible(false);
            } else {
                setIsArrowVisible(true);
            }
        };
        window.addEventListener('scroll', handleVisibility);
        return () => window.removeEventListener('scroll', handleVisibility);
    }, []);
    
    const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleMouseEnter = () => {
        // Only peek if at the very top of the page
        if (window.scrollY === 0) {
            window.scrollTo({ top: 80, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen min-h-[700px] flex items-center text-center bg-dark">
            <div className="container mx-auto px-4">
                
                {/* Text Content */}
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                        The Future of <br/> Smart Living.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                        Discover the NYX ecosystem of beautifully designed, intelligent devices that work together to simplify your life.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <a href="/products" onClick={(e) => { e.preventDefault(); navigateTo('products'); }} className="bg-white text-dark font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                            Explore Products
                        </a>
                        <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="border border-gray-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-dark transition-colors duration-300 w-full sm:w-auto">
                            Why NYX?
                        </a>
                    </div>
                </div>

            </div>

            {/* Scroll Down Indicator */}
            <a 
                href="#products" 
                aria-label="Scroll to next section" 
                className={`
                    fixed bottom-10 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white transition-all duration-300
                    ${isArrowVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={handleScrollClick}
                onMouseEnter={handleMouseEnter}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </a>
        </section>
    );
};

export default Hero;