

import React from 'react';
// FIX: Import Testimonial type.
import { Product, Feature, FAQItem, Testimonial } from './types';

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Blog', href: '/blog' },
  {
    name: 'Support',
    sublinks: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Setup Videos', href: '/setup-videos' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact', href: '/contact' },
    ]
  },
  {
    name: 'About Us',
    sublinks: [
      { name: 'Our Story', href: '/our-story' },
      { name: 'Why Us?', href: '/why-us' },
    ]
  },
  { name: 'Ask NYX', href: '#ask' },
];

// Placeholder icons for Features section as creating new files is not allowed.
const AIChipIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }), React.createElement('rect', { x: "9", y: "9", width: "6", height: "6" }), React.createElement('line', { x1: "9", y1: "1", x2: "9", y2: "4" }), React.createElement('line', { x1: "15", y1: "1", x2: "15", y2: "4" }), React.createElement('line', { x1: "9", y1: "20", x2: "9", y2: "23" }), React.createElement('line', { x1: "15", y1: "20", x2: "15", y2: "23" }), React.createElement('line', { x1: "20", y1: "9", x2: "23", y2: "9" }), React.createElement('line', { x1: "20", y1: "14", x2: "23", y2: "14" }), React.createElement('line', { x1: "1", y1: "9", x2: "4", y2: "9" }), React.createElement('line', { x1: "1", y1: "14", x2: "4", y2: "14" }))
);
const BatteryIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "1", y: "6", width: "18", height: "12", rx: "2", ry: "2" }), React.createElement('line', { x1: "23", y1: "13", x2: "23", y2: "11" }))
);
const DesignIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M12 2L2 7l10 5 10-5-10-5z" }),
        React.createElement('path', { d: "M2 17l10 5 10-5" }),
        React.createElement('path', { d: "M2 12l10 5 10-5" })
    )
);
const ConnectivityIcon = (props: React.SVGProps<SVGSVGElement>): React.ReactElement => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('path', { d: "M5 12.55a8 8 0 0 1 14.08 0" }), React.createElement('path', { d: "M1.42 9a12 12 0 0 1 21.16 0" }), React.createElement('path', { d: "M8.53 16.11a4 4 0 0 1 6.95 0" }), React.createElement('line', { x1: "12", y1: "20", x2: "12", y2: "20" }))
);

export const FEATURES_DATA: Feature[] = [
    {
        icon: AIChipIcon,
        title: 'Adaptive AI Learning',
        description: 'Our onboard AI learns your habits to reduce false triggers and anticipate your needs, providing smarter, more intuitive lighting.',
    },
    {
        icon: BatteryIcon,
        title: 'Extended Battery Life',
        description: 'Engineered for efficiency, the NYX sensor boasts an industry-leading 24-month battery life on a single charge.',
    },
    {
        icon: DesignIcon,
        title: 'Minimalist Aesthetics',
        description: 'Crafted from a single piece of bead-blasted aluminum, its sleek, unobtrusive design complements any modern interior.',
    },
    {
        icon: ConnectivityIcon,
        title: 'Seamless Integration',
        description: 'Connects effortlessly with all major smart home ecosystems, including Apple HomeKit, Google Home, and Amazon Alexa.',
    },
];

// FIX: Define and export TESTIMONIALS_DATA.
export const TESTIMONIALS_DATA: Testimonial[] = [
    {
        quote: "The NYX-1 sensor is a masterclass in minimalist design and intelligent automation. It's the most responsive and reliable motion sensor I've ever tested.",
        author: "Alex Grant",
        publication: "TechSphere Today"
    },
    {
        quote: "Finally, a smart home device that just works. The setup was refreshingly simple, and the Adaptive AI Learning is a game-changer for reducing false alerts.",
        author: "Samantha Riley",
        publication: "The Connected Home"
    },
    {
        quote: "From the build quality to the battery life, every aspect of the NYX ecosystem feels premium. It's the new gold standard for smart home enthusiasts.",
        author: "Jordan Lee",
        publication: "GadgetFlow"
    }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'How long does the battery last on the NYX-1 Sensor?',
    answer: 'The NYX-1 Smart PIR Motion Sensor is engineered for maximum efficiency. It features an industry-leading 24-month battery life on a single charge under typical usage conditions.'
  },
  {
    question: 'Are NYX products compatible with Apple HomeKit, Google Home, and Amazon Alexa?',
    answer: 'Yes, absolutely. Seamless integration is a core principle of our design philosophy. All NYX devices connect effortlessly with all major smart home ecosystems, including Apple HomeKit, Google Home, and Amazon Alexa, providing you with a unified control experience.'
  },
  {
    question: 'What is Adaptive AI Learning?',
    answer: 'Our proprietary Adaptive AI Learning is an onboard intelligence system within the NYX-1 Sensor. It learns your household\'s patterns and habits over time to significantly reduce false motion triggers and eventually anticipate your needs, such as adjusting lighting before you enter a room.'
  },
  {
    question: 'What is the warranty period for NYX devices?',
    answer: 'All NYX products come with a comprehensive 2-year limited warranty covering any manufacturing defects. We stand by the quality and durability of our devices.'
  },
  {
    question: 'Can I control the NYX-Bulb\'s color and brightness?',
    answer: 'Yes. The NYX-Bulb offers a palette of 16 million colors (RGBW) and full dimming capabilities. You can control the color, brightness, and set dynamic scenes directly from the NYX app or through your connected voice assistant.'
  },
  {
    question: 'Do I need a separate hub for NYX products to work?',
    answer: 'No, you do not. Our devices are designed to be simple and accessible. Each NYX product connects directly to your home\'s 2.4GHz Wi-Fi network, eliminating the need for an extra hub or bridge.'
  }
];