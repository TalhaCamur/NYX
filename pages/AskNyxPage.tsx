import React, { useState } from 'react';

interface AskNyxPageProps {
  navigateTo: (page: string, params?: any) => void;
}

const AskNyxPage: React.FC<AskNyxPageProps> = ({ navigateTo }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      // Simulate AI response - in a real app, this would call your AI service
      const responses = [
        "NYX devices are designed to work seamlessly together. You can start with any device and add more over time to build your perfect smart home ecosystem.",
        "The NYX-1 Smart Sensor has a 24-month battery life under normal usage conditions. It's designed for maximum efficiency and minimal maintenance.",
        "Yes! All NYX products are compatible with Apple HomeKit, Google Home, and Amazon Alexa. You can control everything from your preferred voice assistant.",
        "Setting up NYX devices is incredibly simple. Just power on the device, open the NYX app, and follow the guided setup process. Most devices are ready in under 5 minutes.",
        "NYX products come with a comprehensive 2-year warranty covering any manufacturing defects. We also offer lifetime software updates for all our devices.",
        "The Adaptive AI Learning feature learns your household patterns over time to reduce false triggers and anticipate your needs, making your smart home truly intelligent."
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setResponse(randomResponse);
    } catch (error) {
      setResponse("I'm sorry, I'm having trouble processing your question right now. Please try again later or contact our support team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 md:py-32 bg-dark text-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Ask NYX
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Get instant answers to your questions about NYX products and smart home technology.
            </p>
          </div>

          <div className="bg-nyx-gray rounded-2xl p-8 border border-nyx-gray/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="question" className="block text-white text-lg font-semibold mb-3">
                  What would you like to know?
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about NYX products, smart home setup, compatibility, or troubleshooting..."
                  className="w-full bg-nyx-black border border-gray-700 rounded-lg py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nyx-blue h-32 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full bg-nyx-blue text-nyx-black font-bold py-4 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? 'Thinking...' : 'Ask NYX'}
              </button>
            </form>

            {response && (
              <div className="mt-8 p-6 bg-nyx-black rounded-lg border border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-nyx-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-nyx-black font-bold text-sm">N</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">NYX Assistant</h3>
                    <p className="text-gray-300 leading-relaxed">{response}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-nyx-black rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-3">Popular Questions</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• How do I set up my first NYX device?</li>
                  <li>• Are NYX products compatible with Alexa?</li>
                  <li>• What's the battery life of the NYX-1 sensor?</li>
                  <li>• Can I control multiple devices from one app?</li>
                </ul>
              </div>
              
              <div className="bg-nyx-black rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-3">Need More Help?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <button
                  onClick={() => navigateTo('contact')}
                  className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskNyxPage;