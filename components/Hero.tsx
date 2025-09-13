import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="h-screen min-h-[700px] flex flex-col justify-start items-center text-center relative overflow-hidden bg-dark pt-20">
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-start pt-16 sm:pt-24 md:pt-32">
                <div className="max-w-4xl">
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
            </div>

            <div className="absolute inset-0 w-full h-full flex items-end justify-center z-0">
                <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-dark-accent via-dark-accent/80 to-transparent"></div>
                <img 
                    src="https://i.ibb.co/yYv3x0M/sensor-main.png" 
                    alt="NYX-1 Smart PIR Motion Sensor" 
                    className="w-auto h-auto max-w-[80vw] max-h-[50vh] object-contain mb-[-5%]"
                />
            </div>
        </section>
    );
};

export default Hero;