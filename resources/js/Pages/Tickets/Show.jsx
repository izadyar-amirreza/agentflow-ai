import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef } from 'react';

export default function Show({ auth, ticket, messages }) {
    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submit = (e) => {
        e.preventDefault();
        post(route('tickets.messages.store', ticket.id), {
            onSuccess: () => reset('body'),
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
                                            <div className={`max-w-[75%] px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                                <p className="text-sm">{message.body}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="border-t p-4 bg-white">
                                <form onSubmit={submit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        disabled={processing}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || !data.body.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Sending...' : 'Send'}
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