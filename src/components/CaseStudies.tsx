import Link from "next/link";

type CaseStudiesProps = {
  heading: string;
  subtext: string;
  viewAllLabel: string;
  viewAllHref: string;
  cases: Array<{
    industry: string;
    title: string;
    summary: string;
    href: string;
  }>;
};

export function CaseStudies({
  heading,
  subtext,
  viewAllLabel,
  viewAllHref,
  cases,
}: CaseStudiesProps) {
  return (
    <section id="case-studies" className="py-24 md:py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <div>
            <h2 className="font-editorial text-6xl md:text-7xl italic tracking-tight text-slate-900 mb-6">
              {heading}
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {subtext}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cases.map((study, i) => (
            <div 
              key={i}
              className="group flex flex-col h-full bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-300"
            >
              <div className="mb-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-wider bg-white border border-slate-200 text-slate-500 mb-6 uppercase">
                  {study.industry}
                </span>
                
                <h3 className="text-2xl font-display leading-tight text-slate-900 mb-6 group-hover:text-blue-900 transition-colors">
                  {study.title}
                </h3>
                
                <p className="text-base text-slate-600 leading-relaxed">
                  {study.summary}
                </p>
              </div>

              <Link
                href={study.href}
                className="mt-auto inline-flex w-fit text-sm font-medium text-accent hover:text-slate-900 transition-colors"
              >
                Read case study &rarr;
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex text-sm font-medium text-accent hover:text-slate-900 transition-colors"
          >
            {viewAllLabel} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
