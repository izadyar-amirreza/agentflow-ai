import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect, useRef } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Show({ auth, ticket, messages }) {
    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const messagesEndRef = useRef(null);

    // Add this state to track AI response status
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submit = (e) => {
        e.preventDefault();
        
        post(route('tickets.messages.store', ticket.id), {
            preserveScroll: true, // Prevents page from jumping to top
            onStart: () => {
                setIsTyping(true); // Show typing animation
            },
            onSuccess: () => {
                reset('body'); // Clear the input field
            },
            onFinish: () => {
                setIsTyping(false); // Hide typing animation
            }
        });
    };

    return (
        <>
            <Head title={`Ticket: ${ticket.subject}`} />
            
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ticket: {ticket.subject}</h2>}
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col h-[600px]">
                            
                           <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                {messages.length === 0 ? (
                                    <p className="text-center text-gray-400 mt-20">No messages yet. Start the conversation...</p>
                                ) : (
                                    messages.map((message) => (
                                        <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {/* Increased max-width to 85% to give code blocks more space */}
                                            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                                
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    className="text-sm space-y-2 leading-relaxed"
                                                    components={{
                                                        // Style links
                                                        a: ({node, ...props}) => <a className="underline font-semibold hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                                                        // Style bold text
                                                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                        // Style lists
                                                        ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                                                        ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                                                        // Style code blocks (inline and multiline)
                                                        code: ({node, inline, children, ...props}) => (
                                                            inline ? (
                                                                <code className="bg-black/10 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                                                            ) : (
                                                                <div className="bg-gray-800 text-gray-200 p-3 rounded-md overflow-x-auto my-2 text-left w-full" dir="ltr">
                                                                    <code className="font-mono text-sm" {...props}>{children}</code>
                                                                </div>
                                                            )
                                                        )
                                                    }}
                                                >
                                                    {message.body}
                                                </ReactMarkdown>

                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            {/* AI Typing Indicator - Rendered only when isTyping is true */}
                            {isTyping && (
                                <div className="flex justify-start mb-4 px-6">
                                    <div className="bg-gray-700 text-gray-200 rounded-lg px-4 py-3 shadow-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div className="border-t p-4 bg-white">
                                <form onSubmit={submit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder={isTyping ? "AI is thinking..." : "Type your message..."}
                                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        disabled={processing || isTyping}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || isTyping || !data.body.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isTyping ? 'Thinking...' : 'Send'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}