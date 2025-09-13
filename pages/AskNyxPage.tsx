import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AskNyxPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const examplePrompts = [
        "What is the battery life of the NYX sensor?",
        "Is it compatible with Apple HomeKit?",
        "What materials is the device made from?",
        "Explain the 'Adaptive AI Learning' feature."
    ];

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
                    systemInstruction: "You are a sophisticated AI assistant for NYX Smart Home, a premium technology brand. Your expertise is in our smart home products, particularly the NYX PIR Motion Sensor Light. You are knowledgeable, elegant, and helpful. Always maintain a professional and slightly futuristic tone. Answer questions about the product's features, specifications, compatibility, and design philosophy. Keep your answers concise and well-formatted. Do not answer questions outside of this scope.",
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

    return (
        <section className="py-20 md:py-32 bg-dark">
            <div className="container mx-auto px-4 text-center max-w-4xl">
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                        Intelligence at your service.
                    </span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-12">
                   Have a question about the NYX-1? Our AI assistant has the answers. From technical specs to design philosophy, get the details you need.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask anything about the NYX-1..."
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

                <div className="text-left bg-dark-accent border border-white/10 p-8 rounded-lg mt-12 min-h-[250px] w-full max-w-3xl mx-auto whitespace-pre-wrap flex flex-col justify-center">
                    {isLoading && !response && (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-full bg-dark rounded-full h-1.5">
                                <div className="bg-brand-purple h-1.5 rounded-full animate-pulse"></div>
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
                                        className="bg-dark border border-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full hover:bg-gray-800 hover:border-brand-purple transition-colors"
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AskNyxPage;