"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ScrollAnimator - cinematic GSAP scroll entrance animations.
 * Every section gets a bold, unmistakably distinct motion signature.
 * Targets sections by ID. Zero JSX changes to any section component.
 */
export default function ScrollAnimator() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    function qSA(container: Element, sel: string): Element[] {
      return gsap.utils.toArray<Element>(container.querySelectorAll(sel));
    }

    // Fire when top of section hits 88% from viewport top
    const ST = (trigger: Element, start = "top 88%") => ({
      trigger,
      start,
      toggleActions: "play none none none" as const,
    });

    // ─────────────────────────────────────────────────────────────────
    // 1. HERO - on-load entrance: left copy rises, right globe punches in
    // ─────────────────────────────────────────────────────────────────
    const hero = document.getElementById("hero-section");
    if (hero) {
      // Hero stat cards: delayed staggered float-in from below
      const statCards = qSA(hero, ".hero-stat-card");
      if (statCards.length) {
        gsap.fromTo(
          statCards,
          { autoAlpha: 0, y: 40, scale: 0.88 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.8)",
            stagger: 0.16,
            delay: 0.7,
          }
        );
      }

      // Globe anchor area: scale-punch from 0.82
      const globe = hero.querySelector<Element>("#hero-globe-anchor");
      if (globe) {
        gsap.fromTo(
          globe,
          { autoAlpha: 0, scale: 0.82, rotateY: -8 },
          {
            autoAlpha: 1,
            scale: 1,
            rotateY: 0,
            duration: 1.1,
            ease: "power4.out",
            delay: 0.2,
          }
        );
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. SPECIALIST DELIVERY TRACKS
    //    VIBE: Rises from deep below with a hard spring overshoot
    //    The entire section lifts from y:160 - unmistakably coming up from below the fold
    // ─────────────────────────────────────────────────────────────────
    const tracks = document.getElementById("specialist-tracks");
    if (tracks) {
      gsap.set(tracks, { transformOrigin: "bottom center" });
      gsap.fromTo(
        tracks,
        { autoAlpha: 0, y: 160, scale: 0.92 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "back.out(1.2)",
          scrollTrigger: ST(tracks),
        }
      );

      // Header staggers in after the section lands
      const headerKids = qSA(tracks, ".flex.flex-col.items-center.text-center > *");
      gsap.fromTo(
        headerKids,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: ST(tracks),
        }
      );

      // Bento cards: stagger fan up
      const bentos = qSA(tracks, ".magic-bento-card");
      gsap.fromTo(
        bentos,
        { autoAlpha: 0, y: 60, scale: 0.93 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.5,
          scrollTrigger: ST(tracks),
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. SPRINT EXECUTION MATRIX
    //    VIBE: Diagonal clip-path wipe from top-left corner
    //    Section reveals like a screen powering on from the top-left
    // ─────────────────────────────────────────────────────────────────
    const matrix = document.getElementById("sprint-execution-matrix");
    if (matrix) {
      gsap.fromTo(
        matrix,
        {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
          autoAlpha: 0,
          x: -60,
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          autoAlpha: 1,
          x: 0,
          duration: 1.0,
          ease: "power4.inOut",
          scrollTrigger: ST(matrix),
        }
      );

      // Steps cascade in from right after wipe completes
      const steps = qSA(matrix, ".rounded-2xl");
      gsap.fromTo(
        steps,
        { autoAlpha: 0, x: 50, scale: 0.94 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.52,
          ease: "power2.out",
          stagger: 0.09,
          delay: 0.55,
          scrollTrigger: ST(matrix),
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. HIRING VELOCITY / CALCULATOR SECTION
    //    VIBE: 3D perspective flip - section tilts in from far away
    //    rotateX: -22 = section starts tilted like a table seen from above, then flips flat
    // ─────────────────────────────────────────────────────────────────
    const calc = document.getElementById("calculator-section");
    if (calc) {
      gsap.set(calc, {
        transformOrigin: "top center",
        transformPerspective: 1200,
      });
      gsap.fromTo(
        calc,
        { autoAlpha: 0, rotateX: -22, y: 80, scale: 0.9 },
        {
          autoAlpha: 1,
          rotateX: 0,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: ST(calc, "top 90%"),
        }
      );

      // Header rises into place
      const headerKids = qSA(calc, ".flex.flex-col.items-center.text-center > *");
      gsap.fromTo(
        headerKids,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.4,
          scrollTrigger: ST(calc, "top 90%"),
        }
      );

      // Cost & Velocity Comparison Grid: lifts & blooms in on scroll with card stagger
      const compGrid = document.getElementById("cost-velocity-comparison");
      if (compGrid) {
        gsap.fromTo(
          compGrid,
          { autoAlpha: 0, y: 60, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: ST(compGrid, "top 88%"),
          }
        );

        // Header elements in comparison grid
        const compHeaderKids = qSA(compGrid, ".border-b > div > *");
        if (compHeaderKids.length) {
          gsap.fromTo(
            compHeaderKids,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.08,
              delay: 0.2,
              scrollTrigger: ST(compGrid, "top 88%"),
            }
          );
        }

        // 4 Benchmark Cards: spring stagger-in with crisp overshoot
        const benchmarkCards = qSA(compGrid, ".grid > div");
        if (benchmarkCards.length) {
          gsap.fromTo(
            benchmarkCards,
            { autoAlpha: 0, y: 40, scale: 0.92 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: "back.out(1.5)",
              stagger: 0.1,
              delay: 0.3,
              scrollTrigger: ST(compGrid, "top 88%"),
            }
          );
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. COMMERCIAL TERMS
    //    VIBE: Blur-to-sharp focus snap + scale - enters out-of-focus, snaps crisp
    //    Like a camera lens pulling focus from blur to sharp clarity
    // ─────────────────────────────────────────────────────────────────
    const commercial = document.getElementById("commercial-terms");
    if (commercial) {
      gsap.fromTo(
        commercial,
        {
          autoAlpha: 0,
          scale: 0.82,
          filter: "blur(18px)",
          y: 40,
        },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: ST(commercial),
        }
      );

      // Model cards spring up with overlap
      const cards = qSA(commercial, ".flex.flex-col.justify-between.rounded-2xl");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 55, scale: 0.88, rotateY: 6 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.72,
          ease: "back.out(1.6)",
          stagger: 0.14,
          delay: 0.32,
          scrollTrigger: ST(commercial),
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // 6. AI HRMS PORTAL
    //    VIBE: Iris / radial clip-path expand from center
    //    Section starts as a tiny circle in the middle and expands outward
    // ─────────────────────────────────────────────────────────────────
    const hrms = document.getElementById("ai-hrms");
    if (hrms) {
      gsap.fromTo(
        hrms,
        {
          clipPath: "circle(0% at 50% 50%)",
          autoAlpha: 0,
        },
        {
          clipPath: "circle(150% at 50% 50%)",
          autoAlpha: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: ST(hrms),
        }
      );

      // Left copy slides from left after iris opens
      const grid = hrms.querySelector<Element>(".relative.mx-auto.grid");
      if (grid) {
        const cols = Array.from(grid.children);
        if (cols[0]) {
          gsap.fromTo(
            cols[0],
            { autoAlpha: 0, x: -70 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.35,
              scrollTrigger: ST(hrms),
            }
          );
          const features = qSA(cols[0], "li");
          gsap.fromTo(
            features,
            { autoAlpha: 0, x: -30 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.42,
              ease: "power2.out",
              stagger: 0.07,
              delay: 0.6,
              scrollTrigger: ST(hrms),
            }
          );
        }
        if (cols[1]) {
          gsap.fromTo(
            cols[1],
            { autoAlpha: 0, x: 70, scale: 0.94 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.45,
              scrollTrigger: ST(hrms),
            }
          );
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 7. PRODUCT SOLUTIONS
    //    VIBE: Skew-slide from right - section enters with a horizontal shear
    //    skewX: -6 + x: 120 gives it a dramatic lean as it slides in
    // ─────────────────────────────────────────────────────────────────
    const portfolio = document.getElementById("case-studies-section");
    if (portfolio) {
      gsap.fromTo(
        portfolio,
        {
          autoAlpha: 0,
          x: 120,
          skewX: -6,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          x: 0,
          skewX: 0,
          scale: 1,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: ST(portfolio),
        }
      );

      // Filter tabs spring in
      const tabs = qSA(portfolio, "button[type='button']");
      gsap.fromTo(
        tabs,
        { autoAlpha: 0, scale: 0.82, y: 14 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.42,
          ease: "back.out(2.0)",
          stagger: 0.07,
          delay: 0.5,
          scrollTrigger: ST(portfolio),
        }
      );

      // Project cards wave in
      const projCards = qSA(portfolio, "div[role='button'].group");
      gsap.fromTo(
        projCards,
        { autoAlpha: 0, y: 60, scale: 0.9, rotateX: 8 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.65,
          scrollTrigger: ST(portfolio),
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // 8. TALENT ECOSYSTEM
    //    VIBE: Drops from above - section descends from y:-120 like a ceiling dropping
    //    Combined with scale(1.08) → 1 gives weight and mass to the landing
    // ─────────────────────────────────────────────────────────────────
    const talent = document.getElementById("talent-ecosystem");
    if (talent) {
      gsap.fromTo(
        talent,
        {
          autoAlpha: 0,
          y: -120,
          scale: 1.06,
          filter: "blur(6px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power4.out",
          scrollTrigger: ST(talent),
        }
      );

      // Header blooms after landing
      const headers = qSA(talent, ".flex.flex-col.items-center.text-center > *");
      gsap.fromTo(
        headers,
        { autoAlpha: 0, y: 22, scale: 1.04 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.38,
          scrollTrigger: ST(talent),
        }
      );

      // Feature cards orbit in from 4 diagonal corners
      const featureItems = qSA(talent, ".grid.grid-cols-2 > a");
      const diagOrigins = [
        { x: -80, y: -60 },
        { x: 80, y: -60 },
        { x: -80, y: 60 },
        { x: 80, y: 60 },
      ];
      featureItems.slice(0, 4).forEach((item, i) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, x: diagOrigins[i % 4].x, y: diagOrigins[i % 4].y, scale: 0.88 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.78,
            ease: "power3.out",
            delay: 0.42 + i * 0.1,
            scrollTrigger: ST(talent),
          }
        );
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // 9. CTA BANNER
    //    VIBE: Hard slam-down punch with slight rotation
    //    Section comes from y:200 + slight rotateZ tilt, slams into place
    // ─────────────────────────────────────────────────────────────────
    const cta = document.getElementById("cta-banner");
    if (cta) {
      gsap.fromTo(
        cta,
        {
          autoAlpha: 0,
          y: 110,
          scale: 0.84,
          rotateZ: -1.5,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 0.95,
          ease: "back.out(1.7)",
          scrollTrigger: ST(cta),
        }
      );

      // Inner card punches even harder
      const innerCard = cta.querySelector<Element>(".relative.overflow-hidden");
      if (innerCard) {
        gsap.fromTo(
          innerCard,
          { autoAlpha: 0, scale: 0.78, y: 40 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "back.out(2.0)",
            delay: 0.15,
            scrollTrigger: ST(cta),
          }
        );

        // Left copy rises staggered
        const leftKids = qSA(innerCard, ".lg\\:col-span-7 > *");
        gsap.fromTo(
          leftKids,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.09,
            delay: 0.35,
            scrollTrigger: ST(cta),
          }
        );

        // Right mockup slides from right
        const rightCol = innerCard.querySelector<Element>(".lg\\:col-span-5");
        if (rightCol) {
          gsap.fromTo(
            rightCol,
            { autoAlpha: 0, x: 70, scale: 0.9 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              delay: 0.5,
              scrollTrigger: ST(cta),
            }
          );
        }
      }
    }

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
