import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';

interface HomePageProps {
  navigateTo: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    return (
        <>
            <Hero />
            <ProductShowcase navigateTo={navigateTo} />
            <Features />
        </>
    );
};

export default HomePage;