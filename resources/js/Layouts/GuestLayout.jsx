import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-6 sm:justify-center sm:pt-0 text-slate-100">
            {/* Logo wrapper with center alignment */}
            <div className="flex w-full justify-center mb-2">
                <Link href="/" className="hover:opacity-90 transition-opacity">
                    {/* Previous size restrictions removed so the icon and text render correctly in the center */}
                    <ApplicationLogo className="scale-110 transform transition hover:scale-105 duration-300" />
                </Link>
            </div>

            {/* Dark glassmorphism form container */}
            <div className="mt-8 w-full overflow-hidden bg-slate-900/50 border border-white/10 px-8 py-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}