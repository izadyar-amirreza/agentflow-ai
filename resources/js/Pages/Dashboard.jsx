import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard Overview
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-slate-950 min-h-screen text-slate-100">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Banner */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 shadow-xl backdrop-blur">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
                                    AgenticFlow AI Workspace
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Welcome back, {auth?.user?.name || 'User'}!
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                                    Manage your support tickets, interact with AI automated workflows, and monitor system activities in real time.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={route('tickets.index')}
                                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition shadow-indigo-600/20"
                                >
                                    View Tickets
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur shadow-xl">
                            <p className="text-xs font-medium text-slate-400">System Status</p>
                            <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Operational
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur shadow-xl">
                            <p className="text-xs font-medium text-slate-400">Active Workspace</p>
                            <p className="text-lg font-bold text-white mt-1">AgenticFlow AI v1.0</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur shadow-xl">
                            <p className="text-xs font-medium text-slate-400">User Role</p>
                            <p className="text-lg font-bold text-indigo-400 mt-1 capitalize">{auth?.user?.role || 'Member'}</p>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}