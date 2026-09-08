import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection({
  onOpen,
  onZoom,
}: {
  onOpen: (id: string) => void;
  onZoom: (src: string, alt: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !root.current) return;

    const isMobile = window.matchMedia("(max-width: 850px)").matches;

    const ctx = gsap.context(() => {
      if (isMobile) {
        const panels = root.current!.querySelectorAll(".project-panel");
        panels.forEach((panel, i) => {
          gsap.from(panel, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: panel,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });
        return;
      }

      gsap.set(".projects-track", { xPercent: 0 });

      const track = root.current!.querySelector(".projects-track") as HTMLElement;
      const panels = root.current!.querySelectorAll(".project-panel");
      if (!track || panels.length === 0) return;

      const totalWidth = track.scrollWidth;
      const scrollDistance = Math.max(totalWidth - window.innerWidth + 80, 0);

      const st = ScrollTrigger.create({
        trigger: ".projects-horizontal",
        start: "top top",
        end: `+=${Math.max(scrollDistance, 400)}`,
        pin: true,
        scrub: 1,
        animation: gsap.to(track, {
          x: () => -scrollDistance,
          ease: "none",
        }),
        invalidateOnRefresh: true,
      });

      panels.forEach((panel) => {
        gsap.from(panel, {
          opacity: 0.5,
          y: 40,
          duration: 0.5,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: st.animation,
            start: "left center",
            end: "center center",
            scrub: 1,
          },
        });
      });
    }, root.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-horizontal" id="projects" ref={root}>
      <div className="projects-sticky-head">
        <div className="container">
          <div className="projects-head-row">
            <div>
              <div className="kicker">
                <span className="kicker-line" />
                Our current collection
              </div>
              <h2 className="section-title">
                Places with <em>promise.</em>
              </h2>
            </div>
            <p className="section-desc">
              Every project is chosen with an eye for location, long-term value,
              and the simple joy of finding a place that feels like yours.
            </p>
          </div>
        </div>
      </div>
      <div className="projects-track-wrap">
        <div className="projects-track">
          {projects.map((p, i) => (
            <ProjectPanel
              key={p.id}
              project={p}
              index={i}
              onOpen={onOpen}
              onZoom={onZoom}
            />
          ))}
          <div className="projects-end">
            <div className="projects-end-inner">
              <span>Want to see more?</span>
              <a className="button button-gold" href="#contact">
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPanel({
  project,
  index,
  onOpen,
  onZoom,
}: {
  project: Project;
  index: number;
  onOpen: (id: string) => void;
  onZoom: (src: string, alt: string) => void;
}) {
  return (
    <div className="project-panel">
      <div className="project-panel-image">
        <img
          src={project.image}
          alt={`${project.name} plot project`}
          data-cursor="image"
          data-cursor-label="Zoom"
          onClick={() => onZoom(project.image, `${project.name} plot project`)}
        />
        <div className="project-panel-index">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="project-panel-body">
        <div className="eyebrow">
          <span className="dot" />
          {project.type}
        </div>
        <h3 className="project-panel-title">{project.name}</h3>
        <div className="project-panel-loc">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {project.location}
        </div>
        <div className="project-panel-meta">
          <div className="project-panel-price">
            <span>Starting from</span>
            <strong>{project.price}</strong>
            <small>/ sq.ft</small>
          </div>
          <button
            className="text-link"
            onClick={() => onOpen(project.id)}
          >
            View details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
        {project.offers && (
          <div className="project-panel-offers">
            {project.offers.map((o) => (
              <span key={o} className="offer-chip">{o}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
