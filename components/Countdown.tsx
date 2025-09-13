
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => (
    <div key={interval} className="text-center">
      <div className="text-4xl md:text-6xl font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-sm md:text-base uppercase tracking-widest text-gray-400">
        {interval}
      </div>
    </div>
  ));

  return (
    <section className="py-12 md:py-20 bg-nyx-gray/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 tracking-wide">Limited Launch Event</h2>
        <p className="text-gray-300 mb-8">Pre-orders open in:</p>
        <div className="flex justify-center space-x-4 md:space-x-8">
          {timerComponents.length ? timerComponents : <span>Launch has begun!</span>}
        </div>
      </div>
    </section>
  );
};

export default Countdown;
