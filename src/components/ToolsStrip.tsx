"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { SiGoogleanalytics, SiN8N, SiSemrush } from "react-icons/si";

export type ToolsStripProps = {
  label: string;
  heading: string;
  subtext: string;
  tools: string[];
};

type ToolConfig = {
  name: string;
  shortName?: string;
  x: number;
  y: number;
  c1: SvgPoint;
  c2: SvgPoint;
  floatDuration: number;
  floatDelay: number;
  lineOvershootPx?: number;
};

type MobileToolConfig = {
  name: string;
  x: number;
  y: number;
  c1: SvgPoint;
  c2: SvgPoint;
};

type SvgPoint = {
  x: number;
  y: number;
};

type DiagramSize = {
  width: number;
  height: number;
};

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 600;
const CENTER_POINT = { x: 500, y: 300 };
const LINE_OVERSHOOT_PX = 88;
const DEFAULT_DIAGRAM_SIZE = { width: 1280, height: 720 };
const FULL_DESKTOP_DIAGRAM_HEIGHT = 720;

const toolConfigs: ToolConfig[] = [
  {
    name: "Ahrefs",
    x: 12,
    y: 28,
    c1: { x: 400, y: 230 },
    c2: { x: 260, y: 145 },
    floatDuration: 5.4,
    floatDelay: -0.7,
    lineOvershootPx: 128,
  },
  {
    name: "Semrush",
    x: 22,
    y: 64,
    c1: { x: 420, y: 345 },
    c2: { x: 325, y: 410 },
    floatDuration: 4.6,
    floatDelay: -2.1,
  },
  {
    name: "Screaming Frog",
    x: 38,
    y: 18,
    c1: { x: 465, y: 230 },
    c2: { x: 430, y: 130 },
    floatDuration: 5.8,
    floatDelay: -1.4,
  },
  {
    name: "Google Search Console",
    shortName: "GSC",
    x: 50,
    y: 88,
    c1: { x: 535, y: 365 },
    c2: { x: 545, y: 450 },
    floatDuration: 4.9,
    floatDelay: -3.2,
  },
  {
    name: "Google Analytics 4",
    shortName: "GA4",
    x: 62,
    y: 22,
    c1: { x: 540, y: 230 },
    c2: { x: 575, y: 160 },
    floatDuration: 5.2,
    floatDelay: -0.2,
  },
  {
    name: "n8n",
    x: 78,
    y: 70,
    c1: { x: 610, y: 360 },
    c2: { x: 670, y: 435 },
    floatDuration: 4.4,
    floatDelay: -1.8,
  },
  {
    name: "Claude Code",
    x: 88,
    y: 32,
    c1: { x: 630, y: 240 },
    c2: { x: 740, y: 175 },
    floatDuration: 5.7,
    floatDelay: -2.7,
    lineOvershootPx: 128,
  },
];

const MOBILE_SVG_WIDTH = 360;
const MOBILE_SVG_HEIGHT = 440;
const MOBILE_CENTER_POINT = { x: 180, y: 220 };

const mobileToolConfigs: MobileToolConfig[] = [
  { name: "Ahrefs", x: 52, y: 145, c1: { x: 134, y: 180 }, c2: { x: 92, y: 128 } },
  { name: "Semrush", x: 78, y: 304, c1: { x: 130, y: 250 }, c2: { x: 102, y: 292 } },
  { name: "Screaming Frog", x: 148, y: 88, c1: { x: 166, y: 170 }, c2: { x: 142, y: 130 } },
  { name: "Google Search Console", x: 178, y: 366, c1: { x: 194, y: 270 }, c2: { x: 178, y: 314 } },
  { name: "Google Analytics 4", x: 232, y: 104, c1: { x: 198, y: 170 }, c2: { x: 224, y: 136 } },
  { name: "n8n", x: 290, y: 304, c1: { x: 230, y: 252 }, c2: { x: 270, y: 286 } },
  { name: "Claude Code", x: 310, y: 150, c1: { x: 240, y: 184 }, c2: { x: 286, y: 132 } },
];

function toPixel(point: SvgPoint, size: DiagramSize) {
  return {
    x: (point.x / SVG_WIDTH) * size.width,
    y: (point.y / SVG_HEIGHT) * size.height,
  };
}

function toSvg(point: SvgPoint, size: DiagramSize) {
  return {
    x: (point.x / size.width) * SVG_WIDTH,
    y: (point.y / size.height) * SVG_HEIGHT,
  };
}

function buildPathData(tool: ToolConfig, size: DiagramSize) {
  const toolCenter = {
    x: (tool.x / 100) * SVG_WIDTH,
    y: (tool.y / 100) * SVG_HEIGHT,
  };
  const centerPx = toPixel(CENTER_POINT, size);
  const toolPx = toPixel(toolCenter, size);
  const dx = toolPx.x - centerPx.x;
  const dy = toolPx.y - centerPx.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;
  const overshootScale = size.height >= FULL_DESKTOP_DIAGRAM_HEIGHT ? 1 : 0;
  const overshoot = (tool.lineOvershootPx ?? LINE_OVERSHOOT_PX) * overshootScale;
  const lineEnd = toSvg(
    {
      x: toolPx.x + ux * overshoot,
      y: toolPx.y + uy * overshoot,
    },
    size
  );

  return {
    linePath: `M${CENTER_POINT.x} ${CENTER_POINT.y} C${tool.c1.x} ${tool.c1.y} ${tool.c2.x} ${tool.c2.y} ${toolCenter.x} ${toolCenter.y} L${lineEnd.x} ${lineEnd.y}`,
    packetPath: `M${toolCenter.x} ${toolCenter.y} C${tool.c2.x} ${tool.c2.y} ${tool.c1.x} ${tool.c1.y} ${CENTER_POINT.x} ${CENTER_POINT.y}`,
  };
}

function buildMobilePathData(tool: MobileToolConfig) {
  return {
    linePath: `M${MOBILE_CENTER_POINT.x} ${MOBILE_CENTER_POINT.y} C${tool.c1.x} ${tool.c1.y} ${tool.c2.x} ${tool.c2.y} ${tool.x} ${tool.y}`,
    packetPath: `M${tool.x} ${tool.y} C${tool.c2.x} ${tool.c2.y} ${tool.c1.x} ${tool.c1.y} ${MOBILE_CENTER_POINT.x} ${MOBILE_CENTER_POINT.y}`,
  };
}

function ToolImage({
  src,
  alt,
  className = "h-7 w-auto max-w-8 object-contain md:h-8 md:max-w-9",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={className}
      loading="lazy"
      unoptimized={src.endsWith(".svg")}
    />
  );
}

const icons = {
  Ahrefs: (
    <svg viewBox="0 0 104 28" className="h-8 w-[62px] md:w-[64px]" aria-hidden="true">
      <text
        x="52"
        y="22.5"
        fontSize="26"
        fontWeight="800"
        fontFamily="Inter, Arial, sans-serif"
        letterSpacing="-1.1"
        textAnchor="middle"
      >
        <tspan fill="#FF8800">a</tspan>
        <tspan fill="#005A9E">hrefs</tspan>
      </text>
    </svg>
  ),
  Semrush: <SiSemrush className="text-[24px] text-[#ff642d] md:text-[32px]" aria-hidden="true" />,
  "Screaming Frog": (
    <ToolImage
      src="/screaming-frog-logo.transparent.png"
      alt="Screaming Frog"
      className="h-14 w-auto max-w-14 object-contain md:h-[72px] md:max-w-[72px]"
    />
  ),
  "Google Search Console": (
    <ToolImage
      src="/GSC_logo-removebg-preview.png"
      alt="Google Search Console"
      className="h-8 w-auto max-w-9 object-contain md:h-10 md:max-w-11"
    />
  ),
  "Google Analytics 4": (
    <SiGoogleanalytics className="text-[24px] text-[#f9ab00] md:text-[32px]" aria-hidden="true" />
  ),
  n8n: <SiN8N className="text-[24px] text-[#ea4b71] md:text-[32px]" aria-hidden="true" />,
  "Claude Code": <ToolImage src="/claude%20logo.svg" alt="Claude Code" />,
};

function CenterNode({
  onMouseEnter,
  onMouseLeave,
  className = "",
}: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`group relative z-30 flex size-20 items-center justify-center rounded-full bg-accent-secondary text-white shadow-[0_0_38px_rgba(70,97,120,0.22)] transition-transform duration-300 hover:scale-[1.04] md:size-[110px] ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Check className="size-7 md:size-10" strokeWidth={2.4} />
    </div>
  );
}

function RadarWaves({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          cx="500"
          cy="300"
          r="55"
          className="tools-radar-wave"
          style={{ animationDelay: `${index * 5}s` }}
        />
      ))}
    </svg>
  );
}

function ToolLogo({ name }: { name: string }) {
  return <>{icons[name as keyof typeof icons] ?? name}</>;
}

export function ToolsStrip({ label, heading, subtext, tools }: ToolsStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const centerShellRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<SVGPathElement[]>([]);
  const toolRefs = useRef<HTMLDivElement[]>([]);
  const labelTimerRef = useRef<number | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [centerActive, setCenterActive] = useState(false);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [diagramSize, setDiagramSize] = useState<DiagramSize>(DEFAULT_DIAGRAM_SIZE);

  const displayedTools = toolConfigs.filter((tool) => tools.includes(tool.name));
  const displayedMobileTools = mobileToolConfigs.filter((tool) => tools.includes(tool.name));
  const pathData = displayedTools.map((tool) => buildPathData(tool, diagramSize));
  const mobilePathData = displayedMobileTools.map((tool) => buildMobilePathData(tool));

  useEffect(() => {
    const diagram = diagramRef.current;

    if (!diagram) {
      return;
    }

    const updateSize = () => {
      const rect = diagram.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setDiagramSize((current) =>
          current.width === rect.width && current.height === rect.height
            ? current
            : { width: rect.width, height: rect.height }
        );
      }
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(diagram);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const centerShell = centerShellRef.current;
    const lines = lineRefs.current;
    const nodes = toolRefs.current;

    if (!section || !centerShell) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      centerShell.style.opacity = "1";
      centerShell.style.transform = "";
      lines.forEach((line) => {
        line.style.strokeDasharray = "";
        line.style.strokeDashoffset = "0";
      });
      nodes.forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "";
      });
      return;
    }

    lines.forEach((line) => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
    });

    centerShell.style.opacity = "0";
    centerShell.style.transform = "scale(0.85)";
    centerShell.style.transformOrigin = "50% 50%";
    nodes.forEach((node) => {
      node.style.opacity = "0";
      node.style.transform = "scale(0.7)";
      node.style.transformOrigin = "50% 50%";
    });

    let cancelled = false;
    let cleanupAnimation: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    const loadAnimation = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) {
        return;
      }

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      tl.to(centerShell, { opacity: 1, scale: 1, duration: 0.5 })
        .to(lines, { strokeDashoffset: 0, duration: 0.4, stagger: 0.08 }, "-=0.08")
        .to(
          nodes,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.4)",
            stagger: 0.08,
          },
          "-=0.42"
        );
      }, section);

      cleanupAnimation = () => ctx.revert();
    };

    if (typeof IntersectionObserver === "undefined") {
      void loadAnimation();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          observer?.disconnect();
          void loadAnimation();
        },
        { rootMargin: "400px 0px" }
      );
      observer.observe(section);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanupAnimation?.();
    };
  }, [displayedTools.length, diagramSize.width, diagramSize.height]);

  useEffect(() => {
    return () => {
      if (labelTimerRef.current) {
        window.clearTimeout(labelTimerRef.current);
      }
    };
  }, []);

  const setLineRef = (el: SVGPathElement | null, index: number) => {
    if (el) {
      lineRefs.current[index] = el;
    }
  };

  const setToolRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      toolRefs.current[index] = el;
    }
  };

  const handleCenterEnter = () => {
    setCenterActive(true);
    setShowAllLabels(true);

    if (labelTimerRef.current) {
      window.clearTimeout(labelTimerRef.current);
    }

    labelTimerRef.current = window.setTimeout(() => {
      setShowAllLabels(false);
    }, 1500);
  };

  const handleCenterLeave = () => {
    setCenterActive(false);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="tools-heading"
      aria-describedby="tools-description"
      className="relative overflow-hidden border-y border-slate-200 bg-white px-6 py-24 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          {label ? (
            <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[1.5px] text-slate-400">
              {label}
            </p>
          ) : null}
          <h2 id="tools-heading" className="mb-5 font-editorial text-6xl tracking-tight text-slate-900 md:text-7xl">
            {heading}
          </h2>
          <p id="tools-description" className="text-base leading-relaxed text-slate-600 md:text-lg">
            {subtext}
          </p>
        </div>

        <ul className="sr-only">
          {displayedTools.map((tool) => (
            <li key={tool.name}>{tool.name}</li>
          ))}
        </ul>

        <div
          ref={diagramRef}
          aria-hidden="true"
          className="relative mx-auto hidden h-[400px] max-w-3xl md:block lg:h-[500px] lg:max-w-4xl xl:h-[640px] xl:max-w-6xl 2xl:h-[720px] 2xl:max-w-7xl"
        >
          <RadarWaves />

          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {displayedTools.map((tool, index) => {
              const isActive = activeTool === tool.name;
              const isDimmed = Boolean(activeTool && !isActive);
              const isBright = isActive || centerActive;

              return (
                <g key={tool.name}>
                  <path
                    ref={(el) => setLineRef(el, index)}
                    d={pathData[index].linePath}
                    fill="none"
                    stroke={isBright ? "var(--color-accent-secondary)" : "var(--color-border-tertiary)"}
                    strokeOpacity={isDimmed ? 0.5 : isBright ? 0.82 : 1}
                    strokeWidth={isBright ? 2 : 1}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          <svg
            className="pointer-events-none absolute inset-0 z-[60] h-full w-full overflow-visible"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {displayedTools.map((tool, index) => (
              <circle key={tool.name} r="2.25" fill="var(--color-accent-secondary)" className="tools-packet-dot">
                <animateMotion
                  dur="2.5s"
                  begin={`${index * 0.3}s`}
                  repeatCount="indefinite"
                  path={pathData[index].packetPath}
                  rotate="auto"
                />
                <animate
                  attributeName="opacity"
                  dur="2.5s"
                  begin={`${index * 0.3}s`}
                  repeatCount="indefinite"
                  values="0.8;0.8;0.8;0"
                  keyTimes="0;0.12;0.86;1"
                />
              </circle>
            ))}
          </svg>

          <div ref={centerShellRef} className="absolute left-1/2 top-1/2 z-[70] -translate-x-1/2 -translate-y-1/2">
            <CenterNode onMouseEnter={handleCenterEnter} onMouseLeave={handleCenterLeave} />
          </div>

          {displayedTools.map((tool, index) => {
            const isActive = activeTool === tool.name;
            const isDimmed = Boolean(activeTool && !isActive);
            const labelVisible = isActive || showAllLabels;

            return (
              <div
                key={tool.name}
                className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${tool.x}%`, top: `${tool.y}%` }}
              >
                <div ref={(el) => setToolRef(el, index)} className="size-14 2xl:size-16">
                  <div
                    className="tools-node-float relative size-14 2xl:size-16"
                    style={
                      {
                        "--tools-float-duration": `${tool.floatDuration}s`,
                        "--tools-float-delay": `${tool.floatDelay}s`,
                      } as CSSProperties
                    }
                  >
                    <div
                      className={`flex size-14 items-center justify-center rounded-full border border-border-tertiary bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_3px_8px_rgba(15,23,42,0.08),0_12px_24px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/45 2xl:size-16 ${
                        isDimmed ? "opacity-50" : "opacity-100"
                      }`}
                      onMouseEnter={() => setActiveTool(tool.name)}
                      onMouseLeave={() => setActiveTool(null)}
                    >
                      <ToolLogo name={tool.name} />
                    </div>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-slate-500 transition-opacity duration-200 ${
                        labelVisible ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {tool.shortName ?? tool.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-14 h-[520px] max-w-sm md:hidden" aria-hidden="true">
          <div className="relative h-full w-full">
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox={`0 0 ${MOBILE_SVG_WIDTH} ${MOBILE_SVG_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {displayedMobileTools.map((tool, index) => (
                <path
                  key={tool.name}
                  d={mobilePathData[index].linePath}
                  fill="none"
                  stroke="var(--color-border-tertiary)"
                  strokeLinecap="round"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
              viewBox={`0 0 ${MOBILE_SVG_WIDTH} ${MOBILE_SVG_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[0, 1, 2].map((index) => (
                <circle
                  key={index}
                  cx={MOBILE_CENTER_POINT.x}
                  cy={MOBILE_CENTER_POINT.y}
                  r="40"
                  className="tools-radar-wave"
                  style={{ animationDelay: `${index * 5}s` }}
                />
              ))}
            </svg>

            <svg
              className="pointer-events-none absolute inset-0 z-[60] h-full w-full overflow-visible"
              viewBox={`0 0 ${MOBILE_SVG_WIDTH} ${MOBILE_SVG_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {displayedMobileTools.map((tool, index) => (
                <circle key={tool.name} r="2.25" fill="var(--color-accent-secondary)" className="tools-packet-dot">
                  <animateMotion
                    dur="2.5s"
                    begin={`${index * 0.3}s`}
                    repeatCount="indefinite"
                    path={mobilePathData[index].packetPath}
                    rotate="auto"
                  />
                  <animate
                    attributeName="opacity"
                    dur="2.5s"
                    begin={`${index * 0.3}s`}
                    repeatCount="indefinite"
                    values="0.8;0.8;0.8;0"
                    keyTimes="0;0.12;0.86;1"
                  />
                </circle>
              ))}
            </svg>

            <div
              className="absolute z-[70] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(MOBILE_CENTER_POINT.x / MOBILE_SVG_WIDTH) * 100}%`,
                top: `${(MOBILE_CENTER_POINT.y / MOBILE_SVG_HEIGHT) * 100}%`,
              }}
            >
              <CenterNode />
            </div>

            {displayedMobileTools.map((tool) => {
              const desktopTool = displayedTools.find((item) => item.name === tool.name);

              return (
                <div
                  key={tool.name}
                  className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(tool.x / MOBILE_SVG_WIDTH) * 100}%`,
                    top: `${(tool.y / MOBILE_SVG_HEIGHT) * 100}%`,
                  }}
                >
                  <div
                    className="flex size-12 items-center justify-center rounded-full border border-border-tertiary bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_3px_8px_rgba(15,23,42,0.08),0_12px_24px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/45"
                  >
                    <ToolLogo name={tool.name} />
                  </div>
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 max-w-20 -translate-x-1/2 text-center font-mono text-[10px] leading-tight text-slate-500">
                    {desktopTool?.shortName ?? tool.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
