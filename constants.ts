

import React from 'react';
import { Product, Testimonial, Feature } from './types';

export const NAV_LINKS = [
  { name: 'Product', href: '#product' },
  { name: 'Features', href: '#features' },
  { name: 'Ask NYX', href: '#ask' },
];

// Fix: Add PRODUCT_DATA export
export const PRODUCT_DATA: Product = {
  name: 'NYX-1 Smart PIR Motion Sensor',
  tagline: 'Intelligent motion sensing meets minimalist design. Illuminate your space with precision.',
  price: 79.99,
  originalPrice: 99.99,
  stock: 150,
  images: [
    'https://i.ibb.co/yYv3x0M/sensor-main.png',
    'https://i.ibb.co/KqK5zG1/sensor-angle.png',
    'https://i.ibb.co/dKBFJg7/sensor-side.png',
    'https://i.ibb.co/GvxPR2h/sensor-lifestyle.png',
  ],
  specs: [
    { name: 'Detection Range', value: '8 meters / 26 feet' },
    { name: 'Detection Angle', value: '120 degrees' },
    { name: 'Battery Life', value: 'Up to 24 months' },
    { name: 'Connectivity', value: 'Wi-Fi 2.4GHz / Bluetooth 5.0' },
    { name: 'Color', value: 'Matte Onyx Black' },
    { name: 'Dimensions', value: '45mm x 45mm x 30mm' },
  ],
};

// Placeholder icons for Features section as creating new files is not allowed.
// FIX: Converted JSX to React.createElement calls to fix errors in .ts file.
const AIChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }), React.createElement('rect', { x: "9", y: "9", width: "6", height: "6" }), React.createElement('line', { x1: "9", y1: "1", x2: "9", y2: "4" }), React.createElement('line', { x1: "15", y1: "1", x2: "15", y2: "4" }), React.createElement('line', { x1: "9", y1: "20", x2: "9", y2: "23" }), React.createElement('line', { x1: "15", y1: "20", x2: "15", y2: "23" }), React.createElement('line', { x1: "20", y1: "9", x2: "23", y2: "9" }), React.createElement('line', { x1: "20", y1: "14", x2: "23", y2: "14" }), React.createElement('line', { x1: "1", y1: "9", x2: "4", y2: "9" }), React.createElement('line', { x1: "1", y1: "14", x2: "4", y2: "14" }))
);
const BatteryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('rect', { x: "1", y: "6", width: "18", height: "12", rx: "2", ry: "2" }), React.createElement('line', { x1: "23", y1: "13", x2: "23", y2: "11" }))
);
const DesignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, React.createElement('path', { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }))
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