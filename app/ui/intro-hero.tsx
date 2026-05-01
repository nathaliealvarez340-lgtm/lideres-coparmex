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
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="max-w-5xl text-center lg:text-left">
          <div className="mb-8 flex items-center justify-center gap-4 lg:justify-start">
            <span className="h-px w-14 bg-gradient-to-r from-[#c8a45d] to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
              Convocatoria estudiantil
            </p>
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-normal text-[#fff8e8] sm:text-7xl lg:text-8xl">
            Forma parte de la Mesa de Líderes COPARMEX
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#e8dfcf]/85 sm:text-2xl sm:leading-10 lg:mx-0">
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

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d8bd7a]/90">
            Acceso en
          </p>
          <div className="mt-4 min-h-[5.2rem] overflow-hidden sm:min-h-[6.4rem] lg:min-h-[7rem]">
            <span
              className="countdown-number block font-mono text-7xl font-semibold leading-none text-[#fff8e8] sm:text-8xl lg:text-7xl xl:text-8xl"
              key={count}
            >
              {String(count).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.28em] text-[#e8dfcf]/62">
            segundos
          </p>
        </div>
      </div>
    </section>
  );
}
