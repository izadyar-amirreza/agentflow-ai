export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`} {...props}>
            {/* The Futuristic Hexagon Glow Icon Card */}
            <div className="relative h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-[#0b0c15] border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] overflow-visible">
                {/* Outter Glow Layer */}
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-[2px] pointer-events-none" />
                
                {/* AI / Hexagon Network SVG Design */}
                <svg className="w-6.5 h-6.5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {/* Outer Hexagon */}
                    <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Inner Hexagon Layer */}
                    <path d="M12 5.5L17.76 8.8V15.2L12 18.5L6.24 15.2V8.8L12 5.5Z" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                    {/* Inner Neural Network Nodes & Star Center */}
                    <path d="M12 8.5V15.5" strokeLinecap="round" />
                    <path d="M9 10.25L15 13.75" strokeLinecap="round" />
                    <path d="M15 10.25L9 13.75" strokeLinecap="round" />
                    {/* Neural Connection Circles */}
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="5.5" r="1" fill="currentColor" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                    <circle cx="17.76" cy="8.8" r="1" fill="currentColor" />
                    <circle cx="6.24" cy="15.2" r="1" fill="currentColor" />
                    <circle cx="17.76" cy="15.2" r="1" fill="currentColor" />
                    <circle cx="6.24" cy="8.8" r="1" fill="currentColor" />
                </svg>
            </div>

            {/* Premium Typography & .AI Dot Branding */}
            <span className="text-xl font-extrabold text-white tracking-tight leading-none">
                AgenticFlow<span className="text-indigo-400 font-bold drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">.ai</span>
            </span>
        </div>
    );
}