import React from 'react';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const TermsAndConditionsPage: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    // Basic CSS for Prose-like styling.
    const proseStyles: React.CSSProperties = {
        lineHeight: '1.75',
    };
    const headingStyles: React.CSSProperties = {
        color: 'white',
        fontWeight: '600',
        marginTop: '1.5em',
        marginBottom: '0.5em',
        borderBottom: '1px solid #374151',
        paddingBottom: '0.25em',
    };
     const subHeadingStyles: React.CSSProperties = {
        color: '#E5E7EB', // slightly off-white
        fontWeight: '600',
        marginTop: '1.2em',
        marginBottom: '0.4em',
    };

    return (
        <div className="bg-dark pt-24 animate-fade-in">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigateTo('home')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">Terms & Conditions</h1>
                    
                    <div className="text-gray-300 space-y-4 text-lg" style={proseStyles}>
                        <p><strong>Last Updated: September 17, 2025</strong></p>

                        <p>Welcome to NYX Smart Home. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.</p>

                        <h2 style={headingStyles} className="text-2xl">1. Company Information</h2>
                        <p>NYX Smart Home ("we," "us," or "our") is a smart home technology company providing innovative home automation solutions and devices.</p>

                        <h2 style={headingStyles} className="text-2xl">2. Acceptance of Terms</h2>
                        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

                        <h2 style={headingStyles} className="text-2xl">3. Products and Services</h2>
                        <h3 style={subHeadingStyles} className="text-xl">3.1 Product Descriptions</h3>
                        <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
                        <h3 style={subHeadingStyles} className="text-xl">3.2 Availability</h3>
                        <p>All products are subject to availability. We reserve the right to discontinue any product at any time without prior notice.</p>
                        <h3 style={subHeadingStyles} className="text-xl">3.3 Pricing</h3>
                         <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>All prices are listed in the currency specified on the product page.</li>
                            <li>Prices are subject to change without notice.</li>
                            <li>We reserve the right to correct pricing errors.</li>
                        </ul>

                        <h2 style={headingStyles} className="text-2xl">4. Ordering and Payment</h2>
                        <h3 style={subHeadingStyles} className="text-xl">4.1 Order Acceptance</h3>
                        <p>Your order constitutes an offer to purchase our products. We reserve the right to accept or reject any order at our sole discretion.</p>
                        <h3 style={subHeadingStyles} className="text-xl">4.2 Payment Terms</h3>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Payment must be made at the time of purchase.</li>
                            <li>We accept major credit cards and other payment methods as displayed.</li>
                            <li>All payments are processed securely through our payment partners.</li>
                        </ul>
                        <h3 style={subHeadingStyles} className="text-xl">4.3 Order Confirmation</h3>
                        <p>You will receive an email confirmation once your order is successfully placed and payment is processed.</p>
                        
                        <h2 style={headingStyles} className="text-2xl">5. Shipping and Delivery</h2>
                        <h3 style={subHeadingStyles} className="text-xl">5.1 Shipping</h3>
                         <ul className="list-disc list-inside ml-4 space-y-2">
                           <li>Shipping costs and delivery times vary by location and product.</li>
                           <li>Risk of loss and title pass to you upon delivery to the carrier.</li>
                           <li>We are not responsible for delays caused by shipping carriers.</li>
                        </ul>
                        <h3 style={subHeadingStyles} className="text-xl">5.2 International Shipping</h3>
                        <p>International customers are responsible for all customs duties, taxes, and fees imposed by their country.</p>

                        <h2 style={headingStyles} className="text-2xl">6. Returns and Refunds</h2>
                        <h3 style={subHeadingStyles} className="text-xl">6.1 Return Policy</h3>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Products may be returned within 30 days of delivery.</li>
                            <li>Items must be in original condition and packaging.</li>
                            <li>Custom or personalized products are not returnable.</li>
                        </ul>
                        <h3 style={subHeadingStyles} className="text-xl">6.2 Refund Process</h3>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Refunds will be processed within 5-10 business days.</li>
                            <li>Original shipping costs are non-refundable.</li>
                            <li>Customer is responsible for return shipping costs.</li>
                        </ul>

                        <h2 style={headingStyles} className="text-2xl">7. Warranty</h2>
                        <h3 style={subHeadingStyles} className="text-xl">7.1 Product Warranty</h3>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>All products come with a manufacturer's warranty as specified.</li>
                            <li>Warranty terms vary by product and manufacturer.</li>
                            <li>Warranty does not cover damage from misuse, accidents, or normal wear.</li>
                        </ul>
                        <h3 style={subHeadingStyles} className="text-xl">7.2 Limitation of Liability</h3>
                        <p>Our liability is limited to the purchase price of the product. We are not liable for any indirect, incidental, or consequential damages.</p>

                        <h2 style={headingStyles} className="text-2xl">8. Intellectual Property</h2>
                        <h3 style={subHeadingStyles} className="text-xl">8.1 Trademarks</h3>
                        <p>NYX Smart Home and all related trademarks are owned by us or our licensors.</p>
                        <h3 style={subHeadingStyles} className="text-xl">8.2 Copyright</h3>
                        <p>All content on this website is protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.</p>

                        <h2 style={headingStyles} className="text-2xl">9. User Accounts</h2>
                        <h3 style={subHeadingStyles} className="text-xl">9.1 Account Creation</h3>
                        <p>You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information.</p>
                        <h3 style={subHeadingStyles} className="text-xl">9.2 Account Termination</h3>
                        <p>We reserve the right to terminate accounts that violate these Terms or engage in fraudulent activity.</p>
                        
                        <h2 style={headingStyles} className="text-2xl">10. Privacy and Data Protection</h2>
                        <p>Your privacy is important to us. Please review our Privacy Policy, which governs how we collect, use, and protect your personal information.</p>

                        <h2 style={headingStyles} className="text-2xl">11. Prohibited Uses</h2>
                        <p>You may not use our website for:</p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>Any unlawful purpose or activity.</li>
                            <li>Transmitting harmful code or malware.</li>
                            <li>Interfering with the website's functionality.</li>
                            <li>Attempting to gain unauthorized access to our systems.</li>
                        </ul>

                        <h2 style={headingStyles} className="text-2xl">12. Third-Party Links</h2>
                        <p>Our website may contain links to third-party websites. We are not responsible for the content or practices of these external sites.</p>

                        <h2 style={headingStyles} className="text-2xl">13. Technical Support</h2>
                        <h3 style={subHeadingStyles} className="text-xl">13.1 Support Services</h3>
                        <p>We provide technical support for our products as outlined in the product documentation.</p>
                        <h3 style={subHeadingStyles} className="text-xl">13.2 Limitation</h3>
                        <p>Support is provided "as is" without warranties of any kind.</p>
                        
                        <h2 style={headingStyles} className="text-2xl">14. Modifications to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of modified Terms.</p>
                        
                        <h2 style={headingStyles} className="text-2xl">15. Governing Law</h2>
                        <p>These Terms are governed by the laws of the State of California, USA without regard to conflict of law principles.</p>

                        <h2 style={headingStyles} className="text-2xl">16. Dispute Resolution</h2>
                        <h3 style={subHeadingStyles} className="text-xl">16.1 Binding Arbitration</h3>
                        <p>Any disputes arising from these Terms will be resolved through binding arbitration rather than in court.</p>
                        <h3 style={subHeadingStyles} className="text-xl">16.2 Class Action Waiver</h3>
                        <p>You agree to resolve disputes individually and waive any right to participate in class action lawsuits.</p>

                        <h2 style={headingStyles} className="text-2xl">17. Severability</h2>
                        <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>

                        <h2 style={headingStyles} className="text-2xl">18. Contact Information</h2>
                        <p>If you have any questions about these Terms & Conditions, please contact us:</p>
                        <div className="bg-dark-accent p-4 rounded-lg border border-white/10 mt-2">
                            <p><strong>NYX Smart Home</strong><br/>
                            <strong>Email:</strong> support@nyxhome.io<br/>
                            <strong>Phone:</strong> +1 (800) 555-0199<br/>
                            <strong>Address:</strong> 123 Innovation Drive, Tech City, 90210</p>
                        </div>
                        <hr className="border-gray-700 my-8" />
                        <p className="text-sm text-gray-400"><em>These Terms & Conditions are effective as of September 17, 2025 and were last updated on September 17, 2025.</em></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;