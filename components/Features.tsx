import React from 'react';
import { FEATURES_DATA } from '../constants';

const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 md:py-32 bg-dark-accent">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Engineered for your life.</h2>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Every detail of the NYX-1 is designed to seamlessly integrate into your home and elevate your daily routines.
                    </p>
                </div>
                <div className="space-y-20 md:space-y-24 max-w-5xl mx-auto">
                    {FEATURES_DATA.map((feature, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-2/5 flex justify-center">
                                <div className="bg-gradient-to-br from-dark-accent to-dark p-6 rounded-2xl border border-white/10 w-48 h-48 flex items-center justify-center">
                                    <feature.icon className="w-24 h-24 text-brand-purple" />
                                </div>
                            </div>
                            <div className="md:w-3/5 text-center md:text-left">
                                <h3 className="text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-400 text-lg">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;