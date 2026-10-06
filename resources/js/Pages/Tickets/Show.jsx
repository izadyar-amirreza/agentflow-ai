import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect, useRef } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Show({ auth, ticket, messages }) {
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        attachment: null,
    });

    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    
    // Real-time state for messages
    const [localMessages, setLocalMessages] = useState(messages);

    // Sync local state if Inertia passes new props
    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    // Real-time Echo Listener
    useEffect(() => {
        const channel = window.Echo.private(`ticket.${ticket.id}`);

        channel.listen('MessageSent', (e) => {
            setLocalMessages((prev) => {
                // Prevent duplicate messages
                if (prev.find((m) => m.id === e.message.id)) {
                    return prev;
                }
                return [...prev, e.message];
            });
            // Stop typing indicator when a reply arrives
            setIsTyping(false);
        });

        return () => {
            window.Echo.leave(`ticket.${ticket.id}`);
        };
    }, [ticket.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]); // Scroll on new local message

    const submit = (e) => {
        e.preventDefault();
        
        post(route('tickets.messages.store', ticket.id), {
            preserveScroll: true,
            onStart: () => setIsTyping(true),
            onSuccess: () => reset(),
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
                                {localMessages.length === 0 ? (
                                    <p className="text-center text-gray-400 mt-20">No messages yet. Start the conversation...</p>
                                ) : (
                                    localMessages.map((message) => (
                                        <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                                
                                                <div className="text-sm space-y-2 leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            a: ({node, ...props}) => <a className="underline font-semibold hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                            ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                                                            ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                                                            code: ({node, className, children, ...props}) => {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                const isBlock = match || String(children).includes('\n');
                                                                return !isBlock ? (
                                                                    <code className="bg-black/10 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                                                                ) : (
                                                                    <div className="bg-gray-800 text-gray-200 p-3 rounded-md overflow-x-auto my-2 text-left w-full" dir="ltr">
                                                                        <code className="font-mono text-sm" {...props}>{children}</code>
                                                                    </div>
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {message.body}
                                                    </ReactMarkdown>
                                                </div>

                                                {message.attachment && (
                                                    <div className="mt-3 border-t border-gray-400/30 pt-2">
                                                        {message.attachment.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                            <a href={`/storage/${message.attachment}`} target="_blank" rel="noreferrer">
                                                                <img src={`/storage/${message.attachment}`} alt="attachment" className="max-w-[200px] rounded-md shadow-sm hover:opacity-90" />
                                                            </a>
                                                        ) : (
                                                            <a href={`/storage/${message.attachment}`} target="_blank" rel="noreferrer" className="text-sm underline flex items-center gap-1 font-bold">
                                                                📎 Download Attachment
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            
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
                                {ticket.status === 'closed' ? (
                                    <div className="text-center text-red-500 p-3 bg-red-50 rounded-lg font-medium">
                                        This ticket has been closed by an administrator.
                                    </div>
                                ) : (
                                    <form onSubmit={submit} className="flex gap-2 items-center">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('attachment', e.target.files[0])}
                                            className="text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 max-w-[220px]"
                                            disabled={processing || isTyping}
                                        />
                                        
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
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}