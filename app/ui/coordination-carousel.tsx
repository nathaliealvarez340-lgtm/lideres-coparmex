"use client";

import { useEffect, useState } from "react";

type Coordination = {
  name: string;
  description: string;
};

type CoordinationCarouselProps = {
  coordinations: Coordination[];
};

export function CoordinationCarousel({
  coordinations,
}: CoordinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const active = coordinations[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % coordinations.length);
      setIsExpanded(false);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [coordinations.length]);

  function goToPrevious() {
    setActiveIndex(
      (current) => (current - 1 + coordinations.length) % coordinations.length,
    );
    setIsExpanded(false);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % coordinations.length);
    setIsExpanded(false);
  }

  function goToIndex(index: number) {
    setActiveIndex(index);
    setIsExpanded(false);
  }

  return (
    <div className="coordination-carousel" aria-label="Coordinaciones">
      <button
        aria-expanded={isExpanded}
        className={`coordination-feature-card ${isExpanded ? "is-expanded" : ""}`}
        key={active.name}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <div className="coordination-feature-topline">
          <span className="coordination-number">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="coordination-icon" aria-hidden="true">
            <Icon index={activeIndex} />
          </span>
        </div>
        <h3>{active.name}</h3>
        <div className="coordination-description" aria-hidden={!isExpanded}>
          <p>{active.description}</p>
        </div>
      </button>

      <div className="coordination-controls">
        <button aria-label="Coordinación anterior" onClick={goToPrevious} type="button">
          ‹
        </button>
        <div className="coordination-dots" aria-label="Indicadores">
          {coordinations.map((coordination, index) => (
            <button
              aria-label={`Mostrar ${coordination.name}`}
              aria-current={index === activeIndex}
              className={index === activeIndex ? "is-active" : ""}
              key={coordination.name}
              onClick={() => goToIndex(index)}
              type="button"
            />
          ))}
        </div>
        <button aria-label="Siguiente coordinación" onClick={goToNext} type="button">
          ›
        </button>
      </div>
    </div>
  );
}

function Icon({ index }: { index: number }) {
  const icons = [
    <MegaphoneIcon key="marketing" />,
    <HandshakeIcon key="sponsor" />,
    <ClipboardIcon key="admin" />,
    <RouteIcon key="logistics" />,
  ];

  return icons[index];
}

function MegaphoneIcon() {
  return (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 25h7l17 9V14l-17 9H9v2Z" />
      <path d="M16 25v10c0 2 1.5 4 3.6 4H23" />
      <path d="M37 19c2 1.2 3 3 3 5s-1 3.8-3 5" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="m18 29 5 5c1.4 1.4 3.6 1.4 5 0l2-2" />
      <path d="m28 21 5 5 2-2c2-2 2-5 0-7l-3-3-7 7" />
      <path d="m20 22-5 5-2-2c-2-2-2-5 0-7l3-3 5 5" />
      <path d="M21 20h7" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10h14l2 5H15l2-5Z" />
      <path d="M15 14h-3v26h24V14h-3" />
      <path d="m18 27 4 4 8-9" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 14a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
      <path d="M33 24a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
      <path d="M15 24v2c0 4 3 6 7 6h6" />
    </svg>
  );
}
