type FooterProps = {
  languageLinks: Array<{ label: string; href: string; active: boolean }>;
};

export function Footer({ languageLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();
  // Using fixed date as an example or dynamically output today
  const lastUpdated = new Date().toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
        
        {/* Left: Brand Mark */}
        <div className="font-display font-medium text-2xl tracking-tight text-white">
          Boris.
        </div>
        
        {/* Center: Based in */}
        <div className="text-sm">
          Based in Novi Sad, Serbia.
        </div>
        
        {/* Right: Lang Switcher & Social */}
        <div className="flex items-center gap-6">
          <div className="flex gap-3 text-xs tracking-wider">
            {languageLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.active ? "text-white cursor-pointer" : "hover:text-white cursor-pointer transition-colors"}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <a href="#" className="text-sm hover:text-white transition-colors">
            LinkedIn
          </a>
        </div>

      </div>

      {/* Bottom line */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {currentYear} Boris SEO Consultant. All rights reserved.</p>
        <p>last updated: {lastUpdated}</p>
      </div>
    </footer>
  );
}
