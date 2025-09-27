

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import CartSidebar from './components/CartSidebar';
import AskNyx from './pages/AskNyxPage';
import { FAQ_DATA, FEATURES_DATA } from './constants';
import { useCart } from './contexts/CartContext';
import { Product, User, UserRole, BlogPost } from './types';
import { AuthProvider, useAuth, supabase } from './contexts/AuthContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import { ProductCard } from './components/ProductShowcase';


// Define shared icons here to avoid creating new files
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PlusMinusIcon = ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></line>
    </svg>
);

// Icons for Contact Page
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

// Google Icon for AuthForm
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.573 5.013C9.657 39.646 16.318 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.332 36.636 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const AuthForm = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login, signup, signInWithProvider, sendPasswordResetEmail } = useAuth();
    
    // Forgot Password State
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');


    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        if (isLogin) {
            try {
                await login(email, password);
                navigateTo('home');
            } catch (err: any) {
                setError(err.message);
            }
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }
            try {
                await signup(firstName, lastName, nickname, email, password, newsletterSubscribed);
                setMessage("Success! Please check your email to confirm your account.");
                // Reset form fields after successful signup
                setFirstName(''); setLastName(''); setNickname(''); setEmail(''); setPassword(''); setConfirmPassword(''); setNewsletterSubscribed(false);
            } catch (err: any) {
                setError(err.message);
            }
        }
        setLoading(false);
    };
    
    const handleProviderSignIn = async (provider: 'google') => {
        try {
            await signInWithProvider(provider);
            // On success, the onAuthStateChange listener will handle navigation
        } catch (err: any) {
            setError(err.message);
        }
    }
    
    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await sendPasswordResetEmail(forgotPasswordEmail);
            setMessage(`If an account with ${forgotPasswordEmail} exists, a password reset link has been sent.`);
            setForgotPasswordEmail('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const renderInput = (id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required: boolean = true) => (
        <div className="relative">
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue transition-all"
                required={required}
            />
        </div>
    );
    
    if (isForgotPassword) {
        return (
             <div className="w-full max-w-md p-8 md:p-10 bg-nyx-black rounded-2xl border border-nyx-gray/50 shadow-2xl shadow-nyx-blue/10">
                <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                    <p className="text-gray-400 mt-2">Enter your email to receive a reset link.</p>
                </div>

                {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
                {message && <p className="bg-green-500/10 text-green-400 border border-green-500/30 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    {renderInput('forgot-email', 'email', forgotPasswordEmail, (e) => setForgotPasswordEmail(e.target.value), 'Email Address')}
                    <button type="submit" disabled={loading} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <button onClick={() => setIsForgotPassword(false)} className="text-sm text-nyx-blue hover:underline">
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md p-8 md:p-10 bg-nyx-black rounded-2xl border border-nyx-gray/50 shadow-2xl shadow-nyx-blue/10 relative">
            <button onClick={() => navigateTo('home')} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                <p className="text-gray-400 mt-2">{isLogin ? 'Log in to continue to NYX.' : 'Join the future of smart living.'}</p>
            </div>

            {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
            {message && <p className="bg-green-500/10 text-green-400 border border-green-500/30 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}

            <form onSubmit={handleAuthAction} className="space-y-4">
                {!isLogin && (
                    <>
                        <div className="flex gap-4">
                            {renderInput('firstName', 'text', firstName, (e) => setFirstName(e.target.value), 'First Name')}
                            {renderInput('lastName', 'text', lastName, (e) => setLastName(e.target.value), 'Last Name')}
                        </div>
                        {renderInput('nickname', 'text', nickname, (e) => setNickname(e.target.value), 'Nickname')}
                    </>
                )}
                {renderInput('email', 'text', email, (e) => setEmail(e.target.value), isLogin ? 'Email or Nickname' : 'Email Address')}
                {renderInput('password', 'password', password, (e) => setPassword(e.target.value), 'Password')}
                {!isLogin && renderInput('confirmPassword', 'password', confirmPassword, (e) => setConfirmPassword(e.target.value), 'Confirm Password')}
                
                {!isLogin && (
                    <div className="flex items-start gap-3">
                        <input
                            id="newsletter"
                            type="checkbox"
                            checked={newsletterSubscribed}
                            onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:ring-nyx-blue focus:ring-offset-nyx-black"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-400">
                            I want to receive news, product updates, and promotional offers from NYX.
                        </label>
                    </div>
                )}
                 {isLogin && (
                    <div className="text-right">
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-nyx-blue hover:underline">
                            Forgot Password?
                        </button>
                    </div>
                )}
                
                <button type="submit" disabled={loading} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait">
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </form>

            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <button onClick={() => handleProviderSignIn('google')} className="w-full flex justify-center items-center gap-3 bg-dark-accent border border-gray-700 rounded-full py-3 px-5 hover:bg-nyx-gray transition-colors">
                <GoogleIcon className="w-6 h-6" />
                <span className="font-semibold text-white">Continue with Google</span>
            </button>

            <div className="text-center mt-8">
                <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null);}} className="font-semibold text-nyx-blue hover:underline">
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const PasswordRecoveryPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
    const { updatePassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            await updatePassword(newPassword);
            setMessage("Your password has been successfully updated. You will be redirected to the login page shortly.");
            setTimeout(() => navigateTo('login'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 md:p-10 bg-nyx-black rounded-2xl border border-nyx-gray/50 shadow-2xl shadow-nyx-blue/10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Set New Password</h2>
                <p className="text-gray-400 mt-2">Please enter and confirm your new password.</p>
            </div>

            {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg mb-4 text-sm">{error}</p>}
            {message && <p className="bg-green-500/10 text-green-400 border border-green-500/30 text-center p-3 rounded-lg mb-4 text-sm">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue transition-all"
                        required
                    />
                </div>
                 <div>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue transition-all"
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    )
}


const legalContent: Record<string, string> = {
    'privacy-policy': `
<h1 class="text-3xl font-bold mb-4">Privacy Policy</h1>
<p class="mb-4">Last updated: ${new Date().toLocaleDateString()}</p>
<h2 class="text-2xl font-bold mt-6 mb-2">1. Introduction</h2>
<p class="mb-4">NYX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by NYX.</p>
<h2 class="text-2xl font-bold mt-6 mb-2">2. Information We Collect</h2>
<p class="mb-4">We may collect personal information from you, such as your name, email address, postal address, phone number, and payment information when you purchase our products, create an account, or subscribe to our newsletter.</p>
<h2 class="text-2xl font-bold mt-6 mb-2">3. How We Use Your Information</h2>
<p class="mb-4">We use the information we collect to process your orders, provide customer support, improve our products and services, and send you marketing communications if you have opted in.</p>
`,
    'terms-conditions': `
<h1 class="text-3xl font-bold mb-4">Terms & Conditions</h1>
<p class="mb-4">Last updated: ${new Date().toLocaleDateString()}</p>
<h2 class="text-2xl font-bold mt-6 mb-2">1. Agreement to Terms</h2>
<p class="mb-4">By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
<h2 class="text-2xl font-bold mt-6 mb-2">2. Products</h2>
<p class="mb-4">We reserve the right to modify or discontinue products at any time without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of a product.</p>
`,
    'cookie-policy': `
<h1 class="text-3xl font-bold mb-4">Cookie Policy</h1>
<p class="mb-4">Last updated: ${new Date().toLocaleDateString()}</p>
<h2 class="text-2xl font-bold mt-6 mb-2">1. What Are Cookies</h2>
<p class="mb-4">As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
<h2 class="text-2xl font-bold mt-6 mb-2">2. How We Use Cookies</h2>
<p class="mb-4">We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
`,
};

const LegalPage = ({ slug, title, navigateTo }: { slug: string; title: string; navigateTo: (page: string) => void }) => {
    const content = legalContent[slug] || '<p>Content not found.</p>';
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
             <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Home
            </button>
            <div className="prose prose-invert prose-lg text-gray-300 prose-h1:text-white prose-h2:text-white/90" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    );
};

const ProductsPage = ({ navigateTo, products }: { navigateTo: (page: string, params?: any) => void; products: Product[] }) => {
    const { user } = useAuth();
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
    const displayedProducts = isAuthorized ? products : products.filter(p => p.isVisible);

    return (
         <div className="container mx-auto px-4 py-12 md:py-20">
             <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">Our Collection</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mt-4">
                    Explore the full range of NYX smart home devices, crafted for seamless integration and intuitive control.
                </p>
            </div>
            {isAuthorized && (
                 <div className="text-center mb-12">
                     <button
                         onClick={() => navigateTo('add-product')}
                         className="bg-brand-purple text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105"
                     >
                         Add New Product
                     </button>
                 </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
                ))}
            </div>
        </div>
    );
};


const BlogCard = ({ post, onClick }: { post: BlogPost; onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-2"
    >
        <div className="aspect-video overflow-hidden">
            <img 
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm text-gray-400 mb-2">{post.author} &bull; {new Date(post.date).toLocaleDateString()}</p>
            <h3 className="text-xl font-bold text-white mb-3 flex-grow">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
            <span className="mt-auto text-sm font-semibold text-brand-purple group-hover:underline">Read More &rarr;</span>
        </div>
    </div>
);


const BlogPage = ({ navigateTo, posts }: { navigateTo: (page: string, params?: any) => void; posts: BlogPost[] }) => {
    const { user } = useAuth();
    const canAddPost = user && (user.roles.includes('content_writer') || user.roles.includes('admin') || user.roles.includes('super-admin'));
    
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">The NYX Journal</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mt-4">
                    Insights, tutorials, and news from the world of smart home technology.
                </p>
            </div>
             {canAddPost && (
                 <div className="text-center mb-12">
                     <button
                         onClick={() => navigateTo('add-blog-post', { mode: 'new' })}
                         className="bg-brand-purple text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-purple/80 transition-all duration-300 transform hover:scale-105"
                     >
                         Add New Post
                     </button>
                 </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogCard key={post.id} post={post} onClick={() => navigateTo('blog-post', { id: post.id })} />
                ))}
            </div>
        </div>
    );
};

const BlogPostPage = ({ post, navigateTo }: { post: BlogPost; navigateTo: (page: string, params?: any) => void }) => {
    const { user } = useAuth();
    const isOwnerOrAdmin = user && (post.ownerId === user.id || user.roles.includes('admin') || user.roles.includes('super-admin'));

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        try {
            const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
            if (error) throw error;
            alert("Post deleted successfully.");
            navigateTo('blog');
        } catch (error: any) {
            alert(`Error deleting post: ${error.message}`);
        }
    };

    return (
         <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
             <button onClick={() => navigateTo('blog')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Blog
            </button>
            <article>
                <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8" />
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
                <div className="text-gray-400 mb-8">
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                </div>

                <div className="prose prose-invert prose-lg text-gray-300 prose-h2:text-white/90" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                 {isOwnerOrAdmin && (
                    <div className="mt-12 border-t border-gray-700 pt-8 flex gap-4">
                        <button
                            onClick={() => navigateTo('add-blog-post', { mode: 'edit', id: post.id })}
                            className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-600 transition-colors"
                        >
                            Edit Post
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-800 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
                        >
                            Delete Post
                        </button>
                    </div>
                )}
            </article>
        </div>
    );
};

// --- CRUD FORMS ---

const FormInput = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
            {...props}
            className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue transition-all"
        />
    </div>
);

const FormTextArea = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea
            {...props}
            rows={5}
            className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue transition-all"
        />
    </div>
);

const AddProductPage = ({ navigateTo, initialData }: { navigateTo: (page: string, params?: any) => void; initialData?: Product | null }) => {
    const { user } = useAuth();
    const [product, setProduct] = useState<Omit<Product, 'id'>>({
        name: initialData?.name || '',
        tagline: initialData?.tagline || '',
        price: initialData?.price || 0,
        originalPrice: initialData?.originalPrice || null,
        stock: initialData?.stock || 0,
        images: initialData?.images || [''],
        specs: initialData?.specs || [{ name: '', value: '' }],
        isVisible: initialData?.isVisible ?? true,
        ownerId: user?.id
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!initialData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
        const newSpecs = [...product.specs];
        newSpecs[index][field] = value;
        setProduct(prev => ({ ...prev, specs: newSpecs }));
    };

    const addSpec = () => {
        setProduct(prev => ({ ...prev, specs: [...prev.specs, { name: '', value: '' }] }));
    };

    const removeSpec = (index: number) => {
        setProduct(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...product.images];
        newImages[index] = value;
        setProduct(prev => ({ ...prev, images: newImages }));
    };

    const addImage = () => {
        setProduct(prev => ({ ...prev, images: [...prev.images, ''] }));
    };
    
    const removeImage = (index: number) => {
        if (product.images.length > 1) {
            setProduct(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to perform this action.");
            return;
        }
        setLoading(true);
        setError(null);

        const productData = {
            ...product,
            images: product.images.filter(img => img.trim() !== ''),
            specs: product.specs.filter(spec => spec.name.trim() !== '' && spec.value.trim() !== ''),
            owner_id: user.id
        };

        try {
            if (isEditMode && initialData) {
                const { error: updateError } = await supabase.from('products').update(productData).eq('id', initialData.id);
                if (updateError) throw updateError;
                alert("Product updated successfully!");
            } else {
                 const { error: insertError } = await supabase.from('products').insert([productData]);
                if (insertError) throw insertError;
                alert("Product added successfully!");
            }
            navigateTo('products');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

     const handleDelete = async () => {
        if (!initialData || !window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error: deleteError } = await supabase.from('products').delete().eq('id', initialData.id);
            if (deleteError) throw deleteError;
            alert("Product deleted successfully!");
            navigateTo('products');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
         <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
             <button onClick={() => navigateTo('products')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Products
            </button>
            <h1 className="text-4xl font-bold mb-8">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-dark-accent p-8 rounded-2xl border border-white/10">
                {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg text-sm">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Product Name" name="name" value={product.name} onChange={handleChange} required />
                    <FormInput label="Tagline" name="tagline" value={product.tagline} onChange={handleChange} required />
                    <FormInput label="Price (€)" name="price" type="number" step="0.01" value={product.price} onChange={handleChange} required />
                    <FormInput label="Original Price (€) (Optional)" name="originalPrice" type="number" step="0.01" value={product.originalPrice || ''} onChange={handleChange} />
                    <FormInput label="Stock" name="stock" type="number" value={product.stock} onChange={handleChange} required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Images (URLs)</label>
                    <div className="space-y-3">
                        {product.images.map((image, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="https://example.com/image.png"
                                    className="flex-grow bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-nyx-blue"
                                />
                                <button type="button" onClick={() => removeImage(index)} className="text-red-500 hover:text-red-400 p-1" disabled={product.images.length <= 1}>&times;</button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addImage} className="mt-3 text-sm text-nyx-blue hover:underline">+ Add another image</button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
                    <div className="space-y-3">
                        {product.specs.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={spec.name} onChange={(e) => handleSpecChange(index, 'name', e.target.value)} placeholder="Name (e.g., Color)" className="w-1/3 bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-nyx-blue"/>
                                <input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="Value (e.g., Onyx Black)" className="flex-grow bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-nyx-blue"/>
                                <button type="button" onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-400 p-1">&times;</button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addSpec} className="mt-3 text-sm text-nyx-blue hover:underline">+ Add another spec</button>
                </div>
                
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isVisible"
                        name="isVisible"
                        checked={product.isVisible}
                        onChange={handleChange}
                        className="h-4 w-4 shrink-0 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:ring-nyx-blue focus:ring-offset-nyx-black"
                    />
                    <label htmlFor="isVisible" className="text-sm text-gray-300">Visible to customers</label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="submit" disabled={loading} className="w-full sm:w-auto flex-grow bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50">
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Product')}
                    </button>
                    {isEditMode && (
                        <button type="button" onClick={handleDelete} disabled={loading} className="w-full sm:w-auto bg-red-800 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50">
                            {loading ? 'Deleting...' : 'Delete Product'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};


const AddBlogPostPage = ({ navigateTo, initialData }: { navigateTo: (page: string, params?: any) => void; initialData?: BlogPost | null }) => {
    const { user } = useAuth();
    const [post, setPost] = useState<Partial<BlogPost>>({
        title: initialData?.title || '',
        author: initialData?.author || user?.nickname || '',
        imageUrl: initialData?.imageUrl || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!initialData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPost(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to post.");
            return;
        }
        setLoading(true);
        setError(null);
        
        const postData = {
            ...post,
            date: new Date().toISOString(),
            owner_id: user.id
        };

        try {
            if (isEditMode && initialData) {
                const { error: updateError } = await supabase.from('blog_posts').update(postData).eq('id', initialData.id);
                if (updateError) throw updateError;
                 alert("Post updated successfully!");
                 navigateTo('blog-post', { id: initialData.id });
            } else {
                const { data, error: insertError } = await supabase.from('blog_posts').insert([postData]).select().single();
                if (insertError) throw insertError;
                alert("Post created successfully!");
                 navigateTo('blog-post', { id: data.id });
            }
        } catch (err: any) {
             setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
             <button onClick={() => navigateTo('blog')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Blog
            </button>
            <h1 className="text-4xl font-bold mb-8">{isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-dark-accent p-8 rounded-2xl border border-white/10">
                {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg text-sm">{error}</p>}
                
                <FormInput label="Title" name="title" value={post.title || ''} onChange={handleChange} required />
                <FormInput label="Author" name="author" value={post.author || ''} onChange={handleChange} required />
                <FormInput label="Image URL" name="imageUrl" type="url" value={post.imageUrl || ''} onChange={handleChange} required />
                <FormTextArea label="Excerpt (Short Summary)" name="excerpt" value={post.excerpt || ''} onChange={handleChange} required />
                <FormTextArea label="Content (HTML supported)" name="content" value={post.content || ''} onChange={handleChange} rows={15} required />

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50">
                         {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Post')}
                    </button>
                </div>
            </form>
        </div>
    );
};


const AdminDashboardPage = ({ navigateTo }: { navigateTo: (page: string, params?: any) => void }) => {
    const { user, fetchAllUsers, updateUserRoles, deleteUserAsAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRolesFor, setEditingRolesFor] = useState<string | null>(null);
    const [tempRoles, setTempRoles] = useState<UserRole[]>([]);
    const editMenuRef = useRef<HTMLDivElement>(null);
    const [editMenuPosition, setEditMenuPosition] = useState<{ top: number; right: number } | null>(null);

    const ROLES_HIERARCHY: UserRole[] = ['user', 'seller', 'content_writer', 'admin', 'super-admin', 'Web Developer', 'UI/UX Designer'];

    const roleColors: Record<UserRole, string> = {
        'user': 'bg-gray-700 text-gray-200',
        'seller': 'bg-blue-800 text-blue-200',
        'content_writer': 'bg-green-800 text-green-200',
        'admin': 'bg-purple-800 text-purple-200',
        'super-admin': 'bg-pink-800 text-pink-200',
        'Web Developer': 'bg-indigo-800 text-indigo-200',
        'UI/UX Designer': 'bg-teal-800 text-teal-200',
    };
    
    const RolePill = ({ role }: { role: UserRole }) => (
        <span className={`capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[role] || 'bg-gray-600'}`}>
            {role.replace(/_/g, ' ')}
        </span>
    );

    const canEditUser = (targetUser: User): boolean => {
        if (!user) return false;
        // A user can never edit their own roles or be deleted from this panel.
        if (user.id === targetUser.id) return false;
        // A super-admin can edit anyone else.
        if (user.roles.includes('super-admin')) return true;
        // An admin can edit anyone else who is not a super-admin.
        if (user.roles.includes('admin')) {
            return !targetUser.roles.includes('super-admin');
        }
        return false;
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const allUsers = await fetchAllUsers();
                setUsers(allUsers);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [fetchAllUsers]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editMenuRef.current && !editMenuRef.current.contains(event.target as Node)) {
                setEditingRolesFor(null);
                setEditMenuPosition(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editMenuRef]);

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, targetUser: User) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setEditMenuPosition({
            top: rect.bottom + 8, // 8px for margin
            right: window.innerWidth - rect.right,
        });
        setEditingRolesFor(targetUser.id);
        setTempRoles(targetUser.roles);
    };

    const handleSaveRoles = async (userId: string) => {
        if (!window.confirm(`Are you sure you want to change roles for this user?`)) return;
        try {
            await updateUserRoles(userId, tempRoles);
            setUsers(users.map(u => u.id === userId ? { ...u, roles: tempRoles } : u));
            alert("User roles updated successfully.");
        } catch (err: any) {
            alert(`Error updating roles: ${err.message}`);
        } finally {
            setEditingRolesFor(null);
            setEditMenuPosition(null);
        }
    };
    
    const handleTempRoleToggle = (role: UserRole) => {
        setTempRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };
    
    const handleDeleteUser = async (userId: string, userNickname: string) => {
        if (!window.confirm(`Are you sure you want to delete the user "${userNickname}"? This action is not easily reversible.`)) return;
        try {
            await deleteUserAsAdmin(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert("User deleted successfully.");
        } catch (err: any)
        {
            alert(`Error deleting user: ${err.message}`);
        }
    }

    if (loading) return <div className="text-center py-20">Loading users...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

    const editingUser = users.find(u => u.id === editingRolesFor);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
            <div className="bg-dark-accent p-6 md:p-8 rounded-2xl border border-white/10 overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-6">User Management</h2>
                <table className="w-full text-left min-w-[800px]">
                    <thead >
                        <tr className="border-b border-gray-700">
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Roles</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-gray-800 hover:bg-nyx-gray/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random`} alt={u.nickname} className="w-10 h-10 rounded-full bg-nyx-gray object-cover" />
                                        <div>
                                            <p className="font-semibold text-white">{u.nickname}</p>
                                            <p className="text-sm text-gray-400">{u.firstName} {u.lastName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-400">{u.email}</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {(u.roles.length > 0 ? u.roles : ['user'] as const).map(role => <RolePill key={role} role={role} />)}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        {canEditUser(u) && (
                                            <button onClick={(e) => handleEditClick(e, u)} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold px-3 py-1.5 rounded-md transition-colors">
                                                Edit Roles
                                            </button>
                                        )}
                                        {canEditUser(u) && (
                                            <button onClick={() => handleDeleteUser(u.id, u.nickname)} className="text-sm bg-red-900/50 hover:bg-red-900 text-red-300 font-semibold px-3 py-1.5 rounded-md transition-colors">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingRolesFor && editMenuPosition && editingUser && (
                <div 
                    ref={editMenuRef} 
                    className="fixed z-[60] w-64 bg-dark rounded-lg border border-white/20 shadow-lg p-4 text-left animate-fade-in"
                    style={{ top: `${editMenuPosition.top}px`, right: `${editMenuPosition.right}px` }}
                >
                    <h4 className="font-semibold text-white mb-3">Assign Roles for {editingUser.nickname}</h4>
                    <div className="space-y-2">
                        {ROLES_HIERARCHY.map(role => (
                            <label key={role} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                <input
                                    type="checkbox"
                                    checked={tempRoles.includes(role)}
                                    onChange={() => handleTempRoleToggle(role)}
                                    className="h-4 w-4 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:ring-nyx-blue focus:ring-offset-nyx-black"
                                />
                                <span className="capitalize">{role.replace(/_/g, ' ')}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => { setEditingRolesFor(null); setEditMenuPosition(null); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition-colors">Cancel</button>
                        <button onClick={() => handleSaveRoles(editingRolesFor)} className="text-xs bg-nyx-blue hover:bg-white text-nyx-black font-bold px-3 py-1.5 rounded-md transition-all">Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfilePage = ({ navigateTo }: { navigateTo: (page: string, params?: any) => void }) => {
    const { user, updateUser, logout, changePassword, deleteUserAccount } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        nickname: user?.nickname || '',
    });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    if (!user) {
        // This should not happen if routed correctly, but as a safeguard:
        useEffect(() => { navigateTo('login'); }, [navigateTo]);
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await updateUser(user.id, formData);
            setMessage("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
            setMessage("Password changed successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be lost.")) {
            return;
        }
        try {
            await deleteUserAccount();
            alert("Account deleted successfully.");
            navigateTo('home');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>
            {error && <p className="bg-red-500/10 text-red-400 border border-red-500/30 text-center p-3 rounded-lg mb-6 text-sm">{error}</p>}
            {message && <p className="bg-green-500/10 text-green-400 border border-green-500/30 text-center p-3 rounded-lg mb-6 text-sm">{message}</p>}
            
            {/* Profile Info Section */}
            <div className="bg-dark-accent p-8 rounded-2xl border border-white/10 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt={user.nickname} className="w-24 h-24 rounded-full bg-nyx-gray object-cover" />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{user.nickname}</h2>
                        <p className="text-gray-400">{user.firstName} {user.lastName}</p>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                            {user.roles.map(role => <span key={role} className="bg-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{role}</span>)}
                        </div>
                    </div>
                </div>
                 {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto bg-nyx-blue text-nyx-black font-bold py-2 px-6 rounded-full hover:bg-white transition-colors">
                        Edit Profile
                    </button>
                 ) : (
                     <form onSubmit={handleProfileUpdate} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                             <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                         </div>
                         <FormInput label="Nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} />
                         <div className="flex gap-4 pt-2">
                             <button type="submit" disabled={loading} className="bg-nyx-blue text-nyx-black font-bold py-2 px-6 rounded-full hover:bg-white transition-colors disabled:opacity-50">
                                 {loading ? 'Saving...' : 'Save Changes'}
                             </button>
                             <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-600 transition-colors">
                                 Cancel
                             </button>
                         </div>
                     </form>
                 )}
            </div>

            {/* Change Password Section */}
            <div className="bg-dark-accent p-8 rounded-2xl border border-white/10 mb-8">
                <h3 className="text-2xl font-semibold mb-6">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                     <FormInput label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                     <FormInput label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                     <FormInput label="Confirm New Password" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
                     <div className="pt-2">
                         <button type="submit" disabled={loading} className="bg-nyx-blue text-nyx-black font-bold py-2 px-6 rounded-full hover:bg-white transition-colors disabled:opacity-50">
                             {loading ? 'Updating...' : 'Update Password'}
                         </button>
                     </div>
                </form>
            </div>
            
             {/* Danger Zone */}
            <div className="bg-red-900/20 p-8 rounded-2xl border border-red-500/30">
                <h3 className="text-2xl font-semibold mb-4 text-red-400">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-red-300">Deleting your account is permanent and cannot be undone.</p>
                     <button onClick={handleDeleteAccount} className="w-full sm:w-auto bg-red-800 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-700 transition-colors shrink-0">
                        Delete My Account
                    </button>
                </div>
            </div>

        </div>
    );
};


// Main App Structure
const AppContent = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageParams, setPageParams] = useState<any>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isAskNyxOpen, setIsAskNyxOpen] = useState(false);
    const [showCookieConsent, setShowCookieConsent] = useState(false);

    const { user, isPasswordRecoveryFlow } = useAuth();
    const mainContentRef = useRef<HTMLDivElement>(null);
    

    const navigateTo = useCallback((page: string, params: any = {}) => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
        setPageParams(params);
        // Update URL to be more descriptive, but without forcing reloads.
        const path = page === 'home' ? '/' : (page === 'blog-post' || page === 'legal' || page === 'edit-product') ? `/${page.replace('-','/')}/${params.id || params.slug}` : `/${page}`;
        window.history.pushState({ page, params }, '', path);
    }, []);

    useEffect(() => {
        // This effect handles initial routing from URL and back/forward browser actions.
        const handleInitialAndPopState = () => {
            const path = window.location.pathname;
            const segments = path.split('/').filter(Boolean);
            
            const pageMappings: { [key: string]: string } = {
                'products': 'products',
                'blog': 'blog',
                'add-product': 'add-product',
                'add-blog-post': 'add-blog-post',
                'admin-dashboard': 'admin-dashboard',
                'profile': 'profile',
                'login': 'login',
                'password-recovery': 'password-recovery',
            };

            let page = 'home';
            let params: any = {};
            
            if (segments.length > 0) {
                if (segments[0] === 'blog' && segments[1] === 'post' && segments[2]) {
                    page = 'blog-post';
                    params.id = segments[2];
                } else if (segments[0] === 'edit' && segments[1] === 'product' && segments[2]) {
                    page = 'edit-product';
                    params.id = segments[2];
                } else if (segments[0] === 'legal' && segments[1]) {
                    page = 'legal';
                    params.slug = segments[1];
                    const titles: { [key:string]: string } = {
                        'privacy-policy': 'Privacy Policy',
                        'terms-conditions': 'Terms & Conditions',
                        'cookie-policy': 'Cookie Policy',
                    }
                    params.title = titles[params.slug] || 'Legal';
                } else if (pageMappings[segments[0]]) {
                    page = pageMappings[segments[0]];
                }
            }
            
            setCurrentPage(page);
            setPageParams(params);
        };
        
        // Set initial page state from URL
        handleInitialAndPopState();

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                setCurrentPage(event.state.page || 'home');
                setPageParams(event.state.params || {});
            } else {
                // Fallback for cases where state is null
                handleInitialAndPopState();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (isPasswordRecoveryFlow && currentPage !== 'password-recovery') {
            navigateTo('password-recovery');
        }
    }, [isPasswordRecoveryFlow, navigateTo, currentPage]);


    // Fetch initial data (products, blog posts)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const { data: productsData, error: productsError } = await supabase.from('products').select('*');
                if (productsError) throw productsError;
                setProducts(productsData as Product[]);

                // Fetch blog posts
                const { data: blogPostsData, error: blogPostsError } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
                if (blogPostsError) throw blogPostsError;
                setBlogPosts(blogPostsData as BlogPost[]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        
         // Listen for real-time changes
        const productsSubscription = supabase.channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
            .subscribe();
            
        const blogPostsSubscription = supabase.channel('public:blog_posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(productsSubscription);
            supabase.removeChannel(blogPostsSubscription);
        };
    }, []);
    
     useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            setShowCookieConsent(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowCookieConsent(false);
    };

    const handleDeclineCookies = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShowCookieConsent(false);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigateTo={navigateTo} products={products} />;
            case 'products':
                return <ProductsPage navigateTo={navigateTo} products={products} />;
            case 'add-product':
                 return <AddProductPage navigateTo={navigateTo} />;
            case 'edit-product':
                 const productToEdit = products.find(p => p.id === pageParams.id);
                 return <AddProductPage navigateTo={navigateTo} initialData={productToEdit} />;
            case 'blog':
                return <BlogPage navigateTo={navigateTo} posts={blogPosts} />;
            case 'blog-post':
                const post = blogPosts.find(p => p.id === pageParams.id);
                if (!post) return <div>Post not found.</div>;
                return <BlogPostPage post={post} navigateTo={navigateTo} />;
            case 'add-blog-post':
                const postToEdit = pageParams.mode === 'edit' ? blogPosts.find(p => p.id === pageParams.id) : null;
                return <AddBlogPostPage navigateTo={navigateTo} initialData={postToEdit} />;
            case 'admin-dashboard':
                return <AdminDashboardPage navigateTo={navigateTo} />;
            case 'profile':
                return <ProfilePage navigateTo={navigateTo} />;
            case 'legal':
                return <LegalPage slug={pageParams.slug} title={pageParams.title} navigateTo={navigateTo} />;
            case 'login':
                return (
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <AuthForm navigateTo={navigateTo} />
                    </div>
                );
             case 'password-recovery':
                return (
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <PasswordRecoveryPage navigateTo={navigateTo} />
                    </div>
                );
            case 'how-it-works':
            case 'setup-videos':
            case 'faq':
            case 'contact':
            case 'our-story':
            case 'why-us':
                 // Simple placeholder for now
                 return <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold">{currentPage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h1><p className="mt-4 text-gray-400">This page is under construction.</p></div>
            default:
                return <HomePage navigateTo={navigateTo} products={products} />;
        }
    };
    
    // Don't render header/footer on full-screen auth pages
    if (currentPage === 'login' || currentPage === 'password-recovery') {
        return renderPage();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header onAskNyxOpen={() => setIsAskNyxOpen(true)} navigateTo={navigateTo} />
            <main ref={mainContentRef} className="flex-grow pt-20">
                {renderPage()}
            </main>
            <Footer navigateTo={navigateTo} />
            <CartSidebar navigateTo={navigateTo} />
            <AskNyx isOpen={isAskNyxOpen} onClose={() => setIsAskNyxOpen(false)} />
            {showCookieConsent && <CookieConsentBanner onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />}
        </div>
    );
};


const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
};

export default App;