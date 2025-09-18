import React from 'react';
import { Product, Testimonial, Feature, FAQItem } from './types';

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
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

const NYX_SENSOR: Product = {
  id: 'prod-001',
  name: 'NYX-1 Smart PIR Motion Sensor',
  tagline: 'Intelligent motion sensing meets minimalist design.',
  price: 79.99,
  originalPrice: 99.99,
  stock: 150,
  images: [
    'https://m.media-amazon.com/images/I/51rG+55hL9L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61N92qc0bOL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61T+Nf-M7FL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61f-jqlprGL._AC_SL1500_.jpg',
  ],
  specs: [
    { name: 'Detection Range', value: '8 meters / 26 feet' },
    { name: 'Detection Angle', value: '120 degrees' },
    { name: 'Battery Life', value: 'Up to 24 months' },
    { name: 'Connectivity', value: 'Wi-Fi 2.4GHz / Bluetooth 5.0' },
    { name: 'Color', value: 'Matte Onyx Black' },
    { name: 'Dimensions', value: '45mm x 45mm x 30mm' },
  ],
  isVisible: true,
};

const NYX_BULB: Product = {
  id: 'prod-002',
  name: 'NYX-Bulb Smart LED',
  tagline: 'Infinite colors for every mood. Brilliant illumination.',
  price: 24.99,
  stock: 300,
  images: ['https://m.media-amazon.com/images/I/61Bi4iS1i3L._AC_SL1500_.jpg'],
  specs: [
    { name: 'Brightness', value: '800 Lumens' },
    { name: 'Color', value: '16 Million Colors (RGBW)' },
    { name: 'Lifetime', value: '25,000 Hours' },
    { name: 'Connectivity', value: 'Wi-Fi 2.4GHz' },
    { name: 'Voice Control', value: 'Alexa, Google Assistant' },
  ],
  isVisible: true,
};

const NYX_PLUG: Product = {
  id: 'prod-003',
  name: 'NYX-Plug Smart Outlet',
  tagline: 'Make any appliance smart. Control from anywhere.',
  price: 19.99,
  stock: 450,
  images: ['https://m.media-amazon.com/images/I/61n2MC2w4vL._AC_SL1500_.jpg'],
  specs: [
    { name: 'Input Voltage', value: '100-240V' },
    { name: 'Max Current', value: '10A' },
    { name: 'Connectivity', value: 'Wi-Fi 2.4GHz' },
    { name: 'Features', value: 'Scheduling, Timer, Remote' },
  ],
  isVisible: true,
};

const NYX_CAM: Product = {
  id: 'prod-004',
  name: 'NYX-Cam Indoor Security',
  tagline: 'Your eyes at home. Crystal clear 2K resolution.',
  price: 59.99,
  originalPrice: 79.99,
  stock: 200,
  images: ['https://m.media-amazon.com/images/I/51n8Kmqz2EL._AC_SL1000_.jpg'],
  specs: [
    { name: 'Resolution', value: '2K (2304x1296)' },
    { name: 'Field of View', value: '125° Wide-Angle' },
    { name: 'Night Vision', value: 'Color Night Vision' },
    { name: 'Features', value: 'Two-Way Audio, AI Detection' },
  ],
  isVisible: true,
};


// Replaces PRODUCT_DATA with a list of all products.
export const PRODUCTS_DATA: Product[] = [NYX_SENSOR, NYX_BULB, NYX_PLUG, NYX_CAM];


// Placeholder icons for Features section as creating new files is not allowed.
// FIX: Converted JSX to React.createElement calls to fix errors in .ts file.
const AIChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }), React.createElement('rect', { x: "9", y: "9", width: "6", height: "6" }), React.createElement('line', { x1: "9", y1: "1", x2: "9", y2: "4" }), React.createElement('line', { x1: "15", y1: "1", x2: "15", y2: "4" }), React.createElement('line', { x1: "9", y1: "20", x2: "9", y2: "23" }), React.createElement('line', { x1: "15", y1: "20", x2: "15", y2: "23" }), React.createElement('line', { x1: "20", y1: "9", x2: "23", y2: "9" }), React.createElement('line', { x1: "20", y1: "14", x2: "23", y2: "14" }), React.createElement('line', { x1: "1", y1: "9", x2: "4", y2: "9" }), React.createElement('line', { x1: "1", y1: "14", x2: "4", y2: "14" }))
);
const BatteryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "1", y: "6", width: "18", height: "12", rx: "2", ry: "2" }), React.createElement('line', { x1: "23", y1: "13", x2: "23", y2: "11" }))
);
const DesignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M12 2L2 7l10 5 10-5-10-5z" }),
        React.createElement('path', { d: "M2 17l10 5 10-5" }),
        React.createElement('path', { d: "M2 12l10 5 10-5" })
    )
);
const ConnectivityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('path', { d: "M5 12.55a8 8 0 0 1 14.08 0" }), React.createElement('path', { d: "M1.42 9a12 12 0 0 1 21.16 0" }), React.createElement('path', { d: "M8.53 16.11a4 4 0 0 1 6.95 0" }), React.createElement('line', { x1: "12", y1: "20", x2: "12", y2: "20" }))
);

// Fix: Add FEATURES_DATA export
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

// Fix: Add TESTIMONIALS_DATA export
export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    quote: "The NYX sensor is a masterpiece of design and engineering. It's the first smart device that truly feels like it belongs in a modern home.",
    author: 'Alex Carter',
    publication: 'TechLuxe Magazine',
  },
  {
    quote: "Its adaptive AI is shockingly intelligent. It learned my schedule in a day, eliminating false triggers completely. This is the future of motion sensing.",
    author: 'Samantha Reed',
    publication: 'The Verge',
  },
  {
    quote: "Finally, a smart sensor that doesn't compromise on aesthetics. The matte onyx finish is gorgeous, and the setup was a breeze.",
    author: 'Ben Schiller',
    publication: 'Wired',
  },
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