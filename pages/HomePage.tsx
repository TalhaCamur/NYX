import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import EmailCapture from '../components/EmailCapture';
import AskNyxPage from './AskNyxPage';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <ProductShowcase />
            <Features />
            <Testimonials />
            <div id="ask">
                <AskNyxPage />
            </div>
            <div id="email-capture">
                <EmailCapture />
            </div>
        </>
    );
};

export default HomePage;