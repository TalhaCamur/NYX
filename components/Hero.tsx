import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="h-screen min-h-[800px] flex flex-col items-center text-center bg-dark">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center flex-grow pt-24 pb-12">
                
                {/* Text Content */}
                <div className="w-full max-w-4xl">
                    <span className="text-lg font-semibold text-brand-purple mb-2 block">NYX-1 Smart PIR Motion Sensor</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                        Smarter light. <br/> Simpler life.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                        Experience truly intelligent lighting. The NYX-1 sensor learns your routines to create the perfect ambiance, effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <a href="#product" className="bg-white text-dark font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                            Buy Now
                        </a>
                        <a href="#features" className="border border-gray-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-dark transition-colors duration-300 w-full sm:w-auto">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Product Image */}
                <div className="relative mt-16 md:mt-20 w-full flex items-center justify-center flex-grow">
                    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-dark-accent via-dark-accent/50 to-transparent"></div>
                    <img 
                        src="https://i.ibb.co/bX13vj8/nyx-sensor-hero.png" 
                        alt="NYX-1 Smart PIR Motion Sensor" 
                        className="relative z-10 w-auto h-auto max-w-[70vw] md:max-w-[45vw] lg:max-w-[35vw] max-h-[40vh] object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;