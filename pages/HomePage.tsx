
import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Countdown from '../components/Countdown';
import EmailCapture from '../components/EmailCapture';
import { Product } from '../types';

interface HomePageProps {
  navigateTo: (page: string, params?: any) => void;
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, products }) => {
    return (
        <>
            <Hero navigateTo={navigateTo} />
            <ProductShowcase navigateTo={navigateTo} products={products} />
            <Features />
            <Testimonials />
            <Countdown targetDate="2025-10-26T00:00:00" />
            <EmailCapture />
        </>
    );
};

export default HomePage;
