import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, tickets }) {
    // Inertia form helper for creating a new ticket
    const { data, setData, post, processing, reset } = useForm({
        subject: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Send POST request to create ticket, reset input on success
        post(route('tickets.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-200">My Tickets</h2>}>
            <Head title="My Tickets" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8">
                
                {/* Create New Ticket Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-700">
                    <form onSubmit={submit} className="flex gap-4">
                        <input
                            type="text"
                            value={data.subject}
                            onChange={e => setData('subject', e.target.value)}
                            placeholder="Enter ticket subject..."
                            className="bg-gray-900 border-gray-700 text-white rounded-md flex-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <button 
                            disabled={processing} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </form>
                </div>

                {/* Tickets List */}
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                    {tickets.length === 0 ? (
                        <p className="p-6 text-gray-400 text-center">No tickets found.</p>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket.id} className="border-b border-gray-700 p-4 flex justify-between items-center hover:bg-gray-750">
                                <span className="text-gray-200 font-medium">{ticket.subject}</span>
                                <Link 
                                    href={route('tickets.show', ticket.id)} 
                                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    View Chat
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}