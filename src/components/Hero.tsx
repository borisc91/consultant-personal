"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  headingLineOne: string;
  headingLineTwo: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  locale?: "en" | "rs" | "ru";
  videoSrc?: string;
  videoWebmSrc?: string;
};

export function Hero({
  headingLineOne,
  headingLineTwo,
  intro,
  primaryCta,
  secondaryCta,
  locale = "en",
  videoSrc,
  videoWebmSrc,
}: HeroProps) {
  const blobsRef = useRef<HTMLDivElement[]>([]);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    blobsRef.current.forEach((blob, i) => {
      if (!blob) return;
      gsap.to(blob, {
        x: "random(-60, 60)",
        y: "random(-60, 60)",
        scale: "random(0.8, 1.2)",
        duration: "random(5, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5
      });
    });
  }, []);

  const addBlobRef = (el: HTMLDivElement | null) => {
    if (el && !blobsRef.current.includes(el)) {
      blobsRef.current.push(el);
    }
  };

  const readMoreLabels = {
    en: { more: "Read more", less: "Show less" },
    rs: { more: "Pročitaj više", less: "Prikaži manje" },
    ru: { more: "Читать дальше", less: "Скрыть" },
  };

  return (
    <section 
      className="relative flex min-h-0 items-start overflow-hidden px-6 pb-6 pt-24 md:min-h-[68vh] md:items-center md:pb-24 md:pt-36 lg:min-h-[72vh] lg:pb-24 lg:pt-40"
    >
      {/* Animated Light Blue Gradient Background */}
      <div className="absolute inset-0 -z-10 w-full h-full bg-white overflow-hidden">
        <div 
          ref={addBlobRef}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-100/60 blur-[80px] md:blur-[120px] mix-blend-multiply opacity-70"
        />
        <div 
          ref={addBlobRef}
          className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-sky-100/60 blur-[80px] md:blur-[120px] mix-blend-multiply opacity-70"
        />
        <div 
          ref={addBlobRef}
          className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-50/80 blur-[80px] md:blur-[120px] mix-blend-multiply opacity-70"
        />
        {/* Very subtle grid overlay to add texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-20 2xl:gap-28">
          {/* Left Side: Text */}
          <div className="flex flex-col space-y-5 md:space-y-8">
            <h1 className="font-display text-[2.6rem] leading-[1.04] tracking-tight text-slate-900 flex flex-col md:text-6xl md:leading-[1.1] lg:text-[4rem] 2xl:text-7xl">
              <span className="block w-full whitespace-nowrap">{headingLineOne}</span>
              <span className="block w-full max-w-full text-balance text-slate-500">{headingLineTwo}</span>
            </h1>
            <div className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              <p
                id="hero-intro"
                className={
                  isIntroExpanded
                    ? ""
                    : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:block md:overflow-visible md:[display:block]"
                }
              >
                {intro}
              </p>
              <button
                type="button"
                className="mt-2 inline-flex text-sm font-medium text-accent transition-colors hover:text-slate-900 md:hidden"
                aria-expanded={isIntroExpanded}
                aria-controls="hero-intro"
                onClick={() => setIsIntroExpanded((current) => !current)}
              >
                {isIntroExpanded ? readMoreLabels[locale].less : readMoreLabels[locale].more}
              </button>
            </div>
          </div>

          {/* Right Side: Media Placement */}
          <div 
            className="relative order-3 -mt-5 flex h-[276px] w-full origin-center scale-[1.18] items-center justify-center overflow-visible sm:h-[318px] md:order-2 md:mt-0 md:aspect-video md:h-auto md:w-[74%] md:translate-x-6 md:scale-[1.08] md:justify-self-end lg:w-[72%] lg:-translate-x-2 lg:scale-[1.05] lg:justify-self-start 2xl:w-auto 2xl:translate-x-12 2xl:scale-[1.72] 2xl:justify-self-auto"
          >
            <div className="absolute inset-[-8%] bg-[radial-gradient(ellipse_at_64%_50%,rgba(224,242,254,0.52),rgba(248,250,252,0.26)_38%,transparent_66%)] pointer-events-none" />
            <div className="absolute inset-[-8%] opacity-45 bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)] pointer-events-none" />
            <div className="absolute left-[12%] right-[6%] top-[18%] h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent pointer-events-none" />
            <div className="absolute left-[6%] right-[16%] bottom-[22%] h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent pointer-events-none" />
            {videoSrc ? (
              <div className="relative h-full w-full overflow-visible">
                <video
                  className="absolute inset-0 h-full w-full object-contain object-center mix-blend-multiply opacity-95 [filter:contrast(1.03)_saturate(0.88)] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_16%,black_30%,black_100%)]"
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  aria-hidden="true"
                >
                  <source src={videoSrc} type="video/mp4" />
                  {videoWebmSrc ? (
                    <source src={videoWebmSrc} type="video/webm" />
                  ) : null}
                  [ video: me dragging a chart upward ]
                </video>
                <div className="absolute inset-[-4%] bg-[radial-gradient(ellipse_at_78%_56%,transparent_36%,rgba(255,255,255,0.24)_80%,rgba(255,255,255,0.62)_100%)] [mask-image:linear-gradient(to_right,transparent_0%,transparent_42%,black_70%)] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_bottom,rgba(15,23,42,0.7)_1px,transparent_1px)] bg-[size:100%_7px] [mask-image:linear-gradient(to_right,transparent_0%,black_34%,black_100%)] pointer-events-none" />
                <p className="sr-only">
                  Video of Boris demonstrating organic traffic growth on a chart.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 p-6 z-10">
                <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">
                  [ video: me dragging a chart upward ]
                </p>
              </div>
            )}
          </div>

          <div className="order-2 grid w-full grid-cols-2 items-stretch gap-2 pt-1 md:order-3 md:-mt-6 md:flex md:w-auto md:items-center md:gap-4 md:pt-0">
            <Link 
              href="#case-studies"
              className="group relative inline-flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-3 text-center text-[12.5px] font-medium leading-tight text-white transition-transform hover:scale-[1.02] active:scale-[0.98] md:min-h-0 md:w-auto md:gap-2 md:px-8 md:py-4 md:text-sm"
            >
              <span className="min-w-0">{primaryCta}</span>
              <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1 md:size-4" aria-hidden="true" />
            </Link>
            <Link 
              href="#contact"
              className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-center text-[12.5px] font-medium leading-tight text-slate-900 backdrop-blur-sm transition-colors hover:bg-white md:min-h-0 md:w-auto md:px-8 md:py-4 md:text-sm"
            >
              <span className="min-w-0">{secondaryCta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
