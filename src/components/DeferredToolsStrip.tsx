"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ToolsStripProps } from "@/components/ToolsStrip";

const LazyToolsStrip = dynamic(
  () => import("@/components/ToolsStrip").then((module) => module.ToolsStrip),
  { ssr: false }
);

export function DeferredToolsStrip(props: ToolsStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || shouldLoad) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <LazyToolsStrip {...props} /> : <ToolsStripShell {...props} />}
    </div>
  );
}

function ToolsStripShell({ label, heading, subtext }: ToolsStripProps) {
  return (
    <section
      aria-labelledby="tools-heading"
      aria-describedby="tools-description"
      className="relative overflow-hidden border-y border-slate-200 bg-white px-6 py-24 md:py-28"
    >
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
        <div aria-hidden="true" className="relative mx-auto hidden h-[400px] max-w-3xl md:block lg:h-[500px] lg:max-w-4xl xl:h-[640px] xl:max-w-6xl 2xl:h-[720px] 2xl:max-w-7xl" />
        <div aria-hidden="true" className="mx-auto mt-14 h-[520px] max-w-sm md:hidden" />
      </div>
    </section>
  );
}
