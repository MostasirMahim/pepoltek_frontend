"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import SplitType from "@/lib/split-type";
import { webProjects } from "@/data/projectsData";
import { Project } from "@/types/portfolio";
import TargetCursor from "@/components/ui/TargetCursor";

import { ProjectModal } from "./ProjectModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

interface SplitResult {
  titleTopSplits: SplitType[];
  titleBottomSplits: SplitType[];
  textLeftSplits: SplitType[];
  textRightSplits: SplitType[];
}

/* ---------- Main WebProjects Section ---------- */
export default function WebProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const detailSectionRef = useRef<HTMLDivElement | null>(null);
  const customCursorRef = useRef<HTMLDivElement | null>(null);

  const galleryItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentWrappersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleHash = () => {
      const match = window.location.hash.match(/#\/webproject\/([^/?#]+)/);
      if (match) {
        const param = match[1];
        const p = webProjects.find(
          (item) => String(item.id) === param || String(item.numericId) === param || item.slug === param
        );
        if (p) {
          setSelectedProject(p);
          return;
        }
      }
      setSelectedProject(null);
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const scrollContent = scrollContentRef.current;
    const scrollWrapper = scrollWrapperRef.current;
    let cleanupFn: (() => void) | null = null;

    const rafId = requestAnimationFrame(() => {
      const getScrollDistance = () => Math.max(0, scrollContent.scrollWidth - scrollWrapper.offsetWidth);

      function updateImageParallax() {
        const halfWidth = window.innerWidth * 0.5;
        scrollContent.querySelectorAll<HTMLImageElement>(".projects-image-container img").forEach((img) => {
          const parent = img.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          const centerX = rect.left + rect.width * 0.5;
          const offset = -gsap.utils.clamp(-1, 1, (centerX - halfWidth) / halfWidth) * 8;
          gsap.set(img, { xPercent: offset, force3D: true });
        });
      }

      gsap.set(scrollContent, { x: 0 });
      updateImageParallax();

      scrollContent.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", () => {
            ScrollTrigger.refresh();
            updateImageParallax();
          });
        }
      });

      let activeIndex: number | null = null;
      let isAnimating = false;
      let mouseRaf: number | null = null;
      let curX = 0,
        curY = 0,
        targetX = 0,
        targetY = 0;

      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: scrollWrapper,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          if (activeIndex === null) {
            gsap.set(scrollContent, { x: -self.progress * getScrollDistance() });
            updateImageParallax();
          }
        },
      });

      function renderCursor() {
        curX += (targetX - curX) * 0.15;
        curY += (targetY - curY) * 0.15;
        if (customCursorRef.current) {
          customCursorRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        }
        mouseRaf = requestAnimationFrame(renderCursor);
      }

      function handleMouseMove(e: MouseEvent) {
        const rect = customCursorRef.current?.getBoundingClientRect();
        if (rect) {
          targetX = e.clientX - rect.width * 0.5;
          targetY = e.clientY - rect.height * 0.5;
          if (!mouseRaf) mouseRaf = requestAnimationFrame(renderCursor);
        }
      }

      window.addEventListener("mousemove", handleMouseMove);

      function initSplit(contentNode: HTMLElement | null): SplitResult | null {
        if (!contentNode) return null;
        const titleTopNodes = contentNode.querySelectorAll<HTMLElement>("[data-text-top] div");
        const titleBottomNodes = contentNode.querySelectorAll<HTMLElement>("[data-text-bottom] div");
        const textLeftNodes = contentNode.querySelectorAll<HTMLElement>("[data-text-left] div");
        const textRightNodes = contentNode.querySelectorAll<HTMLElement>("[data-text-right] div");

        const titleTopSplits = Array.from(titleTopNodes, (el) => new SplitType(el, { types: "chars" }));
        const titleBottomSplits = Array.from(titleBottomNodes, (el) => new SplitType(el, { types: "chars" }));

        titleTopSplits[0]?.chars?.forEach((charEl) => {
          const wrap = document.createElement("div");
          wrap.classList.add("char-wrap");
          charEl.parentNode?.insertBefore(wrap, charEl);
          wrap.appendChild(charEl);
        });

        const textLeftSplits = Array.from(textLeftNodes, (el) => new SplitType(el, { types: "lines" }));
        const textRightSplits = Array.from(textRightNodes, (el) => new SplitType(el, { types: "lines" }));

        [textLeftSplits, textRightSplits].forEach((arr) =>
          arr.forEach((splitObj) =>
            splitObj.lines?.forEach((lineEl) => {
              const wrap = document.createElement("div");
              wrap.className = "line-wrap";
              wrap.style.display = "inline-block";
              wrap.style.marginRight = "0.32em";
              wrap.style.verticalAlign = "baseline";
              wrap.style.overflow = "hidden";
              lineEl.parentNode?.insertBefore(wrap, lineEl);
              wrap.appendChild(lineEl);
            })
          )
        );

        return {
          titleTopSplits,
          titleBottomSplits,
          textLeftSplits,
          textRightSplits,
        };
      }

      const splitsArray: (SplitResult | null)[] = [];
      contentsRef.current.forEach((el, idx) => {
        splitsArray[idx] = initSplit(el);
      });

      const openDetail = (index: number) => {
        if (isAnimating) return;
        isAnimating = true;

        const contentEl = contentsRef.current[index];
        const wrapperEl = contentWrappersRef.current[index];
        const imgContainer = imageContainersRef.current[index];
        const splits = splitsArray[index];
        if (!contentEl || !wrapperEl || !imgContainer || !detailSectionRef.current || !splits) return;

        const img = imgContainer.querySelector("img");
        contentEl.classList.add("is-visible");
        detailSectionRef.current.classList.add("is-active");
        trigger.disable(false);

        const otherCards = galleryItemsRef.current.filter((_, idx) => idx !== index && _ !== null) as HTMLElement[];
        gsap.set(otherCards, { clipPath: "inset(-6vw 0px 0px -6vw)" });

        const tl = gsap
          .timeline({
            onComplete: () => {
              activeIndex = index;
              customCursorRef.current?.classList.add("is-open");
              isAnimating = false;
            },
          })
          .addLabel("start", 0)
          .to(rootRef.current!.querySelector(".projects-section-header"), { opacity: 0, y: -20, duration: 0.5, ease: "power3.inOut" }, "start");

        if (img) {
          tl.to(img, { xPercent: 0, duration: 1.25, ease: "power4.inOut" }, "start");
        }

        tl.add(() => {
          const state = Flip.getState(imgContainer);
          wrapperEl.appendChild(imgContainer);
          Flip.from(state, { duration: 1.25, ease: "power4.inOut" });
        }, "start")
          .to(otherCards, { clipPath: "inset(100% 0 0 0)", duration: 0.75, ease: "power3.inOut" }, 0)
          .fromTo((splits.titleTopSplits[0] as any)?.elements ?? [], { xPercent: 15 }, { xPercent: 0, duration: 1, ease: "power3.out" }, "start+=1.25")
          .fromTo(
            [...(splits.titleTopSplits[0]?.chars ?? []), ...(splits.titleBottomSplits[0]?.chars ?? [])],
            { clipPath: "inset(0 100% 0 0)", xPercent: 10 },
            { clipPath: "inset(0 0% 0 0)", xPercent: 0, duration: 0.75, ease: "power3.out" },
            "start+=1.25"
          )
          .fromTo(
            [...(splits.textLeftSplits?.flatMap((e) => e.lines ?? []) ?? []), ...(splits.textRightSplits?.flatMap((e) => e.lines ?? []) ?? [])],
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.025 },
            "start+=1.2"
          );
      };

      const closeDetail = (index: number) => {
        if (isAnimating || activeIndex === null) return;
        isAnimating = true;

        const contentEl = contentsRef.current[index];
        const wrapperEl = contentWrappersRef.current[index];
        const splits = splitsArray[index];
        if (!contentEl || !wrapperEl || !detailSectionRef.current || !splits) return;

        const imgContainer = wrapperEl.querySelector<HTMLElement>(".projects-image-container");
        const img = imgContainer?.querySelector("img");

        const tl = gsap
          .timeline({
            onComplete: () => {
              isAnimating = false;
              activeIndex = null;
              customCursorRef.current?.classList.remove("is-open");
              detailSectionRef.current?.classList.remove("is-active");
              contentEl.classList.remove("is-visible");
              trigger.enable();
              updateImageParallax();
            },
          })
          .addLabel("start", 0)
          .to(rootRef.current!.querySelector(".projects-section-header"), { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, "start+=0.5");

        if (img) {
          tl.to(img, { xPercent: 0, duration: 1.25, ease: "power3.inOut" }, "start+=0.25");
        }

        tl.fromTo(
          [...((splits.titleTopSplits[0] as any)?.elements ?? []), ...((splits.titleBottomSplits[0] as any)?.elements ?? [])],
          { xPercent: 0 },
          { xPercent: 10, ease: "power3.out", duration: 1 },
          "start"
        )
          .fromTo(
            [...(splits.titleTopSplits[0]?.chars ?? []), ...(splits.titleBottomSplits[0]?.chars ?? [])],
            { clipPath: "inset(0 0% 0 0)", xPercent: 0 },
            { clipPath: "inset(0 100% 0 0)", xPercent: 10, ease: "power3.out", duration: 0.75 },
            "start"
          )
          .to([...(splits.textLeftSplits?.flatMap((e) => e.lines ?? []) ?? []), ...(splits.textRightSplits?.flatMap((e) => e.lines ?? []) ?? [])], {
            yPercent: 100,
            stagger: 0.025,
            duration: 0.75,
          }, "start")
          .add(() => {
            if (!imgContainer) return;
            const targetGalleryCard = galleryItemsRef.current[index];
            if (!targetGalleryCard) return;
            const state = Flip.getState(imgContainer);
            targetGalleryCard.appendChild(imgContainer);
            Flip.from(state, { duration: 1.25, ease: "power4.inOut" });
          }, "start+=0.25")
          .to(galleryItemsRef.current.filter((_, idx) => idx !== index && _ !== null) as HTMLElement[], { clipPath: "inset(-6vw 0px 0px -6vw)" })
          .set(galleryItemsRef.current, { clipPath: "none" });
      };

      galleryItemsRef.current.forEach((el, idx) => {
        if (!el) return;
        el.addEventListener("click", () => {
          if (activeIndex === null) openDetail(idx);
        });
        el.addEventListener("mouseenter", () => customCursorRef.current?.classList.add("is-visible"));
        el.addEventListener("mouseleave", () => customCursorRef.current?.classList.remove("is-visible"));
      });

      contentWrappersRef.current.forEach((el, idx) => {
        if (!el) return;
        el.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).closest(".projects-case-study-btn")) {
            return;
          }
          if (activeIndex === idx) closeDetail(idx);
        });
        el.addEventListener("mouseenter", () => customCursorRef.current?.classList.add("is-visible"));
        el.addEventListener("mouseleave", () => customCursorRef.current?.classList.remove("is-visible"));
      });

      cleanupFn = () => {
        trigger.kill();
        if (mouseRaf) cancelAnimationFrame(mouseRaf);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <section id="projects" ref={rootRef} className="projects-root relative w-full bg-canvas text-ink">
      <TargetCursor
        targetSelector="button, a, [role='button'], .cursor-target, .projects-case-study-btn, .case-study-back-btn, .projects-gallery-image"
        color="#0a84ff"
        spinDuration={2.2}
      />

      <div ref={customCursorRef} className="projects-cursor">
        <div className="projects-cross-btn" />
      </div>

      <div ref={scrollWrapperRef} className="projects-scroll-wrapper">
        {/* Ambient Grid Accent */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(10,132,255,0.1)_1px,transparent_1.4px)] [background-size:26px_26px]" />
        
        {/* Pinned Section Header */}
        <div className="projects-section-header pointer-events-none absolute left-0 top-8 z-20 px-6 sm:px-12 lg:px-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10px] font-500 uppercase tracking-[0.18em] text-electric backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
            [ 06 ] · Delivery Portfolio
          </div>
          <h2 className="mt-3 font-display text-3xl font-800 tracking-tight text-ink sm:text-4xl lg:text-5xl">
            PROVEN ENGINEERING <span className="text-electric">&amp; HEALTHCARE TEAMS</span>
          </h2>
        </div>

        {/* Pinned Horizontal Gallery Content (Centered vertically in screen) */}
        <div ref={scrollContentRef} className="projects-scroll-content">
          <div className="projects-gallery">
            {webProjects.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  galleryItemsRef.current[idx] = el;
                }}
                className="projects-gallery-image cursor-target"
              >
                <div className="projects-card-number font-display text-electric/30">{String(idx + 1).padStart(2, "0")}</div>
                <div
                  ref={(el) => {
                    imageContainersRef.current[idx] = el;
                  }}
                  className="projects-image-container rounded-2xl border border-[#bcd6fa] bg-white shadow-[0_20px_45px_-15px_rgba(10,132,255,0.25)]"
                >
                  <img src={project.image} alt={project.alt} />
                  <div className="projects-card-title-overlay">
                    <span className="projects-card-title-top font-display text-white">{project.titleTop}</span>
                    <span className="projects-card-title-bottom font-mono text-electric-bright">{project.titleBottom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Morphing Detail View */}
        <div ref={detailSectionRef} className="projects-detail-section">
          {webProjects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                contentsRef.current[idx] = el;
              }}
              className="projects-content"
            >
              <div
                ref={(el) => {
                  contentWrappersRef.current[idx] = el;
                }}
                className="projects-content-wrapper rounded-3xl border border-[#bcd6fa] bg-white/90 shadow-[0_30px_90px_rgba(10,132,255,0.3)] backdrop-blur-md"
              >
                <div className="projects-title-top" data-text-top="true">
                  <div className="projects-title-big font-display text-ink">{project.titleTop}</div>
                </div>
                <div className="projects-title-bottom" data-text-bottom="true">
                  <div className="projects-title-big font-display text-electric">{project.titleBottom}</div>
                </div>

                <div className="projects-text-left" data-text-left="true">
                  <div className="projects-title-small font-mono text-electric">{project.labelLeft}</div>
                  <div className="projects-paragraph font-sans text-ink-soft">{project.descLeft}</div>
                </div>

                <div className="projects-text-right" data-text-right="true">
                  <div className="projects-title-small font-mono text-electric">{project.labelRight}</div>
                  <div className="projects-paragraph font-sans text-ink-soft">{project.descRight}</div>

                  {project.caseStudy && (
                    <button
                      type="button"
                      className="projects-case-study-btn font-display cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      onMouseEnter={() => customCursorRef.current?.classList.remove("is-visible")}
                      onMouseLeave={() => customCursorRef.current?.classList.add("is-visible")}
                    >
                      <span>Case Study Brief</span>
                      <svg className="btn-arrow" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            if (window.location.hash.startsWith("#/webproject")) {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }}
        />
      )}

      <style>{`
        .projects-root {
          width: 100%;
          position: relative;
          background: #eef4fd;
        }

        .projects-scroll-wrapper {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .projects-scroll-content {
          will-change: transform;
          flex-flow: row;
          justify-content: flex-start;
          align-items: center;
          width: fit-content;
          height: 100%;
          padding-top: 6vh;
          padding-left: 32vw;
          padding-right: 15vw;
          display: flex;
        }

        .projects-gallery {
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 6vw;
          height: 100%;
          display: flex;
        }

        .projects-gallery-image {
          aspect-ratio: 16/10;
          cursor: pointer;
          clip-path: inset(-6vw 0 0 -6vw);
          flex-shrink: 0;
          width: clamp(340px, 32vw, 480px);
          position: relative;
        }

        .projects-gallery-image:nth-child(odd) {
          transform: translateY(5%);
        }

        .projects-gallery-image:nth-child(2n) {
          transform: translateY(-5%);
        }

        .projects-card-number {
          z-index: 10;
          pointer-events: none;
          user-select: none;
          font-size: clamp(2.8rem, 4.5vw, 5rem);
          font-weight: 900;
          line-height: 1;
          transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: absolute;
          top: -4px;
          left: -4px;
          transform: translate(-45%, -45%);
          text-shadow: 0 4px 20px rgba(10, 132, 255, 0.25);
        }

        .projects-root:has(.projects-detail-section.is-active) .projects-card-number,
        body:has(.case-study-page) .projects-card-number {
          opacity: 0;
        }

        .projects-image-container {
          width: 100%;
          height: 100%;
          aspect-ratio: 16/10;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
          background: #dbe8fc;
        }

        .projects-image-container img {
          object-fit: cover;
          will-change: transform;
          width: 100%;
          height: 100%;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
        }

        .projects-gallery-image:hover .projects-image-container {
          transform: scale(1.03);
          box-shadow: 0 25px 60px -15px rgba(10, 132, 255, 0.35);
        }

        .projects-card-title-overlay {
          pointer-events: none;
          user-select: none;
          z-index: 5;
          background: linear-gradient(0deg, rgba(10, 20, 40, 0.92) 0%, rgba(10, 20, 40, 0.4) 60%, transparent 100%);
          flex-direction: column;
          gap: 2px;
          padding: 24px 18px 14px;
          transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .projects-card-title-top,
        .projects-card-title-bottom {
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: clamp(0.7rem, 0.95vw, 0.9rem);
          font-weight: 800;
          line-height: 1.2;
          display: block;
        }

        .projects-detail-section {
          z-index: 10;
          pointer-events: none;
          visibility: hidden;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          display: flex;
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: rgba(238, 244, 253, 0.88);
          backdrop-filter: blur(14px);
        }

        .projects-detail-section.is-active {
          visibility: visible;
          pointer-events: auto;
        }

        .projects-content {
          visibility: hidden;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          display: flex;
          position: absolute;
          top: 0;
        }

        .projects-content.is-visible {
          visibility: visible;
        }

        .projects-content-wrapper {
          aspect-ratio: 16/10;
          cursor: pointer;
          width: clamp(340px, 48vw, 760px);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .projects-title-top,
        .projects-title-bottom {
          z-index: 10;
          pointer-events: none;
          align-items: center;
          width: 100%;
          margin: 0;
          display: flex;
          position: absolute;
        }

        .projects-title-top {
          justify-content: flex-start;
          bottom: 100%;
          transform: translateY(22%);
        }

        .projects-title-bottom {
          justify-content: flex-end;
          top: 100%;
          left: 0;
          transform: translateY(-22%);
        }

        .projects-content:nth-child(2n) .projects-title-top {
          justify-content: flex-end;
        }

        .projects-content:nth-child(2n) .projects-title-bottom {
          justify-content: flex-start;
        }

        .projects-title-big {
          letter-spacing: -0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          font-size: clamp(2.2rem, 4.8vw, 4.6rem);
          font-weight: 800;
          line-height: 0.9em;
        }

        .projects-text-left,
        .projects-text-right {
          flex-direction: column;
          width: clamp(160px, 18vw, 260px);
          height: 100%;
          justify-content: center;
          display: flex;
          position: absolute;
          top: 0;
        }

        .projects-text-left {
          text-align: right;
          align-items: flex-end;
          padding-right: 1.5rem;
          right: 100%;
        }

        .projects-text-right {
          text-align: left;
          align-items: flex-start;
          padding-left: 1.5rem;
          left: 100%;
        }

        .projects-title-small {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.5em;
          font-size: clamp(0.75rem, 0.9vw, 1.1rem);
          font-weight: 800;
          line-height: 1.2;
          overflow: hidden;
        }

        .projects-paragraph {
          white-space: normal;
          width: 100%;
          font-size: clamp(0.75rem, 0.85vw, 1.05rem);
          font-weight: 500;
          line-height: 1.5;
          display: block;
          overflow: hidden;
        }

        .line,
        .word,
        .line-wrap,
        .char-wrap {
          overflow: hidden;
        }

        .line-wrap,
        .char-wrap {
          display: inline-block;
          vertical-align: baseline;
        }

        .line-wrap {
          margin-right: 0.28em;
        }

        .projects-cursor {
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          width: 1.1rem;
          height: 1.1rem;
          transition: opacity 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
          position: fixed;
          top: 0;
          left: 0;
        }

        .projects-cursor.is-visible {
          opacity: 1;
        }

        .projects-cursor.is-open .projects-cross-btn {
          transform: rotate(360deg);
        }

        .projects-cross-btn {
          backdrop-filter: blur(8px);
          background: rgba(10, 132, 255, 0.25);
          border: 1.2px solid #0a84ff;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
          position: absolute;
          transform: rotate(45deg);
        }

        .projects-cross-btn:before,
        .projects-cross-btn:after {
          content: "";
          background: #0a1428;
          width: calc(100% - 0.35rem);
          height: 1.5px;
          position: absolute;
          top: 50%;
          left: 50%;
        }

        .projects-cross-btn:after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .projects-cross-btn:before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .projects-case-study-btn {
          color: #0a1428;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          z-index: 20;
          background: rgba(10, 132, 255, 0.08);
          border: 1px solid rgba(10, 132, 255, 0.4);
          border-radius: 6px;
          align-items: center;
          gap: 0.6rem;
          width: fit-content;
          margin-top: 1.25rem;
          padding: 0.65rem 1.3rem;
          font-family: var(--font-sora), sans-serif;
          font-size: clamp(0.7rem, 0.75vw, 0.85rem);
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: inline-flex;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(10, 132, 255, 0.15);
        }

        .projects-case-study-btn:before {
          content: "";
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.45), transparent);
          width: 100%;
          height: 100%;
          transition: all 0.6s;
          position: absolute;
          top: 0;
          left: -100%;
        }

        .projects-case-study-btn:hover:before {
          left: 100%;
        }

        .projects-case-study-btn:hover {
          color: #0a84ff;
          background: rgba(10, 132, 255, 0.16);
          border-color: #0a84ff;
          box-shadow: 0 0 24px rgba(10, 132, 255, 0.4);
        }

        .projects-case-study-btn .btn-arrow {
          color: #0a84ff;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .projects-case-study-btn:hover .btn-arrow {
          transform: translate(4px);
        }

        /* Case Study Page (Scrollable Modal) */
        .case-study-page {
          z-index: 99999;
          color: #0a1428;
          background: #eef4fd;
          display: block;
          position: fixed;
          inset: 0;
          overflow-y: scroll !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          pointer-events: auto !important;
          touch-action: pan-y;
        }

        body:has(.case-study-page) .projects-cursor {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .case-study-page-header {
          z-index: 100;
          backdrop-filter: blur(16px);
          background: rgba(238, 244, 253, 0.88);
          border-bottom: 1px solid #bcd6fa;
          align-items: center;
          height: 72px;
          padding: 0 2rem;
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }

        .case-study-back-btn {
          color: #0a1428;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #bcd6fa;
          border-radius: 8px;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.2rem;
          font-size: clamp(0.75rem, 0.8vw, 0.95rem);
          font-weight: 700;
          transition: all 0.3s;
          display: inline-flex;
          box-shadow: 0 4px 14px rgba(10, 132, 255, 0.12);
        }

        .case-study-back-btn:hover {
          color: #0a84ff;
          border-color: #0a84ff;
          transform: translateY(-1px);
        }

        .case-study-back-btn .btn-back-arrow {
          transition: transform 0.3s;
        }

        .case-study-back-btn:hover .btn-back-arrow {
          transform: translate(-4px);
        }

        .case-study-page-hero {
          align-items: flex-end;
          width: 100%;
          height: 52vh;
          display: flex;
          position: relative;
          overflow: hidden;
          margin-top: 72px;
        }

        .case-study-page-hero-img-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          background: #0a1428;
        }

        .case-study-page-hero-img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: transform 8s;
        }

        .case-study-page:hover .case-study-page-hero-img {
          transform: scale(1.04);
        }

        .case-study-page-hero-overlay {
          z-index: 2;
          background: linear-gradient(0deg, #eef4fd 0%, rgba(238, 244, 253, 0.92) 50%, rgba(238, 244, 253, 0.4) 100%);
          width: 100%;
          padding: 3rem 0 1.5rem;
          position: relative;
        }

        .case-study-page-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .case-study-page-hero-title {
          font-size: clamp(2rem, 3.8vw, 3.2rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-top: 0.5rem;
        }

        .case-study-page-content-wrapper {
          padding-top: 2.5rem;
          padding-bottom: 6rem;
        }

        .case-study-page-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
        }

        @media (max-width: 820px) {
          .case-study-page-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .case-study-page-section {
          margin-bottom: 2.5rem;
        }

        .case-study-page-section-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 0.75rem;
        }

        .case-study-page-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #3d4c68;
        }

        .case-study-page-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .tech-page-tag {
          padding: 0.35rem 0.8rem;
          border-radius: 6px;
          border: 1px solid #bcd6fa;
          background: #ffffff;
          color: #0a84ff;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(10, 132, 255, 0.08);
        }

        .case-study-links-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .case-study-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .case-study-link-btn.github {
          background: #ffffff;
          border: 1px solid #bcd6fa;
          color: #0a1428;
          box-shadow: 0 2px 8px rgba(10, 132, 255, 0.08);
        }

        .case-study-link-btn.github:hover {
          border-color: #0a84ff;
          color: #0a84ff;
        }

        .case-study-link-btn.live {
          background: #0a84ff;
          border: 1px solid #38bdf8;
          color: #fff;
          box-shadow: 0 4px 16px rgba(10, 132, 255, 0.35);
        }

        .case-study-link-btn.live:hover {
          background: #38bdf8;
        }

        .case-study-page-gallery-section {
          margin-top: 4rem;
        }

        .case-study-gallery-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1.5rem;
        }

        .case-study-gallery-card {
          flex-shrink: 0;
          width: 320px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #bcd6fa;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(10, 132, 255, 0.1);
        }

        .gallery-img-wrapper {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-img-label {
          display: block;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          color: #6b7a95;
        }
      `}</style>
    </section>
  );
}
