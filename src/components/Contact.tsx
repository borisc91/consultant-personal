"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

type ContactProps = {
  heading: string;
  copy: string;
  formLabels: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    urlLabel: string;
    urlPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    sendingLabel: string;
    successMessage: string;
    errorMessage: string;
  };
};

export function Contact({
  heading,
  copy,
  formLabels,
}: ContactProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const startedAtRef = useRef<HTMLInputElement>(null);
  const isSending = status === "sending";

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = Date.now().toString();
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-slate-900 text-white rounded-t-[2.5rem]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Side: Copy */}
        <div className="space-y-8">
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white mb-6">
            {heading}
          </h2>
          <p className="text-xl text-slate-300 max-w-md leading-relaxed">
            {copy}
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input ref={startedAtRef} type="hidden" name="startedAt" />
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">{formLabels.nameLabel}</label>
              <input 
                type="text" 
                id="name"
                name="name"
                required
                maxLength={80}
                autoComplete="name"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder={formLabels.namePlaceholder}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">{formLabels.emailLabel}</label>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                maxLength={120}
                autoComplete="email"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder={formLabels.emailPlaceholder}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-slate-300">{formLabels.urlLabel}</label>
              <input 
                type="url" 
                id="url"
                name="url"
                maxLength={240}
                autoComplete="url"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder={formLabels.urlPlaceholder}
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-300">{formLabels.messageLabel}</label>
              <textarea 
                id="message"
                name="message"
                rows={4}
                required
                minLength={20}
                maxLength={3000}
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none mb-6"
                placeholder={formLabels.messagePlaceholder}
              />
            </div>
            
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSending}
                className="group flex items-center justify-center gap-2 w-full bg-white text-slate-900 px-8 py-4 rounded-xl text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSending ? formLabels.sendingLabel : formLabels.submitLabel}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {status === "success" ? (
                <p className="mt-4 text-sm text-emerald-300" role="status">
                  {formLabels.successMessage}
                </p>
              ) : null}
              {status === "error" ? (
                <p className="mt-4 text-sm text-red-300" role="alert">
                  {formLabels.errorMessage}
                </p>
              ) : null}
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
