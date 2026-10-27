import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, tickets }) {
    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-white leading-tight">Admin Dashboard: All Tickets</h2>}
        >
            <Head title="Admin Tickets" />

            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
                
                {/* Stats / Overview */}
                <div className="mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/40 p-5 shadow-xl backdrop-blur flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">System Analytics</p>
                        <p className="text-xl font-bold text-white mt-1">Total Tickets in System: {tickets.length}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                        Admin Mode
                    </span>
                </div>

                {/* All Tickets Table */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                    <th className="px-6 py-4 font-semibold">Created At</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No tickets in the system yet.
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-400">#{ticket.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{ticket.user?.name}</div>
                                                <div className="text-xs text-slate-400">{ticket.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-200">{ticket.subject}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={route('admin.tickets.show', ticket.id)} 
                                                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow transition inline-block"
                                                >
                                                    Take Over
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}