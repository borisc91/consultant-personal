import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ResultsStrip } from "@/components/ResultsStrip";
import { Services } from "@/components/Services";
import { ToolsStrip } from "@/components/ToolsStrip";
import { CaseStudies } from "@/components/CaseStudies";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  absoluteUrl,
  findRoute,
  getAllRouteParams,
  getAlternateLinks,
  getCaseStudyCards,
  getCaseStudyContent,
  getHomeContent,
  getSiteStructure,
  type Locale,
  type SitePage,
} from "@/lib/content";

type Props = {
  params: Promise<{ segments?: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRouteParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;
  const route = findRoute(segments);

  if (!route) {
    return {};
  }

  const alternates = getAlternateLinks(route.page);

  return {
    title: route.page.titles[route.locale],
    alternates: {
      canonical: absoluteUrl(route.page.paths[route.locale]),
      languages: Object.fromEntries(
        alternates.map((link) => [link.hreflang, link.href])
      ),
    },
  };
}

export default async function Page({ params }: Props) {
  const { segments } = await params;
  const route = findRoute(segments);

  if (!route) {
    notFound();
  }

  const homeContent = getHomeContent(route.locale);
  const languageLinks = buildLanguageLinks(route.page, route.locale);
  const navItems = buildNavItems(route.locale);

  if (route.page.type === "home") {
    return (
      <>
        <Navbar navItems={navItems} languageLinks={languageLinks} />
        <main className="flex-1 w-full flex flex-col">
          <Hero
            headingLineOne={homeContent.headingLineOne}
            headingLineTwo={homeContent.headingLineTwo}
            intro={homeContent.intro}
            primaryCta={homeContent.primaryCta}
            secondaryCta={homeContent.secondaryCta}
            locale={route.locale}
            videoSrc="/video-increase-traffic.optimized.mp4"
            videoWebmSrc="/video-increase-traffic.optimized.webm"
            videoPosterSrc="/video-increase-traffic-poster.jpg"
          />
          <ResultsStrip stats={homeContent.results} />
          <Services
            heading={homeContent.capabilitiesHeading}
            subtext={homeContent.capabilitiesSubtext}
            services={homeContent.capabilities}
          />
          <ToolsStrip heading={homeContent.toolsHeading} tools={homeContent.tools} />
          <CaseStudies
            heading={homeContent.caseStudiesHeading}
            subtext={homeContent.caseStudiesSubtext}
            viewAllLabel={homeContent.caseStudiesCta}
            viewAllHref="/case-studies"
            cases={getCaseStudyCards(route.locale)}
          />
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            directEmailLabel={homeContent.directEmailLabel}
            email={homeContent.email}
          />
        </div>
        <Footer languageLinks={languageLinks} />
      </>
    );
  }

  if (route.page.type === "case-studies-index") {
    return (
      <>
        <Navbar navItems={navItems} languageLinks={languageLinks} />
        <main className="flex-1 w-full flex flex-col pt-20">
          <CaseStudies
            heading={homeContent.caseStudiesHeading}
            subtext={homeContent.caseStudiesSubtext}
            viewAllLabel={homeContent.caseStudiesCta}
            viewAllHref="/case-studies"
            cases={getCaseStudyCards(route.locale)}
          />
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            directEmailLabel={homeContent.directEmailLabel}
            email={homeContent.email}
          />
        </div>
        <Footer languageLinks={languageLinks} />
      </>
    );
  }

  if (route.page.type === "case-study" && route.page.slug) {
    const caseStudy = getCaseStudyContent(route.locale, route.page.slug);

    if (!caseStudy) {
      notFound();
    }

    return (
      <>
        <Navbar navItems={navItems} languageLinks={languageLinks} />
        <main className="flex-1 w-full bg-white pt-32 pb-24 px-6">
          <article className="max-w-3xl mx-auto">
            <p className="font-mono text-xs tracking-widest text-slate-400 uppercase mb-6">
              {route.page.industry}
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight text-slate-900 mb-8">
              {caseStudy.title}
            </h1>
            {caseStudy.dek ? (
              <p className="text-xl text-slate-600 leading-relaxed border-y border-slate-200 py-6 mb-12">
                {caseStudy.dek}
              </p>
            ) : null}
            <MarkdownContent markdown={caseStudy.bodyMarkdown} />
          </article>
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            directEmailLabel={homeContent.directEmailLabel}
            email={homeContent.email}
          />
        </div>
        <Footer languageLinks={languageLinks} />
      </>
    );
  }

  if (route.page.type === "contact") {
    return (
      <>
        <Navbar navItems={navItems} languageLinks={languageLinks} />
        <main className="flex-1 w-full bg-white pt-20">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            directEmailLabel={homeContent.directEmailLabel}
            email={homeContent.email}
          />
        </main>
        <Footer languageLinks={languageLinks} />
      </>
    );
  }

  notFound();
}

function buildLanguageLinks(page: SitePage, activeLocale: Locale) {
  return getSiteStructure().config.locales.map((locale) => ({
    label: locale.toUpperCase(),
    href: page.paths[locale],
    active: locale === activeLocale,
  }));
}

function buildNavItems(locale: Locale) {
  const homePath = findPagePath("home", locale);

  return [
    { label: "Case Studies", href: findPagePath("case-studies-hub", locale) },
    { label: "Capabilities", href: `${homePath === "/" ? "" : homePath}#services` },
    { label: "Contact", href: findPagePath("contact", locale) },
  ];
}

function findPagePath(id: string, locale: Locale) {
  const page = getSiteStructure().pages.find((candidate) => candidate.id === id);

  return page?.paths[locale] ?? "/";
}
