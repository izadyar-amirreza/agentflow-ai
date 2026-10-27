import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, tickets }) {
    // Inertia form helper for creating a new ticket
    const { data, setData, post, processing, reset, errors } = useForm({
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
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-white leading-tight">My Tickets</h2>}
        >
            <Head title="My Tickets" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8">
                
                {/* Create New Ticket Form */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Create New Support Ticket</h3>
                    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                                placeholder="Enter ticket subject..."
                                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                            />
                            {errors.subject && (
                                <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                            )}
                        </div>
                        <button 
                            disabled={processing} 
                            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50 transition"
                        >
                            {processing ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </form>
                </div>

                {/* Tickets List */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">Ticket History</h3>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-slate-400 text-sm">No tickets found.</p>
                            <p className="text-slate-500 text-xs mt-1">Create your first ticket above to get assistance.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition">
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium text-white">{ticket.subject}</span>
                                        <p className="text-xs text-slate-400">Ticket #{ticket.id}</p>
                                    </div>
                                    <Link 
                                        href={route('tickets.show', ticket.id)} 
                                        className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
                                    >
                                        View Chat
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}