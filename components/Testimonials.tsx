import React from 'react';
import { TESTIMONIALS_DATA } from '../constants';

const Testimonials = () => {
    return (
        <section id="reviews" className="py-20 md:py-32 bg-dark">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Acclaimed by the experts.</h2>
                    <p className="text-gray-300 text-lg md:text-xl">
                        Leading tech critics agree: the NYX-1 is a revolution in smart home technology. See what they have to say.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS_DATA.map((testimonial, index) => (
                        <figure key={index} className="bg-dark-accent p-8 rounded-2xl flex flex-col border border-white/10 transform transition-all duration-300 hover:-translate-y-2 hover:border-brand-purple/50 hover:shadow-2xl hover:shadow-brand-purple/25">
                            <blockquote className="text-lg text-gray-300 flex-grow mb-6">
                                <p>"{testimonial.quote}"</p>
                            </blockquote>
                            <figcaption className="mt-auto border-t border-white/10 pt-6">
                                <p className="font-semibold text-white">{testimonial.author}</p>
                                <p className="text-brand-purple/80">{testimonial.publication}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;