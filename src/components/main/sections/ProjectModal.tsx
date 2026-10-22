"use client";

import React, { useEffect, useRef } from "react";
import { Project } from "@/types/portfolio";
import { createPortal } from "react-dom";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    const win = typeof window !== "undefined" ? (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }) : null;
    if (win?.lenis && typeof win.lenis.stop === "function") {
      win.lenis.stop();
    }
    return () => {
      if (win?.lenis && typeof win.lenis.start === "function") {
        win.lenis.start();
      }
    };
  }, [project]);

  if (typeof document === "undefined") return null;

  const techList =
    project.caseStudy?.techStack ||
    (project.tags && project.tags.length > 0
      ? project.tags
      : ["Next.js", "TypeScript", "Tailwind CSS", "Enterprise Architecture", "Cloud Native"]);

  const githubUrl = project.github || "https://github.com/pepoltek";
  const liveUrl =
    project.liveDemo ||
    project.live ||
    (project.url && project.url !== "#" ? project.url : "https://pepoltek.com");

  return createPortal(
    <div
      ref={containerRef}
      className="case-study-page"
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <header className="case-study-page-header">
        <button
          className="case-study-back-btn font-display"
          onClick={onClose}
          aria-label="Back to Portfolio"
        >
          <svg
            className="btn-back-arrow"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span>Back to Portfolio</span>
        </button>
      </header>

      <div className="case-study-page-hero">
        <div className="case-study-page-hero-img-wrapper">
          <img
            src={project.image}
            alt={project.alt || project.title}
            className="case-study-page-hero-img"
          />
        </div>
        <div className="case-study-page-hero-overlay">
          <div className="case-study-page-container">
            <p className="case-study-page-hero-subtitle font-mono">
              {project.labelLeft || "ENTERPRISE"} • {project.labelRight || "CLOUD TEAM"}
            </p>
            <h1 className="case-study-page-hero-title font-display">
              {project.titleTop || project.title} <br className="title-br" /> {project.titleBottom || "SOLUTION"}
            </h1>
          </div>
        </div>
      </div>

      <div className="case-study-page-container case-study-page-content-wrapper">
        <div className="case-study-page-grid">
          <div className="case-study-page-left">
            <div className="case-study-page-section">
              <h2 className="case-study-page-section-title font-display">The Challenge</h2>
              <p className="case-study-page-text font-sans">
                {project.caseStudy?.challenge ||
                  project.description ||
                  "Modern enterprise operations demand high throughput, low latency data processing, automated compliance pipelines, and unified dashboard analytics without administrative friction."}
              </p>
            </div>

            <div className="case-study-page-section">
              <h2 className="case-study-page-section-title font-display">The Solution</h2>
              <p className="case-study-page-text font-sans">
                {project.caseStudy?.solution ||
                  project.overview ||
                  "Engineered a scalable multi-tenant cloud-native platform featuring unified telemetry, real-time data sync, automated scheduling algorithms, and responsive reactive interfaces."}
              </p>
            </div>
          </div>

          <div className="case-study-page-right">
            <div className="case-study-page-section">
              <h2 className="case-study-page-section-title font-display">Key Results</h2>
              <p className="case-study-page-text font-sans">
                {project.caseStudy?.results ||
                  "Achieved 99.99% uptime reliability, 65% reduction in administrative overhead, and seamless operational velocity across all distributed environments."}
              </p>
            </div>

            <div className="case-study-page-section">
              <h2 className="case-study-page-section-title font-display">Tech Stack</h2>
              <div className="case-study-page-tech-tags">
                {techList.map((tech) => (
                  <span key={tech} className="tech-page-tag font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="case-study-page-section">
              <h2 className="case-study-page-section-title font-display">Project Links</h2>
              <div className="case-study-links-group">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-link-btn github font-mono"
                >
                  <svg
                    className="link-icon"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>

                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-link-btn live font-mono"
                >
                  <svg
                    className="link-icon"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {project.screenshots && project.screenshots.length > 0 && (
          <div className="case-study-page-gallery-section">
            <h2 className="case-study-page-section-title gallery-title font-display">Interface Showcase</h2>
            <div className="case-study-gallery-scroll">
              {project.screenshots.map((s, sIdx) => {
                const src = typeof s === "string" ? s : s.src;
                const label = typeof s === "string" ? `View ${sIdx + 1}` : s.label;
                const isLand = typeof s === "string" ? false : s.isLandscape;
                return (
                  <div key={sIdx} className={`case-study-gallery-card ${isLand ? "landscape" : ""}`}>
                    <div className="gallery-img-wrapper">
                      <img src={src} alt={label} className="gallery-img" />
                    </div>
                    <span className="gallery-img-label font-mono">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .case-study-page {
          z-index: 99999;
          color: #0a1428;
          background: #eef4fd;
          display: block;
          position: fixed;
          inset: 0;
          overflow-y: auto;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .case-study-page::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
        }

        .case-study-page-header {
          z-index: 100;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(238, 244, 253, 0.85);
          border-bottom: 1px solid #bcd6fa;
          align-items: center;
          height: 76px;
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
          -webkit-backdrop-filter: blur(10px);
          background: #ffffff;
          border: 1px solid #bcd6fa;
          border-radius: 6px;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.25rem;
          font-family: var(--font-sora), sans-serif;
          font-size: clamp(0.75rem, 0.8vw, 0.95rem);
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: inline-flex;
          box-shadow: 0 4px 14px rgba(10, 132, 255, 0.08);
        }

        .case-study-back-btn:hover {
          color: #0a84ff;
          border-color: #0a84ff;
          background: rgba(10, 132, 255, 0.06);
          box-shadow: 0 0 18px rgba(10, 132, 255, 0.25);
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
          height: 55vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: #0a1428;
        }

        .case-study-page-hero-img-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .case-study-page-hero-img {
          object-fit: cover;
          filter: brightness(0.65) contrast(1.05);
          width: 100%;
          height: 100%;
          transition: transform 8s ease-out;
        }

        .case-study-page:hover .case-study-page-hero-img {
          transform: scale(1.04);
        }

        .case-study-page-hero-overlay {
          z-index: 2;
          background: linear-gradient(rgba(238, 244, 253, 0) 0%, rgba(238, 244, 253, 0.75) 40%, #eef4fd 90%);
          width: 100%;
          padding: 5rem 0 2rem;
          position: relative;
        }

        .case-study-page-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .case-study-page-hero-title {
          color: #0a1428;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          font-family: var(--font-sora), sans-serif;
          font-size: clamp(2rem, 4.5vw, 4rem);
          font-weight: 900;
          line-height: 1.05;
        }

        .case-study-page-hero-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #0a84ff;
          margin-bottom: 0.75rem;
          font-size: clamp(0.75rem, 0.8vw, 0.95rem);
          font-weight: 700;
          font-family: var(--font-jetbrains-mono), monospace;
        }

        .case-study-page-content-wrapper {
          padding-top: 3rem;
          padding-bottom: 6rem;
        }

        .case-study-page-grid {
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          display: grid;
        }

        .case-study-page-left,
        .case-study-page-right {
          flex-direction: column;
          gap: 3.5rem;
          padding-top: 0.5rem;
          display: flex;
        }

        .case-study-page-section {
          flex-direction: column;
          gap: 1rem;
          display: flex;
        }

        .case-study-page-section-title {
          text-transform: uppercase;
          color: #0a84ff;
          letter-spacing: 0.05em;
          border-left: 3px solid #0a84ff;
          padding: 0.2rem 0 0.2rem 1rem;
          font-family: var(--font-sora), sans-serif;
          font-size: clamp(1.1rem, 1.3vw, 1.45rem);
          font-weight: 800;
          line-height: 1.3;
        }

        .case-study-page-text {
          color: #3d4c68;
          text-align: justify;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(0.9rem, 1vw, 1.02rem);
          font-weight: 450;
          line-height: 1.75;
        }

        .case-study-page-tech-tags {
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 0.25rem;
          display: flex;
        }

        .tech-page-tag {
          color: #0a1428;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #ffffff;
          border: 1px solid #bcd6fa;
          border-radius: 6px;
          padding: 0.45rem 0.9rem;
          font-size: clamp(0.72rem, 0.78vw, 0.88rem);
          font-weight: 600;
          font-family: var(--font-jetbrains-mono), monospace;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(10, 132, 255, 0.04);
        }

        .tech-page-tag:hover {
          color: #0a84ff;
          background: rgba(10, 132, 255, 0.08);
          border-color: #0a84ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(10, 132, 255, 0.18);
        }

        .case-study-links-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .case-study-link-btn {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: clamp(0.75rem, 0.8vw, 0.88rem);
          font-weight: 700;
          border-radius: 6px;
          padding: 0.65rem 1.3rem;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .case-study-link-btn.github {
          color: #0a1428;
          background: #ffffff;
          border: 1px solid #bcd6fa;
          box-shadow: 0 4px 14px rgba(10, 132, 255, 0.08);
        }

        .case-study-link-btn.github:hover {
          color: #0a84ff;
          border-color: #0a84ff;
          box-shadow: 0 6px 18px rgba(10, 132, 255, 0.2);
          transform: translateY(-1px);
        }

        .case-study-link-btn.live {
          background: #0a84ff;
          border: 1px solid #0a84ff;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(10, 132, 255, 0.35);
        }

        .case-study-link-btn.live:hover {
          background: #0066cc;
          border-color: #0066cc;
          box-shadow: 0 6px 22px rgba(10, 132, 255, 0.5);
          transform: translateY(-1px);
        }

        .case-study-page-gallery-section {
          margin-top: 5rem;
        }

        .case-study-gallery-scroll {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .case-study-gallery-card {
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #bcd6fa;
          padding: 0.75rem;
          box-shadow: 0 6px 20px rgba(10, 132, 255, 0.06);
        }

        .gallery-img-wrapper {
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/10;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-img-label {
          display: block;
          margin-top: 0.5rem;
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 0.75rem;
          color: #3d4c68;
        }

        @media (max-width: 820px) {
          .case-study-page-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .case-study-page-left,
          .case-study-page-right {
            gap: 2.5rem;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
