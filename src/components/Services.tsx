type ServicesProps = {
  heading: string;
  subtext: string;
  services: Array<{
    num: string;
    tagLeft: string;
    tagRight: string;
    title: string;
    desc: string;
    linkText: string;
  }>;
};

export function Services({ heading, subtext, services }: ServicesProps) {
  return (
    <section id="services" className="py-24 md:py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-slate-900 mb-6">
            {heading}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            {subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden gap-[1px]">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white p-8 md:p-12 hover:bg-slate-50/80 transition-colors duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-mono text-xs text-slate-500 tracking-wider">
                  {service.num} &mdash; {service.tagLeft}
                </span>
                <span className="font-mono text-xs text-slate-400 tracking-wider">
                  {service.tagRight}
                </span>
              </div>
              
              <h3 className="text-2xl font-medium text-slate-900 tracking-tight mb-4 group-hover:text-blue-900 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-[14px] text-slate-600 leading-[1.6] mb-12 flex-grow">
                {service.desc}
              </p>
              
              <div className="mt-auto flex items-center text-slate-500 font-mono text-xs transition-colors group-hover:text-blue-600 cursor-pointer">
                <span className="mr-3 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-300">&rarr;</span>
                {service.linkText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
