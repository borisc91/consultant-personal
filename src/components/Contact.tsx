import { DeferredContactForm } from "@/components/DeferredContactForm";
import type { ContactFormLabels } from "@/components/ContactForm";

type ContactProps = {
  heading: string;
  copy: string;
  formLabels: ContactFormLabels;
};

export function Contact({
  heading,
  copy,
  formLabels,
}: ContactProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-24 md:py-32 px-6 bg-slate-900 text-white rounded-t-[2.5rem]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div className="space-y-8">
          <h2 id="contact-heading" className="font-display text-5xl md:text-7xl tracking-tight text-white mb-6">
            {heading}
          </h2>
          <p className="text-xl text-slate-300 max-w-md leading-relaxed">
            {copy}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700" aria-label="Contact form">
          <DeferredContactForm formLabels={formLabels} />
        </div>
      </div>
    </section>
  );
}
