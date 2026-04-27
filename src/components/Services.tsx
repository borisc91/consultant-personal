type ServicesProps = {
  heading: string;
  subtext: string;
  services: Array<{
    num: string;
    tagLeft: string;
    tagRight: string;
    title: string;
    desc: string;
  }>;
};

export function Services({ heading, subtext, services }: ServicesProps) {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-slate-50 px-6 py-20 md:py-24 xl:py-28 2xl:py-32">
      <div className="mx-auto max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="mb-12 md:mb-14 lg:mb-16 2xl:mb-24">
          <h2 id="services-heading" className="mb-5 font-display text-4xl tracking-tight text-slate-900 md:text-[2.65rem] 2xl:text-5xl">
            {heading}
          </h2>
          {subtext ? (
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-[17px] 2xl:text-lg">
              {subtext}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden gap-[1px]" role="list">
          {services.map((service, index) => (
            <div 
              key={index}
              role="listitem"
              className="group flex h-full flex-col bg-white p-7 transition-colors duration-300 hover:bg-slate-50/80 md:p-8 lg:p-9 xl:p-10 2xl:p-12"
            >
              <div className="mb-7 flex items-center justify-between lg:mb-8 2xl:mb-10">
                <span className="font-mono text-xs text-slate-500 tracking-wider">
                  {service.num} &mdash; {service.tagLeft}
                </span>
                <span className="font-mono text-xs text-slate-400 tracking-wider">
                  {service.tagRight}
                </span>
              </div>
              
              <h3 className="mb-3 text-xl font-medium tracking-tight text-slate-900 transition-colors group-hover:text-blue-900 lg:text-[1.35rem] 2xl:mb-4 2xl:text-2xl">
                {service.title}
              </h3>
              
              <p className="mb-9 flex-grow text-[13.5px] leading-[1.6] text-slate-600 2xl:mb-12 2xl:text-[14px]">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
