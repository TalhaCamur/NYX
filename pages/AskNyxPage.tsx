import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import CloseIcon from '../components/icons/CloseIcon';

interface AskNyxProps {
    isOpen: boolean;
    onClose: () => void;
}

const AskNyx: React.FC<AskNyxProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const examplePrompts = [
        "Compare the NYX-Sensor and the NYX-Cam.",
        "How many colors does the NYX-Bulb support?",
        "Can I schedule the NYX-Plug to turn on and off?",
        "What's the warranty on NYX products?"
    ];
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
           document.body.style.overflow = 'auto';
           window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);


    const handlePromptSubmit = async (currentPrompt: string) => {
        if (!currentPrompt || isLoading) return;

        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const stream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: currentPrompt,
                config: {
                    systemInstruction: "You are a sophisticated AI assistant for NYX Smart Home, a premium technology brand. Your expertise is in our smart home product line, which includes the NYX-1 Smart PIR Motion Sensor, NYX-Bulb, NYX-Plug, and NYX-Cam. You are knowledgeable, elegant, and helpful. Always maintain a professional and slightly futuristic tone. Answer questions about product features, specifications, compatibility, and design philosophy. Keep your answers concise and well-formatted. Do not answer questions outside of this scope.",
                },
            });

            for await (const chunk of stream) {
                setResponse(prev => prev + chunk.text);
            }

        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching the response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handlePromptSubmit(prompt);
    };

    const handleExampleClick = (example: string) => {
        setPrompt(example);
        handlePromptSubmit(example);
    }

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div 
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-3xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="ask-nyx-title"
            >
                <div className="bg-dark rounded-2xl border border-white/10 shadow-2xl shadow-brand-purple/20 flex flex-col max-h-[90vh]">
                    <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                         <h2 id="ask-nyx-title" className="text-xl font-semibold bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                            Intelligence at your service.
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <div className="p-8 text-center overflow-y-auto">
                        <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                           Have a question about a NYX product? Our AI assistant has the answers.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask anything about NYX products..."
                                className="flex-grow bg-dark-accent border border-gray-600 rounded-full py-4 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/80 transition-shadow duration-300"
                                required
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-4 px-8 rounded-full hover:shadow-lg hover:shadow-brand-purple/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Thinking...' : 'Ask'}
                            </button>
                        </form>

                        <div className="text-left bg-dark-accent border border-white/10 p-6 rounded-lg mt-8 min-h-[200px] w-full max-w-3xl mx-auto whitespace-pre-wrap flex flex-col justify-center">
                            {isLoading && !response && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="w-full bg-dark rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-brand-purple to-brand-pink h-1.5 w-1/2 animate-scanner"></div>
                                    </div>
                                </div>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            {response && <p className="text-gray-200 text-lg leading-relaxed">{response}</p>}
                            {!isLoading && !response && !error && (
                                 <div>
                                    <p className="text-gray-400 mb-4">Or try one of these examples:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {examplePrompts.map(ex => (
                                            <button 
                                                key={ex} 
                                                onClick={() => handleExampleClick(ex)}
                                                className="bg-dark-accent border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-full transition-all duration-300 hover:border-brand-purple/50 hover:text-white hover:shadow-lg hover:shadow-brand-purple/25 transform hover:-translate-y-px"
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AskNyx;