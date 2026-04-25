type ResultsStripProps = {
  stats: Array<{ label: string; value: string }>;
};

export function ResultsStrip({ stats }: ResultsStripProps) {
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200 bg-white">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(226,232,240,0.4),rgba(14,165,233,0.16),rgba(14,165,233,0.9),rgba(45,212,191,0.58),rgba(14,165,233,0.16),rgba(226,232,240,0.4))] bg-[length:180%_100%] animate-editorial-blue-sweep" />
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,rgba(226,232,240,0.4),rgba(45,212,191,0.14),rgba(14,165,233,0.78),rgba(45,212,191,0.52),rgba(14,165,233,0.14),rgba(226,232,240,0.4))] bg-[length:180%_100%] animate-editorial-blue-sweep-reverse" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(224,242,254,0.28)_42%,rgba(186,230,253,0.38)_50%,rgba(224,242,254,0.28)_58%,transparent_100%)] bg-[length:260%_100%] opacity-55 animate-editorial-blue-sweep pointer-events-none" />
      <div className="relative w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-slate-200">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="group relative min-w-0 px-4 py-6 text-center border-r border-slate-200 even:border-r-0 md:even:border-r md:last:border-r-0 transition-colors duration-300 hover:bg-sky-50/45"
            >
              <span className="absolute inset-y-0 right-0 hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(14,165,233,0.6),rgba(45,212,191,0.32),transparent)] opacity-60 md:block md:last:hidden" />
              <span className="block font-display text-sm md:text-base font-semibold uppercase tracking-normal text-slate-900 mb-4">
                {stat.label}
              </span>
              <span className="block text-base md:text-lg font-semibold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span className="mx-auto mt-5 block h-px w-10 bg-gradient-to-r from-transparent via-sky-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
