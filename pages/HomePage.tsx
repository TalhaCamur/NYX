
import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import { Product } from '../types';

interface HomePageProps {
  navigateTo: (page: string) => void;
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, products }) => {
    return (
        <>
            <Hero />
            <ProductShowcase navigateTo={navigateTo} products={products} />
            <Features />
        </>
    );
};

export default HomePage;
