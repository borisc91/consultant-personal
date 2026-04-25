"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

type NavbarProps = {
  navItems: Array<{ label: string; href: string }>;
  languageLinks: Array<{ label: string; href: string; active: boolean }>;
};

export function Navbar({ navItems, languageLinks }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Elegant quick fade down for the navbar
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display font-medium text-2xl tracking-tight text-slate-900">
          Boris.
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900 transition-colors">
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
          
          <div className="flex gap-3 text-xs tracking-wider">
            {languageLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={link.active ? "text-slate-900 cursor-pointer" : "text-slate-400 hover:text-slate-900 cursor-pointer transition-colors"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
