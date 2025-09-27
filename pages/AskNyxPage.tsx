import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import CloseIcon from '../components/icons/CloseIcon';

interface AskNyxProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" {...props}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
);


interface Message {
    role: 'user' | 'model';
    content: string;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
    </div>
);

const AskNyx = ({ isOpen, onClose }: AskNyxProps) => {
    const [prompt, setPrompt] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const examplePrompts = [
        "Compare the NYX-Sensor and the NYX-Cam.",
        "How many colors does the NYX-Bulb support?",
        "Tell me an interesting piece of tech news.",
        "What is the warranty period for NYX products?"
    ];

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation, isLoading]);
    
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

        const newUserMessage: Message = { role: 'user', content: currentPrompt };
        const updatedConversation = [...conversation, newUserMessage];
        setConversation(updatedConversation);
        setPrompt('');
        setIsLoading(true);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const apiHistory = updatedConversation.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            }));
            // Remove the last user message from history because it's the new prompt
            apiHistory.pop(); 
            const lastUserContent = updatedConversation[updatedConversation.length - 1].content;

            const stream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: [...apiHistory, { role: 'user', parts: [{ text: lastUserContent }] }],
            });
            
            let modelResponse = '';
            // Add a placeholder for the model's response
            setConversation(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setConversation(prev => {
                    const newConv = [...prev];
                    newConv[newConv.length - 1].content = modelResponse;
                    return newConv;
                });
            }

        } catch (err) {
            console.error(err);
            const errorMessage = 'An error occurred. Please try again.';
            setError(errorMessage);
            setConversation(prev => [...prev, { role: 'model', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handlePromptSubmit(prompt);
    };

    const handleExampleClick = (example: string) => {
        setPrompt('');
        handlePromptSubmit(example);
    }

    const handleClearChat = () => {
        setConversation([]);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div 
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-2xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="ask-nyx-title"
            >
                <div className="bg-dark rounded-2xl border border-white/10 shadow-2xl shadow-brand-purple/20 flex flex-col h-[85vh] max-h-[700px]">
                    <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                         <h2 id="ask-nyx-title" className="text-xl font-semibold bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                            NYX AI
                        </h2>
                        <div className="flex items-center gap-2">
                             <button onClick={handleClearChat} className="text-gray-400 hover:text-white" aria-label="Clear Chat">
                                <ClearIcon className="w-6 h-6" />
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </header>
                    <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-6">
                        {conversation.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <span className="text-5xl font-bold tracking-widest bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text mb-4">
                                    NYX
                                </span>
                                <p className="text-xl text-gray-300 mb-8">Hello! I'm NYX AI. How can I help you?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                    {examplePrompts.map(ex => (
                                        <button 
                                            key={ex} 
                                            onClick={() => handleExampleClick(ex)}
                                            className="bg-dark-accent border border-white/10 text-gray-300 text-sm px-4 py-3 rounded-lg text-left transition-all duration-300 hover:border-brand-purple/50 hover:text-white"
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            conversation.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-lg px-4 py-3 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-brand-purple text-white rounded-br-none' : 'bg-dark-accent text-gray-200 rounded-bl-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-lg px-4 py-3 rounded-2xl bg-dark-accent text-gray-300 rounded-bl-none">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                         {error && !isLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-lg px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 rounded-bl-none border border-red-500/30">
                                    {error}
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="p-4 border-t border-white/10 flex-shrink-0">
                         <form onSubmit={handleSubmit} className="flex items-center gap-3">
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Send a message to NYX AI..."
                                className="flex-grow bg-dark-accent border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/80"
                                required
                                disabled={isLoading}
                                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
                            />
                            <button 
                                type="submit" 
                                className="bg-brand-purple text-white p-3 rounded-full hover:bg-brand-purple/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                                disabled={isLoading || !prompt.trim()}
                                aria-label="Send"
                            >
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default AskNyx;