import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ResultsStrip } from "@/components/ResultsStrip";
import { Services } from "@/components/Services";
import { DeferredToolsStrip } from "@/components/DeferredToolsStrip";
import { CaseStudies } from "@/components/CaseStudies";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PreloadResources } from "@/components/PreloadResources";
import {
  absoluteUrl,
  findRoute,
  getAllRouteParams,
  getAlternateLinks,
  getCaseStudyCards,
  getCaseStudyContent,
  getCaseStudyFeatureImage,
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
  const homeHref = findPagePath("home", route.locale);
  const footerPrimaryLinks = buildFooterPrimaryLinks(route.locale);
  const footerCaseStudyLinks = getCaseStudyCards(route.locale).map((caseStudy) => ({
    label: caseStudy.title,
    href: caseStudy.href,
  }));
  const footerContactLink = {
    label: getFooterContactLabel(route.locale),
    href: findPagePath("contact", route.locale),
  };

  if (route.page.type === "home") {
    const heroPosterSrc = "/video-increase-traffic-poster.jpg";

    return (
      <>
        <PreloadResources heroPosterSrc={heroPosterSrc} />
        <SkipLink />
        <Navbar navItems={navItems} languageLinks={languageLinks} homeHref={homeHref} />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col">
          <Hero
            headingLineOne={homeContent.headingLineOne}
            headingLineTwo={homeContent.headingLineTwo}
            intro={homeContent.intro}
            primaryCta={homeContent.primaryCta}
            secondaryCta={homeContent.secondaryCta}
            locale={route.locale}
            videoSrc="/video-increase-traffic.optimized.mp4"
            videoWebmSrc="/video-increase-traffic.optimized.webm"
            videoPosterSrc={heroPosterSrc}
          />
          <ResultsStrip stats={homeContent.results} />
          <Services
            heading={homeContent.capabilitiesHeading}
            subtext={homeContent.capabilitiesSubtext}
            services={homeContent.capabilities}
          />
          <DeferredToolsStrip
            label={homeContent.toolsLabel}
            heading={homeContent.toolsHeading}
            subtext={homeContent.toolsSubtext}
            tools={homeContent.tools}
          />
          <CaseStudies
            heading={homeContent.caseStudiesHeading}
            subtext={homeContent.caseStudiesSubtext}
            viewAllLabel={homeContent.caseStudiesCta}
            viewAllHref={findPagePath("case-studies-hub", route.locale)}
            cardCtaLabel={homeContent.caseStudyCardCta}
            cases={getCaseStudyCards(route.locale)}
          />
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            formLabels={homeContent.contactForm}
          />
        </div>
        <Footer
          languageLinks={languageLinks}
          primaryLinks={footerPrimaryLinks}
          caseStudyLinks={footerCaseStudyLinks}
          contactLink={footerContactLink}
          locale={route.locale}
        />
      </>
    );
  }

  if (route.page.type === "case-studies-index") {
    return (
      <>
        <SkipLink />
        <Navbar navItems={navItems} languageLinks={languageLinks} homeHref={homeHref} />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col pt-20">
          <CaseStudies
            heading="Case Studies"
            headingLevel="h1"
            subtext={homeContent.caseStudiesSubtext}
            viewAllLabel={homeContent.caseStudiesCta}
            viewAllHref={findPagePath("case-studies-hub", route.locale)}
            cardCtaLabel={homeContent.caseStudyCardCta}
            cases={getCaseStudyCards(route.locale)}
          />
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            formLabels={homeContent.contactForm}
          />
        </div>
        <Footer
          languageLinks={languageLinks}
          primaryLinks={footerPrimaryLinks}
          caseStudyLinks={footerCaseStudyLinks}
          contactLink={footerContactLink}
          locale={route.locale}
        />
      </>
    );
  }

  if (route.page.type === "case-study" && route.page.slug) {
    const caseStudy = getCaseStudyContent(route.locale, route.page.slug);

    if (!caseStudy) {
      notFound();
    }

    const featureImage = getCaseStudyFeatureImage(route.page, caseStudy.title);

    return (
      <>
        <SkipLink />
        <Navbar navItems={navItems} languageLinks={languageLinks} homeHref={homeHref} />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full bg-white pt-32 pb-24 px-6">
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
            {featureImage ? (
              <div className="mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                <Image
                  src={featureImage.src}
                  alt={featureImage.alt}
                  width={featureImage.width}
                  height={featureImage.height}
                  sizes="(max-width: 768px) 100vw, 768px"
                  preload
                  className="h-auto w-full"
                />
              </div>
            ) : null}
            <MarkdownContent markdown={caseStudy.bodyMarkdown} />
          </article>
        </main>
        <div className="bg-white">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            formLabels={homeContent.contactForm}
          />
        </div>
        <Footer
          languageLinks={languageLinks}
          primaryLinks={footerPrimaryLinks}
          caseStudyLinks={footerCaseStudyLinks}
          contactLink={footerContactLink}
          locale={route.locale}
        />
      </>
    );
  }

  if (route.page.type === "contact") {
    return (
      <>
        <SkipLink />
        <Navbar navItems={navItems} languageLinks={languageLinks} homeHref={homeHref} />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full bg-white pt-20">
          <Contact
            heading={homeContent.contactHeading}
            copy={homeContent.contactCopy}
            formLabels={homeContent.contactForm}
          />
        </main>
        <Footer
          languageLinks={languageLinks}
          primaryLinks={footerPrimaryLinks}
          caseStudyLinks={footerCaseStudyLinks}
          contactLink={footerContactLink}
          locale={route.locale}
        />
      </>
    );
  }

  notFound();
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

function buildLanguageLinks(page: SitePage, activeLocale: Locale) {
  const { config } = getSiteStructure();

  return config.locales.map((locale) => ({
    label: locale.toUpperCase(),
    href: page.paths[locale],
    hrefLang: config.hreflangCodes[locale],
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

function buildFooterPrimaryLinks(locale: Locale) {
  const homePath = findPagePath("home", locale);

  const labels = {
    en: {
      home: "Home",
      capabilities: "Capabilities",
      caseStudies: "Case studies",
      contact: "Contact me",
    },
    rs: {
      home: "Početna",
      capabilities: "Šta radim",
      caseStudies: "Studije slučaja",
      contact: "Kontaktiraj me",
    },
    ru: {
      home: "Главная",
      capabilities: "Что я делаю",
      caseStudies: "Кейсы",
      contact: "Связаться со мной",
    },
  }[locale];

  return [
    { label: labels.home, href: homePath },
    { label: labels.capabilities, href: `${homePath === "/" ? "" : homePath}#services` },
    { label: labels.caseStudies, href: findPagePath("case-studies-hub", locale) },
    { label: labels.contact, href: findPagePath("contact", locale) },
  ];
}

function getFooterContactLabel(locale: Locale) {
  if (locale === "rs") {
    return "Kontaktiraj me";
  }

  if (locale === "ru") {
    return "Связаться со мной";
  }

  return "Contact me";
}

function findPagePath(id: string, locale: Locale) {
  const page = getSiteStructure().pages.find((candidate) => candidate.id === id);

  return page?.paths[locale] ?? "/";
}
