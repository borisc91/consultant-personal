import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

type FooterProps = {
  languageLinks: Array<{ label: string; href: string; hrefLang: string; active: boolean }>;
  primaryLinks: Array<{ label: string; href: string }>;
  caseStudyLinks: Array<{ label: string; href: string }>;
  contactLink: { label: string; href: string };
  locale: "en" | "rs" | "ru";
};

const footerCopy = {
  en: {
    based: "Based in Novi Sad, Serbia.",
    navigation: "Navigation",
    caseStudies: "Case studies",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  rs: {
    based: "Novi Sad, Srbija.",
    navigation: "Navigacija",
    caseStudies: "Studije slučaja",
    contact: "Kontakt",
    rights: "Sva prava zadržana.",
  },
  ru: {
    based: "Нови-Сад, Сербия.",
    navigation: "Навигация",
    caseStudies: "Кейсы",
    contact: "Контакт",
    rights: "Все права защищены.",
  },
};

export function Footer({
  languageLinks,
  primaryLinks,
  caseStudyLinks,
  contactLink,
  locale,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copy = footerCopy[locale];
  const homeHref = primaryLinks[0]?.href ?? "/";

  return (
    <footer className="border-t border-slate-800 bg-slate-900 px-6 py-14 text-slate-400 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.8fr_1.2fr_1fr] md:gap-12">
        <div className="space-y-5">
          <Link href={homeHref} className="inline-flex items-center" aria-label="Home">
            <LogoMark className="h-12 w-12" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            {copy.based}
          </p>
          <a
            href="https://www.linkedin.com/in/boris-%C4%8Dolovi%C4%87-b56769182/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile, opens in a new tab"
            className="inline-flex text-sm font-medium text-white transition-colors hover:text-sky-300"
          >
            LinkedIn
          </a>
        </div>

        <nav aria-labelledby="footer-navigation-heading">
          <h2 id="footer-navigation-heading" className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {copy.navigation}
          </h2>
          <ul className="space-y-3 text-sm">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-case-studies-heading">
          <h2 id="footer-case-studies-heading" className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {copy.caseStudies}
          </h2>
          <ul className="space-y-3 text-sm">
            {caseStudyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {copy.contact}
          </h2>
          <div className="space-y-4 text-sm">
            <Link
              href={contactLink.href}
              className="inline-flex font-medium text-white transition-colors hover:text-sky-300"
            >
              {contactLink.label}
            </Link>
          </div>
          <div className="mt-6 flex gap-3 text-xs font-medium tracking-wider" role="group" aria-label="Footer language switcher">
            {languageLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                hrefLang={link.hrefLang}
                aria-current={link.active ? "true" : undefined}
                className={link.active ? "text-white" : "transition-colors hover:text-white"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 pt-8 text-xs text-slate-500">
        <p>
          &copy; {currentYear} Boris SEO Consultant. {copy.rights}
        </p>
      </div>
    </footer>
  );
}
