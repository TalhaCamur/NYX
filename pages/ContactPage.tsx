import React, { useState, useEffect } from 'react';

interface ContactPageProps {
  navigateTo: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'hello@nyx.com',
      link: 'mailto:hello@nyx.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Office',
      value: 'San Francisco, CA',
      link: '#'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Working Hours',
      value: 'Mon-Fri 9AM-6PM',
      link: '#'
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', link: '#', color: 'hover:text-gray-300' },
    { name: 'LinkedIn', icon: 'in', link: '#', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: 'GH', link: '#', color: 'hover:text-gray-300' },
    { name: 'Instagram', icon: 'IG', link: '#', color: 'hover:text-pink-400' }
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Creative Header */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-nyx-blue/10 to-brand-purple/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-brand-pink/10 to-nyx-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nyx-blue/10 border border-nyx-blue/30 mb-8">
              <div className="w-2 h-2 bg-brand-pink rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-200 tracking-wide">24/7 Support Available</span>
            </div>

            {/* Title with creative typography */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Let's
              <span className="block bg-gradient-to-r from-nyx-blue via-cyan-400 to-nyx-blue text-transparent bg-clip-text">
                Connect
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Have a question about our products? Need technical support? Want to share feedback? 
              <span className="text-nyx-blue font-semibold"> We're here to help</span> and 
              <span className="text-brand-purple font-semibold"> love hearing from you.</span>
            </p>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-12 text-base">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-nyx-blue mb-1">&lt; 1hr</div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-purple">24/7</div>
                <div className="text-sm text-gray-400">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-pink">100%</div>
                <div className="text-sm text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left Side - Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Methods */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-nyx-blue/50 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-nyx-blue/20 to-brand-purple/20 flex items-center justify-center text-nyx-blue group-hover:scale-110 transition-transform">
                          {method.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">{method.title}</div>
                          <div className="font-medium text-white">{method.value}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold transition-all ${social.color} hover:scale-110 hover:bg-white/10`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Fun fact */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-nyx-blue/5 via-brand-purple/5 to-brand-pink/5 border border-nyx-blue/20">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-2xl">💡</div>
                    <div>
                      <h4 className="font-semibold mb-2 text-nyx-blue">Did you know?</h4>
                      <p className="text-sm text-gray-400">
                        Our support team is powered by AI and human expertise to give you the best experience possible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:col-span-3">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Thanks! We'll get back to you soon.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-semibold hover:shadow-lg hover:shadow-nyx-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Quick Answers</h2>
            <p className="text-gray-400 mb-8">Find answers to common questions</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                { q: 'What are your response times?', a: 'We typically respond within 24 hours on business days.' },
                { q: 'Do you offer technical support?', a: 'Yes! Our team provides full technical support for all products.' },
                { q: 'Can I schedule a demo?', a: 'Absolutely! Contact us to schedule a personalized demo.' },
                { q: 'Where are you located?', a: "We're based in San Francisco, CA with remote team members worldwide." }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-nyx-blue/50 transition-colors">
                  <h3 className="font-semibold mb-2 text-white">{item.q}</h3>
                  <p className="text-sm text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

