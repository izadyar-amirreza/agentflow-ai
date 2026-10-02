import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, tickets }) {
    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-200">Admin Dashboard: All Tickets</h2>}
        >
            <Head title="Admin Tickets" />

            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
                
                {/* Stats / Overview */}
                <div className="mb-6 bg-blue-900/50 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-blue-200 font-medium">Total Tickets in System: {tickets.length}</p>
                </div>

                {/* All Tickets Table */}
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-gray-900 text-gray-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Subject</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No tickets in the system yet.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4">#{ticket.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-200">{ticket.user?.name}</div>
                                            <div className="text-xs text-gray-500">{ticket.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('admin.tickets.show', ticket.id)} 
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
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
        </AuthenticatedLayout>
    );
}