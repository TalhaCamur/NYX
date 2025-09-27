import React from 'react';

const Hero = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
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
        </section>
    );
};

export default Hero;