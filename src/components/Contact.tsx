import { ArrowRight } from "lucide-react";

type ContactProps = {
  heading: string;
  copy: string;
  directEmailLabel: string;
  email: string;
};

export function Contact({
  heading,
  copy,
  directEmailLabel,
  email,
}: ContactProps) {
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
          
          <div className="pt-12">
            <p className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-widest">
              {directEmailLabel}
            </p>
            <a 
              href={`mailto:${email}`}
              className="text-xl md:text-2xl font-medium text-white hover:text-brand-accent transition-colors underline decoration-slate-600 underline-offset-8"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700">
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
              <input 
                type="text" 
                id="name"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="jane@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-slate-300">Company URL</label>
              <input 
                type="url" 
                id="url"
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="https://company.com"
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
              <textarea 
                id="message"
                rows={4}
                className="w-full bg-slate-800 border-b border-slate-600 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none mb-6"
                placeholder="Tell me about your current SEO challenges..."
              />
            </div>
            
            <div className="pt-4">
              <button 
                type="button"
                className="group flex items-center justify-center gap-2 w-full bg-white text-slate-900 px-8 py-4 rounded-xl text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
