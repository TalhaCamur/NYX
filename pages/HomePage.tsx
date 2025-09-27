
import React from 'react';
import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import { Product } from '../types';

interface HomePageProps {
  navigateTo: (page: string, params?: any) => void;
  products: Product[];
}

const HomePage = ({ navigateTo, products }: HomePageProps) => {
    return (
        <>
            <Hero navigateTo={navigateTo} />
            <ProductShowcase navigateTo={navigateTo} products={products} />
            <Features />
        </>
    );
};

export default HomePage;