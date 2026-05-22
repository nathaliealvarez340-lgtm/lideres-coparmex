import Image from "next/image";
import { ApplicationForm } from "./ui/application-form";
import { CoordinationCarousel } from "./ui/coordination-carousel";
import { ExperienceCopyCarousel } from "./ui/experience-copy-carousel";
import { IntroHero } from "./ui/intro-hero";
import { SplineBackground } from "./ui/spline-background";

const benefits = [
  {
    emoji: "🎯",
    metric: "01",
    title: "Dirección ejecutiva",
    description:
      "Trabaja con objetivos, responsables y entregables claros, como en un comité profesional.",
  },
  {
    emoji: "🌐",
    metric: "02",
    title: "Red estratégica",
    description:
      "Conecta con perfiles empresariales, aliados y estudiantes que están construyendo trayectoria.",
  },
  {
    emoji: "🚀",
    metric: "03",
    title: "Portafolio real",
    description:
      "Suma experiencia visible en eventos, comunicación, patrocinios y operación institucional.",
  },
  {
    emoji: "🧩",
    metric: "04",
    title: "Criterio de liderazgo",
    description:
      "Aprende a decidir, priorizar y ejecutar con seriedad sin perder la energía universitaria.",
  },
];

const coordinations = [
  {
    emoji: "📣",
    name: "Comunicación y Redes",
    description:
      "Construye la presencia pública del capítulo a través de narrativa, contenido, identidad visual y comunicación estratégica.",
    benefits: [
      "Fortaleces marca y posicionamiento.",
      "Creas contenido con intención.",
      "Aprendes comunicación institucional.",
      "Documentas eventos y logros.",
      "Conviertes ideas en mensajes que conectan.",
    ],
  },
  {
    emoji: "🪙",
    name: "Patrocinios",
    description:
      "Gestiona alianzas con empresas, marcas y aliados estratégicos para generar recursos, visibilidad y valor para el capítulo.",
    benefits: [
      "Desarrollas negociación real.",
      "Conectas con empresas y tomadores de decisión.",
      "Aprendes a vender propuestas de valor.",
      "Fortaleces relaciones institucionales.",
      "Generas impacto medible para el capítulo.",
    ],
  },
  {
    emoji: "🤝",
    name: "Vinculación",
    description:
      "Conecta talento, miembros, aliados y oportunidades para ampliar la red del capítulo y fortalecer su impacto dentro y fuera del campus.",
    benefits: [
      "Identificas perfiles de alto potencial.",
      "Construyes comunidad estratégica.",
      "Fortaleces networking con propósito.",
      "Impulsas reclutamiento y alianzas.",
      "Conectas personas con oportunidades reales.",
    ],
  },
  {
    emoji: "🛠️",
    name: "Logística",
    description:
      "Coordina la operación detrás de cada experiencia: espacios, tiempos, recursos y ejecución para que todo funcione con precisión.",
    benefits: [
      "Desarrollas criterio operativo.",
      "Aprendes a resolver presión real.",
      "Coordinas personas, tiempos y recursos.",
      "Fortaleces planeación y ejecución.",
      "Conviertes ideas en experiencias funcionales.",
    ],
  },
];

const coordinationNames = coordinations.map((coordination) => coordination.name);

const partnerLogos = [
  { src: "/logos/coparmex-white.png", alt: "COPARMEX", className: "logo-coparmex" },
  { src: "/logos/tec-white.png", alt: "Tecnológico de Monterrey", className: "logo-tec" },
  { src: "/logos/genuino-white.png", alt: "Genuino", className: "logo-genuino" },
  { src: "/logos/maia-white.png", alt: "Maia", className: "logo-maia" },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-transparent text-[#fff8e8]">
      <SplineBackground />
      <div className="fixed inset-0 z-10 bg-[#030204]/50" />
      <div className="fixed inset-0 z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(8,78,118,0.36),transparent_34%),radial-gradient(circle_at_82%_28%,rgba(93,224,230,0.14),transparent_28%),linear-gradient(180deg,rgba(3,2,4,0.04),rgba(3,2,4,0.5)_86%)]" />

      <div className="relative z-20">
        <IntroHero />

        <section
          className="relative px-6 pb-12 pt-24 sm:px-10 sm:pb-14 lg:px-14 lg:pb-16 lg:pt-32"
          id="experiencia"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="section-kicker">La experiencia</p>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
                  Un espacio selectivo para liderar con criterio.
                </h2>
              </div>
              <div className="glass-panel p-7 sm:p-9">
                <ExperienceCopyCarousel />
              </div>
            </div>

            <CoparmexChapterInfo />

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((benefit) => (
                <article className="feature-card" key={benefit.title}>
                  <span className="font-mono text-sm text-[#5de0e6]">
                    {benefit.metric}
                  </span>
                  <h3>
                    <span aria-hidden="true">{benefit.emoji}</span>{" "}
                    {benefit.title.toUpperCase()}
                  </h3>
                  <p className="mt-4 leading-7 text-[#e8dfcf]/72">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-20 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <p className="section-kicker">Coordinaciones operativas</p>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                  Elige una trinchera. Construye desde ahí.
                </h2>
                <p className="mt-6 text-lg leading-8 text-[#e8dfcf]/72">
                  Cada coordinación sostiene una parte crítica de la mesa:
                  narrativa, alianzas, control y ejecución.
                </p>
              </div>

              <CoordinationCarousel coordinations={coordinations} />
            </div>
          </div>
        </section>

        <section
          className="relative px-6 pb-24 pt-10 sm:px-10 lg:px-14 lg:pb-32 lg:pt-12"
          id="postulacion"
        >
          <SelectionProcess />
          <ProcessDetails />
          <BuildPathBlock />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="sticky top-10 hidden lg:block">
              <p className="section-kicker">Postulación</p>
              <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">
                Tu siguiente rol empieza con una decisión.
              </h2>
            <p className="mt-7 text-lg leading-8 text-[#e8dfcf]/72">
              Completa tu información con intención. Buscamos perfiles con
              claridad, compromiso y ganas de asumir responsabilidad real.
            </p>
            <div className="mt-10 h-px w-full bg-gradient-to-r from-[#5de0e6] via-[#084e76] to-transparent" />
            <LogoGrid />
            <MaiaTrustCopy />
          </div>

          <div>
            <div className="mb-8 lg:hidden">
              <p className="section-kicker">Postulación</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-normal">
                Tu siguiente rol empieza con una decisión.
              </h2>
              <LogoGrid />
              <MaiaTrustCopy />
            </div>
            <ApplicationForm coordinations={coordinationNames} />
          </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BuildPathBlock() {
  return (
    <div className="build-path-block mx-auto mb-24 max-w-7xl">
      <div className="build-path-panel">
        <div>
          <p className="section-kicker">CONSTRUYE TU CAMINO</p>
          <h2>
            <span>No es solo networking.</span>
            <span>Aquí no esperas oportunidades: las generas.</span>
          </h2>
        </div>
        <div className="build-path-copy">
          <p>
            Este espacio es para quienes ya están construyendo algo: un
            proyecto, una idea, una iniciativa real.
          </p>
          <p>
            No buscamos intención vacía. Buscamos dirección, criterio y
            compromiso para convertir ideas en acción.
          </p>
          <strong>
            Si ya estás construyendo algo, este es el lugar para llevarlo más
            lejos.
          </strong>
        </div>
      </div>
    </div>
  );
}

function CoparmexChapterInfo() {
  const items = [
    {
      title: "¿Qué es COPARMEX?",
      text: "COPARMEX es una organización empresarial que busca fortalecer el desarrollo económico, el liderazgo, la participación empresarial y la construcción de una sociedad más competitiva, ética y sostenible en México.",
    },
    {
      title: "Objetivo del capítulo",
      text: "Formar estudiantes con iniciativa, pensamiento estratégico y capacidad de ejecución, conectándolos con empresarios, oportunidades, innovación y experiencias que impulsen su crecimiento profesional y personal.",
    },
  ];

  return (
    <div className="coparmex-chapter-section">
      <p className="section-kicker">COPARMEX Y EL CAPÍTULO</p>
      <div className="coparmex-chapter-grid">
        {items.map((item) => (
          <article className="coparmex-info-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SelectionProcess() {
  const phases = [
    {
      title: "Postúlate",
      text: "Completa tu perfil y comparte tu motivación.",
    },
    {
      title: "Confirmación",
      text: "Recibimos tu solicitud y validamos tu información.",
    },
    {
      title: "Entrevista",
      text: "Si avanzas, te contactaremos para la siguiente fase.",
    },
    {
      title: "Integración",
      text: "En caso de aprobación, formarás parte del equipo.",
    },
  ];

  return (
    <div className="selection-process mx-auto mb-20 max-w-7xl">
      <p className="section-kicker">PROCESO DE SELECCIÓN</p>
      <div className="process-track">
        {phases.map((phase, index) => (
          <div className="process-step" key={phase.title}>
            <span className="process-step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="process-copy">
              <span>Fase {index + 1}</span>
              <h3>{phase.title}</h3>
              <p>{phase.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessDetails() {
  const steps = [
    {
      title: "Agenda tu entrevista",
      text: "Recibirás un enlace para elegir el día y horario que mejor se adapte a ti.",
    },
    {
      title: "Confirmación",
      text: "Te enviaremos un recordatorio 3 horas antes para confirmar tu asistencia.",
    },
    {
      title: "Entrevista estratégica",
      text: "20–35 min divididos en:",
      items: [
        "Presentación",
        "Preguntas y conversación",
        "Caso práctico aplicado al cargo",
      ],
    },
    {
      title: "Revisión de perfil",
      text: "Evaluamos experiencia, iniciativa, visión y compatibilidad con la coordinación.",
    },
    {
      title: "Resultado final",
      text: "Recibirás un mensaje con el resultado y los siguientes pasos del proceso.",
    },
  ];

  return (
    <div className="process-details mx-auto mb-24 max-w-7xl">
      <div className="process-details-heading">
        <p className="section-kicker">¿CÓMO FUNCIONA EL PROCESO?</p>
        <p>Conoce cómo funciona cada etapa del proceso de selección.</p>
      </div>

      <div className="process-details-track">
        {steps.map((step, index) => (
          <article className="process-detail-card" key={step.title}>
            <span className="process-detail-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="process-detail-content">
              <h3>{step.title.toUpperCase()}</h3>
              <p>{step.text}</p>
              {step.items ? (
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MaiaTrustCopy() {
  return (
    <div className="maia-trust-copy">
      <p>
        Desarrollado por MAIA
        <span className="registered-mark">®</span> para fortalecer procesos de
        convocatoria, selección y gestión de talento joven.
      </p>
      <p>Presentado por Genuino.</p>
      <p>
        La información proporcionada será utilizada exclusivamente para fines de
        evaluación dentro del proceso de selección.
      </p>
      <p>
        <a
          aria-label="Acceso administrativo"
          className="admin-footer-link"
          href="/admin"
        >
          COPARMEX
        </a>
      </p>
    </div>
  );
}

function LogoGrid() {
  return (
    <div className="logo-grid-panel mt-10" aria-label="Aliados de la convocatoria">
      {partnerLogos.map((logo) => (
        <Image
          alt={logo.alt}
          className={`partner-logo ${logo.className}`}
          height={80}
          key={logo.src}
          src={logo.src}
          width={240}
        />
      ))}
    </div>
  );
}


