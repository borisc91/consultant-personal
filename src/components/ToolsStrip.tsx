import Image from "next/image";
import { 
  SiSemrush, 
  SiGoogleanalytics, 
  SiN8N, 
} from "react-icons/si";

type ToolsStripProps = {
  heading: string;
  tools: string[];
};

function ToolImage({
  src,
  alt,
  className = "h-12 w-auto max-w-16 object-contain",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={48}
      className={className}
      loading="lazy"
      unoptimized={src.endsWith(".svg")}
    />
  );
}

const icons = {
  Ahrefs: (
    <svg viewBox="0 0 100 24" fill="currentColor" className="h-9 w-auto translate-x-3" aria-hidden="true">
      <text x="0" y="18" fontSize="20" fontWeight="800" fontFamily="sans-serif" letterSpacing="-1">ahrefs</text>
    </svg>
  ),
  Semrush: <SiSemrush className="text-5xl" />,
  "Screaming Frog": (
    <ToolImage
      src="/screaming-frog-logo.transparent.png"
      alt="Screaming Frog"
      className="h-14 w-auto max-w-[4.5rem] object-contain"
    />
  ),
  "Google Search Console": (
    <ToolImage src="/GSC_logo-removebg-preview.png" alt="Google Search Console" />
  ),
  "Google Analytics 4": <SiGoogleanalytics className="text-5xl" />,
  n8n: <SiN8N className="text-5xl" />,
  "Claude Code": <ToolImage src="/claude%20logo.svg" alt="Claude Code" />,
};

export function ToolsStrip({ heading, tools }: ToolsStripProps) {
  return (
    <section className="py-20 border-y border-slate-200 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center font-mono text-xs tracking-widest text-slate-400 uppercase mb-12">
          {heading}
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-12 md:gap-x-16 gap-y-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors duration-300"
              title={tool}
            >
              <div className="flex items-center justify-center h-16">
                {icons[tool as keyof typeof icons] ?? tool}
              </div>
              <span className="text-xs font-mono font-medium tracking-wide">
                {tool}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
