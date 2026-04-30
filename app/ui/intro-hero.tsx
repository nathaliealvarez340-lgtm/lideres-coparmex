"use client";

import { useEffect, useState } from "react";

export function IntroHero() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCount((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [count]);

  return (
    <section className="relative flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-14 bg-gradient-to-r from-[#c8a45d] to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
              Convocatoria estudiantil
            </p>
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-normal text-[#fff8e8] sm:text-7xl lg:text-8xl">
            Forma parte de la Mesa de Líderes COPARMEX
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#e8dfcf]/85 sm:text-2xl sm:leading-10">
            Entra a una comunidad selectiva donde el liderazgo joven se prueba
            en proyectos reales, alianzas estratégicas y decisiones que abren
            camino dentro del ecosistema empresarial.
          </p>

          <div
            className={`mt-11 transition duration-700 ${
              count === 0
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <a className="premium-button" href="#experiencia">
              Postúlate ahora
            </a>
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden p-7">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e5c477] to-transparent" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
            Acceso en
          </p>
          <div className="mt-6 flex items-end gap-4">
            <span className="font-mono text-8xl font-semibold leading-none text-[#fff8e8] sm:text-9xl">
              {count}
            </span>
            <span className="mb-4 text-sm uppercase tracking-[0.24em] text-[#e8dfcf]/60">
              segundos
            </span>
          </div>
          <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7a1119] via-[#c8a45d] to-[#fff0a8] transition-all duration-700"
              style={{ width: `${((5 - count) / 5) * 100}%` }}
            />
          </div>
          <p className="mt-6 text-sm leading-6 text-[#e8dfcf]/70">
            La postulación se desbloquea al terminar la introducción.
          </p>
        </div>
      </div>
    </section>
  );
}
