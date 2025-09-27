import React from 'react';
import { FEATURES_DATA } from '../constants';

const Features = () => {
    return (
        <section id="about" className="py-20 md:py-32 bg-dark-accent">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Why NYX?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
                    {FEATURES_DATA.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-dark border border-white/10">
                                <feature.icon className="w-10 h-10 text-brand-purple" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-base">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;