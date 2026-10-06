import { useForm, Head, Link } from '@inertiajs/react';
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
        });

        return () => {
            window.Echo.leave(`ticket.${ticket.id}`);
        };
    }, [ticket.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);

    const closeTicket = () => {
        if (confirm('Are you sure you want to close this ticket?')) {
            post(route('admin.tickets.close', ticket.id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tickets.messages.store', ticket.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title={`Admin View: ${ticket.subject}`} />
            
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="font-semibold text-xl text-gray-200 leading-tight">
                                Viewing Ticket: {ticket.subject}
                            </h2>
                            <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase ${
                                ticket.status === 'closed' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                                {ticket.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {ticket.status !== 'closed' && (
                                <button 
                                    onClick={closeTicket}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm transition"
                                >
                                    Close Ticket
                                </button>
                            )}
                            <Link 
                                href={route('admin.tickets.index')} 
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        
                        <div className="mb-4 bg-red-900/50 border border-red-500/50 p-4 rounded-lg flex items-center gap-3">
                            <span className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            <p className="text-red-200 text-sm">
                                <strong>Human Takeover Mode:</strong> Any message you send here will permanently stop the AI from replying to this ticket.
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 overflow-hidden shadow-sm sm:rounded-lg flex flex-col h-[600px]">
                            
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-800">
                                {localMessages.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-20">No messages yet.</p>
                                ) : (
                                    localMessages.map((message) => (
                                        <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                                                message.role === 'user' 
                                                ? 'bg-gray-700 text-gray-200 rounded-bl-none' 
                                                : 'bg-blue-600 text-white rounded-br-none'
                                            }`}>
                                                
                                                <div className="text-xs text-gray-400 mb-1">
                                                    {message.role === 'user' ? ticket.user.name : 'System / Support'}
                                                </div>

                                                <div className="text-sm space-y-2 leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            a: ({node, ...props}) => <a className="underline font-semibold hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                            code: ({node, className, children, ...props}) => {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                const isBlock = match || String(children).includes('\n');
                                                                return !isBlock ? (
                                                                    <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                                                                ) : (
                                                                    <div className="bg-black text-gray-200 p-3 rounded-md overflow-x-auto my-2 text-left w-full" dir="ltr">
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
                                                    <div className="mt-3 border-t border-gray-600/50 pt-2">
                                                        {message.attachment.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                            <a href={`/storage/${message.attachment}`} target="_blank" rel="noreferrer">
                                                                <img src={`/storage/${message.attachment}`} alt="attachment" className="max-w-[200px] rounded-md shadow-sm hover:opacity-90" />
                                                            </a>
                                                        ) : (
                                                            <a href={`/storage/${message.attachment}`} target="_blank" rel="noreferrer" className="text-sm text-blue-300 underline flex items-center gap-1 font-bold">
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
                            
                            <div className="border-t border-gray-700 p-4 bg-gray-900">
                                {ticket.status === 'closed' ? (
                                    <div className="text-center text-red-400 p-2 bg-red-900/30 rounded-lg">
                                        This ticket is closed. You can no longer send messages.
                                    </div>
                                ) : (
                                    <form onSubmit={submit} className="flex gap-2 items-center">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('attachment', e.target.files[0])}
                                            className="text-sm text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 max-w-[220px]"
                                            disabled={processing}
                                        />

                                        <input
                                            type="text"
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Type your admin reply to take over..."
                                            className="flex-1 bg-gray-800 border-gray-700 text-white rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                            disabled={processing}
                                            autoComplete="off"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.body.trim()}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                        >
                                            Send & Take Over
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