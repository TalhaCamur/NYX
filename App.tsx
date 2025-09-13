import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import CartSidebar from './components/CartSidebar';

const App: React.FC = () => {
    return (
        <CartProvider>
            <div className="bg-dark-accent min-h-screen overflow-x-hidden">
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <HomePage />
                    </main>
                    <Footer />
                </div>
                <CartSidebar />
            </div>
        </CartProvider>
    );
};

export default App;