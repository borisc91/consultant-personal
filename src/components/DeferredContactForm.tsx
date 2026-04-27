"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ContactFormLabels } from "@/components/ContactForm";

const LazyContactForm = dynamic(
  () => import("@/components/ContactForm").then((module) => module.ContactForm),
  { ssr: false }
);

type DeferredContactFormProps = {
  formLabels: ContactFormLabels;
};

export function DeferredContactForm({ formLabels }: DeferredContactFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || shouldLoad) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <LazyContactForm formLabels={formLabels} /> : <ContactFormShell formLabels={formLabels} />}
    </div>
  );
}

function ContactFormShell({ formLabels }: DeferredContactFormProps) {
  return (
    <form className="space-y-6" aria-hidden="true">
      <input type="hidden" name="startedAt" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-shell">Website</label>
        <input id="website-shell" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="space-y-2">
        <label htmlFor="name-shell" className="text-sm font-medium text-slate-300">{formLabels.nameLabel}</label>
        <input
          type="text"
          id="name-shell"
          name="name"
          tabIndex={-1}
          maxLength={80}
          autoComplete="name"
          className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
          placeholder={formLabels.namePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email-shell" className="text-sm font-medium text-slate-300">{formLabels.emailLabel}</label>
        <input
          type="email"
          id="email-shell"
          name="email"
          tabIndex={-1}
          maxLength={120}
          autoComplete="email"
          className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
          placeholder={formLabels.emailPlaceholder}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="url-shell" className="text-sm font-medium text-slate-300">{formLabels.urlLabel}</label>
        <input
          type="url"
          id="url-shell"
          name="url"
          tabIndex={-1}
          maxLength={240}
          autoComplete="url"
          className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
          placeholder={formLabels.urlPlaceholder}
        />
      </div>

      <div className="space-y-2 pt-2">
        <label htmlFor="message-shell" className="text-sm font-medium text-slate-300">{formLabels.messageLabel}</label>
        <textarea
          id="message-shell"
          name="message"
          rows={4}
          tabIndex={-1}
          minLength={20}
          maxLength={3000}
          className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none mb-6"
          placeholder={formLabels.messagePlaceholder}
        />
      </div>

      <div className="pt-4">
        <button
          type="button"
          tabIndex={-1}
          className="group flex items-center justify-center gap-2 w-full bg-white text-slate-900 px-8 py-4 rounded-xl text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {formLabels.submitLabel}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
