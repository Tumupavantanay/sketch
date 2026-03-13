"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SketchNavbar from "@/components/sketch-navbar";
import SketchCard from "@/components/sketch-card";
import Lightbox from "@/components/lightbox";
import { sketches } from "@/lib/data/sketches";

gsap.registerPlugin(ScrollTrigger);

const showcaseLayout = [
  "xl:col-span-5 md:col-span-3",
  "xl:col-span-3 md:col-span-3 xl:translate-y-8",
  "xl:col-span-4 md:col-span-3",
  "xl:col-span-4 md:col-span-3 xl:-translate-y-8",
  "xl:col-span-3 md:col-span-3",
  "xl:col-span-5 md:col-span-3",
  "xl:col-span-6 md:col-span-3",
  "xl:col-span-4 md:col-span-3 xl:translate-y-4",
  "xl:col-span-4 md:col-span-3",
  "xl:col-span-4 md:col-span-6",
] as const;

export default function GalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* ── Disable right-click globally on this page ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  /* ── GSAP animations ── */
  useGSAP(
    () => {
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([".hero-chrome", ".hero-line", ".hero-title", ".hero-sub", ".sketch-card", ".footer-line"], {
          clearProps: "all",
          autoAlpha: 1,
          y: 0,
          scaleX: 1,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-chrome", {
        y: -24,
        autoAlpha: 0,
        duration: 0.9,
      })
        .from(
          ".hero-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
          },
          "-=0.45"
        )
        .from(
          ".hero-title",
          {
            y: 34,
            autoAlpha: 0,
            duration: 1,
          },
          "-=0.62"
        )
        .from(
          ".hero-sub",
          {
            y: 18,
            autoAlpha: 0,
            duration: 0.9,
          },
          "-=0.72"
        )
        .from(
          ".sketch-card",
          {
            y: 34,
            autoAlpha: 0,
            duration: 1,
            stagger: { amount: 1.1, from: "start" },
            ease: "power2.out",
          },
          "-=0.52"
        );

      // Scroll-triggered reveal for later cards
      gsap.utils.toArray<HTMLElement>(".sketch-card").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
            }),
        });
      });

      gsap.to(".ambient-orb", {
        yPercent: -12,
        xPercent: 6,
        duration: 1.2,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".hero-shell",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Footer fade
      gsap.from(".footer-line", {
        autoAlpha: 0,
        y: 12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".footer-line",
          start: "top 96%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="min-h-screen text-zinc-900 relative">
      <SketchNavbar />

      <div className="ambient-orb absolute -top-24 -left-20 h-64 w-64 rounded-full bg-zinc-300/35 blur-3xl pointer-events-none" />
      <div className="ambient-orb absolute top-32 -right-20 h-72 w-72 rounded-full bg-zinc-400/20 blur-3xl pointer-events-none" />
      <div className="ambient-orb absolute top-[48rem] left-[8%] h-56 w-56 rounded-full bg-zinc-200/35 blur-3xl pointer-events-none" />

      {/* ── Hero header ── */}
      <section className="hero-shell pt-24 pb-10 px-6 max-w-6xl mx-auto">
        <div className="hero-chrome inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-6 rounded-full border border-zinc-300/70 bg-white/70 px-4 py-1.5 backdrop-blur-sm">
          Graphite Archive
        </div>
        <div className="hero-line mb-6 h-px bg-zinc-400/70" />
        <h1 className="hero-title font-display italic text-5xl sm:text-7xl md:text-8xl text-zinc-900 tracking-tight leading-[0.95] mb-4">
          Graphite
        </h1>
        <p className="hero-sub text-xs sm:text-sm tracking-[0.24em] uppercase text-zinc-500 font-light mt-6 max-w-3xl">
          Original works on paper &mdash; 2B through 8B
        </p>
        <div className="hero-line mt-8 h-px bg-zinc-300/70" />
      </section>

      {/* ── Curated gallery layout ── */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-5 md:gap-6">
          {sketches.map((sketch, i) => (
            <div
              key={sketch.id}
              className={`relative ${showcaseLayout[i] ?? "xl:col-span-4 md:col-span-3"}`}
            >
              <SketchCard
                sketch={sketch}
                index={i}
                onOpen={setOpenIndex}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200/70 py-8 px-6 backdrop-blur-[2px] bg-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="footer-line font-display italic text-zinc-500 text-base">
            Graphite
          </p>
          <p className="footer-line text-[11px] tracking-[0.3em] uppercase text-zinc-300 font-light">
            © {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </footer>

      <p className="pointer-events-none fixed bottom-3 right-4 z-40 text-[10px] sm:text-xs tracking-[0.24em] uppercase text-zinc-500/70">
        Tumu Pavan Tanay
      </p>

      {/* ── Lightbox ── */}
      {openIndex !== null && (
        <Lightbox
          sketches={sketches}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </main>
  );
}

