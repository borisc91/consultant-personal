"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export type ContactFormLabels = {
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

type ContactFormProps = {
  formLabels: ContactFormLabels;
};

export function ContactForm({ formLabels }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const startedAtRef = useRef<HTMLInputElement>(null);
  const isSending = status === "sending";
  const statusMessageId = "contact-form-status";

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
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      aria-busy={isSending}
      aria-describedby={status === "success" || status === "error" ? statusMessageId : undefined}
    >
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
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
        {status === "success" ? (
          <p id={statusMessageId} className="mt-4 text-sm text-emerald-300" role="status">
            {formLabels.successMessage}
          </p>
        ) : null}
        {status === "error" ? (
          <p id={statusMessageId} className="mt-4 text-sm text-red-300" role="alert">
            {formLabels.errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
