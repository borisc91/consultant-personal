"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  videoPosterSrc?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
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
  videoPosterSrc,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<HTMLSpanElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedVideoRef = useRef(false);
  const mediaIntroCompleteRef = useRef(false);
  const videoFullyVisibleRef = useRef(false);
  const videoLoadedRef = useRef(false);
  const playTimeoutRef = useRef<number | undefined>(undefined);
  const blobsRef = useRef<HTMLDivElement[]>([]);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  const scheduleVideoPlayback = useCallback(() => {
    const video = videoRef.current;

    if (
      !video ||
      hasPlayedVideoRef.current ||
      !mediaIntroCompleteRef.current ||
      !videoFullyVisibleRef.current ||
      !videoLoadedRef.current
    ) {
      return;
    }

    hasPlayedVideoRef.current = true;
    playTimeoutRef.current = window.setTimeout(() => {
      void video.play().catch(() => {
        hasPlayedVideoRef.current = false;
      });
    }, 500);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([headingRefs.current, ctaRef.current, mediaRef.current], {
        y: 0,
        opacity: 1,
      });
      mediaIntroCompleteRef.current = true;
      scheduleVideoPlayback();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Ensure elements are initially hidden before animation runs
    gsap.set([headingRefs.current, ctaRef.current, mediaRef.current], { 
      y: 30, opacity: 0 
    });

    tl.to(headingRefs.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      delay: 0.2
    })
    .to(ctaRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, "-=0.4")
    .to(mediaRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      onComplete: () => {
        mediaIntroCompleteRef.current = true;
        scheduleVideoPlayback();
      },
    }, "-=0.8");

    // Animate background blobs
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
  }, [scheduleVideoPlayback]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoSrc) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;

    if (prefersReducedMotion || saveData) {
      return;
    }

    hasPlayedVideoRef.current = false;
    videoFullyVisibleRef.current = false;
    videoLoadedRef.current = video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA;
    video.pause();
    video.currentTime = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        videoFullyVisibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.98;
        scheduleVideoPlayback();
      },
      { threshold: [0, 0.5, 0.98, 1] }
    );

    const handleVideoLoaded = () => {
      videoLoadedRef.current = true;
      scheduleVideoPlayback();
    };

    video.addEventListener("canplaythrough", handleVideoLoaded, { once: true });
    observer.observe(video);
    video.load();

    if (videoLoadedRef.current) {
      scheduleVideoPlayback();
    }

    return () => {
      observer.disconnect();
      video.removeEventListener("canplaythrough", handleVideoLoaded);
      if (playTimeoutRef.current) {
        window.clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = undefined;
      }
    };
  }, [scheduleVideoPlayback, videoSrc]);

  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !headingRefs.current.includes(el)) {
      headingRefs.current.push(el);
    }
  };

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
      ref={containerRef}
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
              <span ref={addToRefs} className="block w-full whitespace-nowrap">{headingLineOne}</span>
              <span ref={addToRefs} className="block w-full max-w-full text-balance text-slate-500">{headingLineTwo}</span>
            </h1>
            <div className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              <p
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
                onClick={() => setIsIntroExpanded((current) => !current)}
              >
                {isIntroExpanded ? readMoreLabels[locale].less : readMoreLabels[locale].more}
              </button>
            </div>
          </div>

          {/* Right Side: Media Placement */}
          <div 
            ref={mediaRef} 
            className="relative order-3 -mt-1 flex h-[276px] w-full origin-center scale-[1.18] items-center justify-center overflow-visible sm:h-[318px] md:order-2 md:mt-0 md:aspect-video md:h-auto md:w-[74%] md:translate-x-6 md:scale-[1.08] md:justify-self-end lg:w-[72%] lg:-translate-x-2 lg:scale-[1.05] lg:justify-self-start 2xl:w-auto 2xl:translate-x-12 2xl:scale-[1.72] 2xl:justify-self-auto"
          >
            <div className="absolute inset-[-8%] bg-[radial-gradient(ellipse_at_64%_50%,rgba(224,242,254,0.52),rgba(248,250,252,0.26)_38%,transparent_66%)] pointer-events-none" />
            <div className="absolute inset-[-8%] opacity-45 bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)] pointer-events-none" />
            <div className="absolute left-[12%] right-[6%] top-[18%] h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent pointer-events-none" />
            <div className="absolute left-[6%] right-[16%] bottom-[22%] h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent pointer-events-none" />
            {videoSrc ? (
              <div className="relative h-full w-full overflow-visible">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-contain object-center mix-blend-multiply opacity-95 [filter:contrast(1.03)_saturate(0.88)] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_16%,black_30%,black_100%)]"
                  muted
                  playsInline
                  preload="auto"
                  poster={videoPosterSrc}
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  aria-label="Boris demonstrating traffic growth on a chart"
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

          <div ref={ctaRef} className="order-2 flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center md:order-3 md:-mt-6 md:gap-4 md:pt-0">
            <Link 
              href="#case-studies"
              className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] md:px-8 md:py-4"
            >
              {primaryCta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-medium text-slate-900 backdrop-blur-sm transition-colors hover:bg-white md:px-8 md:py-4"
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
