"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight, Heart, Info } from "lucide-react";
import type { Sketch } from "@/lib/data/sketches";

interface LikeState {
  liked: boolean;
  count: number;
}

interface LightboxProps {
  sketches: Sketch[];
  initialIndex: number;
  onClose: () => void;
  likes: Record<number, LikeState>;
  onToggleLike: (id: number) => void;
}

export default function Lightbox({
  sketches,
  initialIndex,
  onClose,
  likes,
  onToggleLike,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const isFirstRenderRef = useRef(true);
  const navDirRef = useRef<1 | -1>(1);

  const sketch = sketches[currentIndex];
  const likeState: LikeState = likes[sketch.id] ?? {
    liked: false,
    count: 0,
  };

  /* ── Open animation ── */
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(panelRef.current, { autoAlpha: 0, y: 26, scale: 0.96 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.26 }).to(
      panelRef.current,
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out" },
      "-=0.12"
    );

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  /* ── Navigate-in animation (fires after index changes) ── */
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const content = contentRef.current;
    if (!content) {
      isAnimatingRef.current = false;
      return;
    }
    gsap.fromTo(
      content,
      { x: navDirRef.current * 48, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      }
    );
  }, [currentIndex]);

  /* ── Close ── */
  const close = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, {
      y: 22,
      scale: 0.98,
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      { autoAlpha: 0, duration: 0.22, ease: "power2.inOut" },
      "<"
    );
  }, [onClose]);

  /* ── Navigate ── */
  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (isAnimatingRef.current) return;
      const newIndex = currentIndex + dir;
      if (newIndex < 0 || newIndex >= sketches.length) return;

      isAnimatingRef.current = true;
      navDirRef.current = dir;

      const content = contentRef.current;
      if (!content) {
        setCurrentIndex(newIndex);
        isAnimatingRef.current = false;
        return;
      }

      gsap.to(content, {
        x: dir * -48,
        autoAlpha: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          // useEffect handles the enter animation after re-render
        },
      });
    },
    [currentIndex, sketches.length]
  );

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, navigate]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      onClick={close}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-5xl max-h-[92vh] rounded-2xl overflow-hidden border border-zinc-200/20 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close ── */}
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-zinc-100 hover:bg-black/70 transition-colors"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>

        {/* ── Counter badge ── */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.2em] uppercase text-zinc-400 bg-black/50 rounded-full px-3 py-1 pointer-events-none select-none">
          {currentIndex + 1} / {sketches.length}
        </div>

        {/* ── Prev button ── */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 text-zinc-100 hover:bg-black/70 transition-colors"
            aria-label="Previous sketch"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* ── Next button ── */}
        {currentIndex < sketches.length - 1 && (
          <button
            type="button"
            onClick={() => navigate(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 text-zinc-100 hover:bg-black/70 transition-colors"
            aria-label="Next sketch"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* ── Content (animated on navigate) ── */}
        <div ref={contentRef} className="flex flex-col max-h-[92vh]">
          {/* Image area */}
          <div
            className="relative w-full h-[56vh] sm:h-[62vh] md:h-[68vh] bg-zinc-950 select-none pointer-events-none overflow-hidden"
          >
            {sketch.imageSrc ? (
              <>
                {/* Pulse skeleton shown while image loads */}
                <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                <Image
                  src={sketch.imageSrc}
                  alt={sketch.title}
                  fill
                  className="object-contain p-1 sm:p-2"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  draggable={false}
                  style={{ opacity: 0 }}
                  onLoad={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    // Progressive reveal: blur → sharp
                    gsap.fromTo(
                      img,
                      { autoAlpha: 0, filter: "blur(10px)" },
                      {
                        autoAlpha: 1,
                        filter: "blur(0px)",
                        duration: 0.65,
                        ease: "power2.out",
                      }
                    );
                    // Fade out the skeleton underneath
                    const skeleton =
                      img.previousElementSibling as HTMLElement | null;
                    if (skeleton) {
                      gsap.to(skeleton, { autoAlpha: 0, duration: 0.45 });
                    }
                  }}
                />
              </>
            ) : (
              /* Graphite placeholder — same as card */
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400" />
                <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[radial-gradient(ellipse_at_30%_20%,_#f4f4f5_0%,_#a1a1aa_40%,_#3f3f46_100%)]" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                  <span className="font-display italic text-3xl tracking-wide">
                    {sketch.title}
                  </span>
                  <span className="mt-2 text-sm tracking-[0.25em] uppercase font-light">
                    {sketch.medium}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Info bar */}
          <div className="p-5 sm:p-6 border-t border-zinc-700/60 text-zinc-200 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display italic text-2xl leading-tight">
                {sketch.title}
              </p>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {sketch.description}
              </p>
              <p className="mt-3 text-[11px] tracking-[0.22em] uppercase text-zinc-500 flex items-center gap-1.5">
                <Info size={10} strokeWidth={1.5} />
                {sketch.medium} &bull; {sketch.year}
              </p>
            </div>

            {/* Like button */}
            <button
              type="button"
              onClick={() => onToggleLike(sketch.id)}
              className={`flex-shrink-0 flex items-center gap-2 text-xs border px-4 py-2 rounded-full transition-all duration-300 ${
                likeState.liked
                  ? "bg-white text-zinc-900 border-white"
                  : "border-zinc-600 text-zinc-400 hover:border-white hover:text-white"
              }`}
              aria-label={likeState.liked ? "Unlike" : "Like this sketch"}
            >
              <Heart
                size={13}
                className={likeState.liked ? "fill-zinc-900" : ""}
                strokeWidth={1.5}
              />
              <span>{likeState.count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
