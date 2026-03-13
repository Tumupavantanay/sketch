"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Info } from "lucide-react";
import type { Sketch } from "@/lib/data/sketches";

const aspectClasses: Record<Sketch["aspectRatio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

interface SketchCardProps {
  sketch: Sketch;
  index: number;
  onOpen: (index: number) => void;
}

export default function SketchCard({
  sketch,
  index,
  onOpen,
}: SketchCardProps) {
  const skeletonRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    gsap.fromTo(
      img,
      { autoAlpha: 0, filter: "blur(8px)" },
      { autoAlpha: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }
    );
    if (skeletonRef.current) {
      gsap.to(skeletonRef.current, { autoAlpha: 0, duration: 0.4 });
    }
  };

  return (
    <div
      className="sketch-card group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/60 cursor-pointer shadow-[0_14px_30px_rgba(0,0,0,0.06)] transition-transform duration-700 hover:-translate-y-1"
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => onOpen(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(index);
        }
      }}
    >
      {/* Image area */}
      <div
        className={`relative w-full ${aspectClasses[sketch.aspectRatio]} select-none pointer-events-none overflow-hidden`}
        draggable={false}
      >
        {sketch.imageSrc ? (
          <>
            <div
              ref={skeletonRef}
              className="absolute inset-0 bg-zinc-200 animate-pulse"
            />
            <div className="absolute inset-0 z-10 opacity-60 bg-[linear-gradient(130deg,transparent_20%,rgba(255,255,255,0.23)_48%,transparent_70%)] translate-x-[-120%] group-hover:translate-x-[130%] transition-transform duration-[1400ms] ease-out pointer-events-none" />
            <Image
              src={sketch.imageSrc}
              alt={sketch.title}
              fill
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              draggable={false}
              style={{ opacity: 0 }}
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 scale-100 transition-transform duration-700 ease-out group-hover:scale-105 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400" />
            <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[radial-gradient(ellipse_at_30%_20%,_#f4f4f5_0%,_#a1a1aa_40%,_#3f3f46_100%)]" />
            <div className="absolute inset-0 opacity-60 bg-[linear-gradient(130deg,transparent_20%,rgba(255,255,255,0.23)_48%,transparent_70%)] translate-x-[-120%] group-hover:translate-x-[130%] transition-transform duration-[1400ms] ease-out" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px",
              }}
            />
            <div className="absolute inset-0 border-[8px] border-white/25 rounded-[1.1rem]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-zinc-500 transition-opacity duration-500 group-hover:opacity-0">
              <span className="font-display italic text-lg tracking-wide">
                {sketch.title}
              </span>
              <span className="text-xs tracking-[0.3em] uppercase font-light">
                {sketch.medium}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/92 via-zinc-900/48 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex flex-col justify-end p-4 backdrop-blur-[2px]">
        <span className="absolute top-4 right-4 text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-light">
          {sketch.year}
        </span>
        <h3 className="font-display italic text-white text-2xl leading-tight mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {sketch.title}
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed mb-2 line-clamp-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75">
          {sketch.description}
        </p>
        <div className="flex items-center gap-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100">
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 tracking-wider uppercase">
            <Info size={11} strokeWidth={1.5} />
            {sketch.medium}
          </span>
        </div>
      </div>
    </div>
  );
}
