import fs from "node:fs";
import path from "node:path";

export type Locale = "en" | "rs" | "ru";
export type PageType =
  | "home"
  | "case-studies-index"
  | "case-study"
  | "contact";

export type LocalizedString = Record<Locale, string>;

export type SitePage = {
  id: string;
  type: PageType;
  order?: number;
  slug?: string;
  contentFile?: LocalizedString;
  paths: LocalizedString;
  titles: LocalizedString;
  cardTitle?: LocalizedString;
  cardSummary?: LocalizedString;
  industry?: string;
};

export type SiteStructure = {
  config: {
    baseUrl: string;
    defaultLocale: Locale;
    locales: Locale[];
    localeHtmlLang: LocalizedString;
    hreflangCodes: LocalizedString;
  };
  pages: SitePage[];
};

export type HomeContent = {
  locale: Locale;
  headingLineOne: string;
  headingLineTwo: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  results: Array<{ label: string; value: string }>;
  capabilitiesHeading: string;
  capabilitiesSubtext: string;
  capabilities: Array<{
    num: string;
    tagLeft: string;
    tagRight: string;
    title: string;
    desc: string;
  }>;
  tools: string[];
  toolsLabel: string;
  toolsHeading: string;
  toolsSubtext: string;
  caseStudiesHeading: string;
  caseStudiesSubtext: string;
  caseStudiesCta: string;
  caseStudyCardCta: string;
  contactHeading: string;
  contactCopy: string;
  contactForm: {
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

export type CaseStudyContent = {
  locale: Locale;
  page: SitePage;
  title: string;
  dek: string;
  bodyMarkdown: string;
};

const contentRoot = path.join(process.cwd(), "Content");
const structurePath = path.join(contentRoot, "site-structure (1).json");

const localeHomeFiles: Record<Locale, string> = {
  en: "homepage-draft.md",
  rs: "translated-homepage-rs.md",
  ru: "translated-homepage-ru.md",
};

const contentFileAliases: Record<string, string> = {
  "case-study-1-igaming.sr.md": "prevedeno.md",
  "case-study-1-igaming.ru.md": "translated-1-ru.md",
  "case-study-2-matcha.md": "case-study-2.md",
  "case-study-2-matcha.sr.md": "prevedeno-matcha.md",
  "case-study-2-matcha.ru.md": "translated-2-ru.md",
  "case-study-3-parfem.md": "case-study-3.md",
  "case-study-3-parfem.sr.md": "prevedeno-parfem.md",
  "case-study-3-parfem.ru.md": "translated-3-ru.md",
  "case-study-4-crypto-exchange.md": "case-study-4.md",
  "case-study-4-crypto-exchange.sr.md": "prevedeno-4-crypto-exchange.md",
  "case-study-4-crypto-exchange.ru.md": "translated-4-ru.md",
  "case-study-5-crypto-media.md": "case-study-5.md",
  "case-study-5-crypto-media.sr.md": "prevedeno-5-crypto-media.md",
  "case-study-5-crypto-media.ru.md": "translated-5-ru.md",
  "case-study-6-saas.md": "case-study-6.md",
  "case-study-6-saas.sr.md": "prevedeno-6.md",
  "case-study-6-saas.ru.md": "translated-6-ru.md",
};

const capabilityMeta = [
  {
    num: "01",
    tagLeft: "TECHNICAL",
    tagRight: "{ I code too }",
  },
  {
    num: "02",
    tagLeft: "SEMANTIC",
    tagRight: "TF-IDF",
  },
  {
    num: "03",
    tagLeft: "LINKS",
    tagRight: "digital PR",
  },
  {
    num: "04",
    tagLeft: "AUTOMATION",
    tagRight: "n8n + claude",
  },
];

export function getSiteStructure(): SiteStructure {
  const raw = fs.readFileSync(structurePath, "utf8");
  const structure = JSON.parse(raw) as SiteStructure;

  return {
    ...structure,
    config: {
      ...structure.config,
      baseUrl: structure.config.baseUrl.includes("REPLACE")
        ? "https://boristheconsultant.com"
        : structure.config.baseUrl,
    },
  };
}

export function getAllRouteParams() {
  return getSiteStructure().pages.flatMap((page) =>
    Object.values(page.paths).map((pagePath) => ({
      segments: pathToSegments(pagePath),
    }))
  );
}

export function findRoute(segments?: string[]) {
  const currentPath = segmentsToPath(segments);
  const structure = getSiteStructure();

  for (const page of structure.pages) {
    for (const locale of structure.config.locales) {
      if (normalizePath(page.paths[locale]) === currentPath) {
        return { structure, page, locale };
      }
    }
  }

  return null;
}

export function getCaseStudyPages() {
  return getSiteStructure().pages
    .filter((page) => page.type === "case-study")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getCaseStudyCards(locale: Locale) {
  return getCaseStudyPages().map((page) => ({
    industry: page.industry ?? "",
    title: page.cardTitle?.[locale] ?? page.titles[locale],
    summary: page.cardSummary?.[locale] ?? "",
    href: page.paths[locale],
  }));
}

export function getHomeContent(locale: Locale): HomeContent {
  const markdown = readContentFile(localeHomeFiles[locale]);
  const heading = matchFirst(markdown, /^#\s+(.+)$/m) ?? "";
  const [headingLineOne, headingLineTwo] = splitHeading(heading);
  const intro = extractIntro(markdown);
  const ctas = [...markdown.matchAll(/\[([^\]]+)\]/g)].map((match) =>
    cleanInline(match[1])
  );
  const sections = splitH2Sections(markdown);
  const resultsSection = sections[0]?.body ?? "";
  const capabilitiesSection =
    sections.find((section) => /###\s+/.test(section.body)) ?? sections[1];
  const toolsSection =
    sections.find((section) => /Ahrefs|Semrush|Screaming Frog/i.test(section.body)) ??
    sections[2];
  const contactSection = sections[sections.length - 1];
  const capabilitiesIntro = firstParagraph(capabilitiesSection?.body ?? "");
  const { heading: capabilitiesHeading, subtext: capabilitiesSubtext } =
    splitLeadSentence(capabilitiesIntro);

  return {
    locale,
    headingLineOne,
    headingLineTwo,
    intro,
    primaryCta: stripTrailingArrow(ctas[0] ?? "See Case Studies"),
    secondaryCta: stripTrailingArrow(ctas[1] ?? "Book a 30-min Audit"),
    results: extractResults(resultsSection),
    capabilitiesHeading: normalizeCapabilitiesHeading(capabilitiesHeading),
    capabilitiesSubtext,
    capabilities: extractCapabilities(capabilitiesSection?.body ?? ""),
    tools: extractBullets(toolsSection?.body ?? ""),
    toolsLabel:
      locale === "rs"
        ? ""
        : locale === "ru"
          ? ""
          : "WHAT I USE",
    toolsHeading:
      locale === "rs" ? "Šta koristim." : locale === "ru" ? "Что я использую." : "The stack.",
    toolsSubtext:
      locale === "rs"
        ? "Ove alate koristim svakodnevno."
        : locale === "ru"
          ? "Эти инструменты я использую каждый день."
          : "If it's here, it runs daily.",
    caseStudiesHeading:
      locale === "rs"
        ? "Studije slučaja."
        : locale === "ru"
          ? "Кейсы."
          : "Case studies.",
    caseStudiesSubtext:
      locale === "rs"
        ? "Stvarni brojevi. Stvarna strategija."
        : locale === "ru"
          ? "Реальные цифры. Реальная стратегия."
          : "Real numbers. Real strategy.",
    caseStudiesCta:
      locale === "rs"
        ? "Pogledaj sve studije slučaja"
        : locale === "ru"
          ? "Смотреть все кейсы"
          : "View all case studies",
    caseStudyCardCta:
      locale === "rs"
        ? "Pročitaj studiju slučaja"
        : locale === "ru"
          ? "Читать кейс"
          : "Read case study",
    contactHeading: cleanInline(contactSection?.title ?? "Contact"),
    contactCopy:
      locale === "en"
        ? "If your SEO feels stuck, or previous retainers delivered reports instead of results, send a short note."
        : locale === "rs"
          ? "Ako tvoj SEO stoji u mestu ili su prethodni retaineri donosili izveštaje umesto rezultata, pošalji kratku poruku."
          : "Если SEO застрял или прошлые ретейнеры приносили отчёты вместо результатов, напишите короткое сообщение.",
    contactForm:
      locale === "rs"
        ? {
            nameLabel: "Ime",
            namePlaceholder: "Ana Petrović",
            emailLabel: "Email",
            emailPlaceholder: "ana@kompanija.com",
            urlLabel: "URL kompanije",
            urlPlaceholder: "https://kompanija.com",
            messageLabel: "Poruka",
            messagePlaceholder: "Reci mi šta trenutno koči tvoj SEO...",
            submitLabel: "Pošalji poruku",
            sendingLabel: "Šalje se...",
            successMessage: "Poruka je poslata. Javiću se uskoro.",
            errorMessage: "Poruka nije poslata. Pokušaj ponovo.",
          }
        : locale === "ru"
          ? {
              nameLabel: "Имя",
              namePlaceholder: "Анна Иванова",
              emailLabel: "Email",
              emailPlaceholder: "anna@company.com",
              urlLabel: "URL компании",
              urlPlaceholder: "https://company.com",
              messageLabel: "Сообщение",
              messagePlaceholder: "Расскажите, что сейчас мешает вашему SEO...",
              submitLabel: "Отправить сообщение",
              sendingLabel: "Отправка...",
              successMessage: "Сообщение отправлено. Я скоро отвечу.",
              errorMessage: "Сообщение не отправлено. Попробуйте ещё раз.",
            }
          : {
              nameLabel: "Name",
              namePlaceholder: "Jane Doe",
              emailLabel: "Email",
              emailPlaceholder: "jane@company.com",
              urlLabel: "Company URL",
              urlPlaceholder: "https://company.com",
              messageLabel: "Message",
              messagePlaceholder: "Tell me about your current SEO challenges...",
              submitLabel: "Send Message",
              sendingLabel: "Sending...",
              successMessage: "Message sent. I’ll get back to you soon.",
              errorMessage: "Message failed. Try again.",
            },
  };
}

export function getCaseStudyContent(
  locale: Locale,
  slug: string
): CaseStudyContent | null {
  const page = getCaseStudyPages().find((candidate) => candidate.slug === slug);

  if (!page?.contentFile) {
    return null;
  }

  const markdown = readContentFile(page.contentFile[locale]);
  const title = matchFirst(markdown, /^#\s+(.+)$/m) ?? page.titles[locale];
  const dek = matchFirst(markdown, /^\*\*(.+)\*\*$/m) ?? "";
  const bodyMarkdown = markdown
    .replace(/^#\s+.+\r?\n+/, "")
    .replace(/^\*\*.+\*\*\r?\n+/, "")
    .trim();

  return {
    locale,
    page,
    title: cleanInline(title),
    dek: cleanInline(dek),
    bodyMarkdown,
  };
}

export function getAlternateLinks(page: SitePage) {
  const structure = getSiteStructure();
  const links = structure.config.locales.map((locale) => ({
    hreflang: structure.config.hreflangCodes[locale],
    href: absoluteUrl(page.paths[locale]),
  }));

  return [
    ...links,
    { hreflang: "x-default", href: absoluteUrl(page.paths.en) },
  ];
}

export function absoluteUrl(pagePath: string) {
  const { config } = getSiteStructure();
  return `${config.baseUrl}${pagePath}`;
}

function readContentFile(fileName: string) {
  const actualFile = contentFileAliases[fileName] ?? fileName;
  return fs.readFileSync(path.join(contentRoot, actualFile), "utf8");
}

function segmentsToPath(segments?: string[]) {
  if (!segments?.length) {
    return "/";
  }

  return normalizePath(`/${segments.join("/")}`);
}

function pathToSegments(pagePath: string) {
  const normalized = normalizePath(pagePath);

  if (normalized === "/") {
    return [];
  }

  return normalized.slice(1).split("/");
}

function normalizePath(pagePath: string) {
  if (pagePath === "/") {
    return "/";
  }

  return pagePath.replace(/\/+$/, "");
}

function splitHeading(heading: string): [string, string] {
  const cleanHeading = cleanInline(heading);
  const lineBreakMarker = cleanHeading.indexOf("|");

  if (lineBreakMarker !== -1) {
    return [
      cleanHeading.slice(0, lineBreakMarker).trim(),
      cleanHeading.slice(lineBreakMarker + 1).trim(),
    ];
  }

  const firstPeriod = cleanHeading.indexOf(".");

  if (firstPeriod === -1) {
    return [cleanHeading, ""];
  }

  return [
    cleanHeading.slice(0, firstPeriod + 1).trim(),
    cleanHeading.slice(firstPeriod + 1).trim(),
  ];
}

function extractIntro(markdown: string) {
  const beforeFirstRule = markdown.split(/^---$/m)[0] ?? "";
  const withoutHeading = beforeFirstRule.replace(/^#\s+.+\r?\n+/, "");
  const lines = withoutHeading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("**["));

  return cleanInline(lines[0] ?? "");
}

function splitH2Sections(markdown: string) {
  const sections: Array<{ title: string; body: string }> = [];
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const next = matches[index + 1];
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? markdown.length;

    sections.push({
      title: cleanInline(match[1]),
      body: markdown.slice(start, end).trim(),
    });
  }

  return sections;
}

function extractResults(markdown: string) {
  const boldLine = matchFirst(markdown, /^\*\*(.+)\*\*$/m) ?? "";
  const credentials = boldLine
    .split("·")
    .map((part) => cleanInline(part))
    .filter(Boolean);

  return [
    {
      label: "Experience",
      value: credentials[0] ?? "8+ years in SEO",
    },
    {
      label: "Background",
      value: credentials[1] ?? "5 years agency-side",
    },
    {
      label: "Code",
      value: "JS, React, Next.js",
    },
    {
      label: "Languages",
      value: "EN, SR, RU",
    },
  ];
}

function extractCapabilities(markdown: string) {
  const matches = [...markdown.matchAll(/^###\s+(.+)$/gm)];

  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? markdown.indexOf("---", start);
    const body = markdown.slice(start, end === -1 ? markdown.length : end);
    const title = cleanInline(match[1]);

    return {
      ...capabilityMeta[index],
      title:
        title === "AI Agent Workflows for SEO"
          ? "AI Agent Workflows"
          : title,
      desc: cleanInline(firstParagraph(body)),
    };
  });
}

function extractBullets(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => cleanInline(line.slice(2)))
    .filter(Boolean);
}

function firstParagraph(markdown: string) {
  return (
    markdown
      .split(/\r?\n\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .find((paragraph) => !paragraph.startsWith("[") && !paragraph.startsWith("- ")) ??
    ""
  );
}

function splitLeadSentence(text: string) {
  const cleanText = cleanInline(text);
  const sentenceMatches = cleanText.match(/[^.!?]+[.!?]+/g) ?? [cleanText];
  const heading = sentenceMatches.slice(0, 2).join(" ").trim();
  const subtext = cleanText.slice(heading.length).trim();

  return { heading, subtext };
}

function normalizeCapabilitiesHeading(heading: string) {
  return heading.replace(/\bservices\b/i, "capabilities");
}

function cleanInline(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTrailingArrow(text: string) {
  return text.replace(/\s*[→➜➔]+$/u, "").trim();
}

function matchFirst(text: string, pattern: RegExp) {
  return text.match(pattern)?.[1];
}
