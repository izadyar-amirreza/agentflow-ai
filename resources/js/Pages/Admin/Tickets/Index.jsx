import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, tickets }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard - All Tickets</h2>}
        >
            <Head title="Admin - All Tickets" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-4">Total Tickets: {tickets.length}</h3>
                            
                            <div className="space-y-4">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-blue-600">{ticket.subject}</h4>
                                            <p className="text-sm text-gray-500">
                                                Created by: {ticket.user?.name || 'Unknown'} | Status: {ticket.status || 'Open'}
                                            </p>
                                        </div>
                                        <Link 
                                            href={route('tickets.show', ticket.id)} 
                                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                                        >
                                            View Chat
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}