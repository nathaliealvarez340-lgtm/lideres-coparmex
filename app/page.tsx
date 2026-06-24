import Image from "next/image";
import { CoordinationCarousel } from "./ui/coordination-carousel";
import { ExperienceCopyCarousel } from "./ui/experience-copy-carousel";
import { IntroHero } from "./ui/intro-hero";
import { ProfileTestGate } from "./ui/profile-test-gate";
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
    emoji: "👥",
    name: "Miembro COPARMEX",
    shortDescription:
      "Forma parte activa de la comunidad, participa en proyectos, eventos y experiencias del capítulo.",
    description:
      "Como Miembro COPARMEX te integras al ecosistema del capítulo para participar en actividades, colaborar en iniciativas y desarrollar habilidades de liderazgo, networking y ejecución dentro de una comunidad empresarial universitaria.",
    benefits: [
      "Participas en proyectos y eventos reales.",
      "Desarrollas liderazgo y visión empresarial.",
      "Conectas con estudiantes, empresarios y aliados.",
      "Exploras distintas áreas antes de especializarte.",
      "Construyes experiencia dentro del ecosistema COPARMEX.",
    ],
  },
  {
    emoji: "🛠️",
    name: "Logística",
    shortDescription:
      "Apoya la planeación, organización y ejecución de eventos y experiencias del capítulo.",
    description:
      "El área de Logística coordina tiempos, espacios, materiales, proveedores y operación para que cada actividad se ejecute con orden, precisión y buena experiencia para los asistentes.",
    benefits: [
      "Aprendes ejecución operativa real.",
      "Coordinas eventos y experiencias.",
      "Resuelves imprevistos con criterio.",
      "Desarrollas planeación y organización.",
      "Haces que las ideas sucedan.",
    ],
  },
  {
    emoji: "🪙",
    name: "Patrocinios",
    shortDescription:
      "Apoya la gestión de alianzas, marcas y recursos para fortalecer los proyectos del capítulo.",
    description:
      "El área de Patrocinios conecta al capítulo con empresas, marcas y aliados estratégicos para generar recursos, colaboraciones y propuestas de valor que hagan crecer el impacto de cada iniciativa.",
    benefits: [
      "Aprendes negociación y prospección.",
      "Conectas con empresas y aliados.",
      "Desarrollas propuestas de valor.",
      "Fortaleces relaciones institucionales.",
      "Impulsas recursos para proyectos reales.",
    ],
  },
  {
    emoji: "📣",
    name: "Comunicación y Redes",
    shortDescription:
      "Apoya la presencia digital, narrativa, contenido e imagen pública del capítulo.",
    description:
      "El área de Comunicación y Redes construye la voz, imagen y presencia pública del capítulo a través de contenido, diseño, cobertura de eventos, storytelling y comunicación estratégica.",
    benefits: [
      "Creas contenido con intención.",
      "Fortaleces marca y posicionamiento.",
      "Desarrollas comunicación estratégica.",
      "Documentas eventos y logros.",
      "Conviertes ideas en mensajes que conectan.",
    ],
  },
  {
    emoji: "🤝",
    name: "Vinculación",
    shortDescription:
      "Apoya la conexión entre talento, comunidad, aliados y oportunidades dentro del ecosistema empresarial.",
    description:
      "El área de Vinculación fortalece la red del capítulo conectando estudiantes, miembros, empresarios, aliados y oportunidades para ampliar el impacto de la comunidad dentro y fuera del campus.",
    benefits: [
      "Construyes networking con propósito.",
      "Identificas perfiles de alto potencial.",
      "Conectas personas con oportunidades.",
      "Apoyas reclutamiento e integración.",
      "Fortaleces comunidad estratégica.",
    ],
  },
  {
    emoji: "🌱",
    name: "Responsabilidad Social",
    shortDescription:
      "Apoya proyectos con impacto social, ética empresarial y compromiso comunitario.",
    description:
      "El área de Responsabilidad Social impulsa iniciativas que conectan liderazgo estudiantil con impacto positivo, sostenibilidad, ética empresarial y acciones orientadas al bien común dentro y fuera del campus.",
    benefits: [
      "Desarrollas liderazgo con propósito.",
      "Impulsas proyectos de impacto real.",
      "Conectas empresa, comunidad y estudiantes.",
      "Fortaleces visión social y ética empresarial.",
      "Conviertes ideas en acciones con valor público.",
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
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="section-kicker">La experiencia</p>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
                  Un espacio selectivo para liderar con criterio.
                </h2>
              </div>
              <ExperienceCopyCarousel />
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
                <p className="section-kicker">Áreas de trabajo</p>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                  Elige dónde aportar. Construye desde ahí.
                </h2>
                <p className="mt-6 text-lg leading-8 text-[#e8dfcf]/72">
                  Cada área sostiene una parte crítica del capítulo: comunidad,
                  operación, alianzas, comunicación, vinculación e impacto.
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
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
            <div className="postulation-aside sticky top-10 hidden lg:flex lg:flex-col">
              <p className="section-kicker">Postulación</p>
              <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">
                Tu siguiente rol empieza con una decisión.
              </h2>
            <p className="mt-7 text-lg leading-8 text-[#e8dfcf]/72">
              Completa tu información con intención. Buscamos perfiles con
              claridad, compromiso y ganas de asumir responsabilidad real.
            </p>
            <div className="postulation-aside-footer">
            <div className="mt-10 h-px w-full bg-gradient-to-r from-[#5de0e6] via-[#084e76] to-transparent" />
            <LogoGrid />
            <MaiaTrustCopy />
            </div>
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
            <ProfileTestGate coordinations={coordinationNames} />
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
            No buscamos intención vacía. Buscamos dirección, criterio y
            compromiso.
          </p>
          <p>
            Trabajamos con empresarios, directivos y socios COPARMEX que ya
            están transformando la economía de México. Generamos oportunidades
            reales, ejecutamos proyectos con impacto y construimos juntos la
            generación empresarial que el país necesita.
          </p>
          <strong>Si tienes algo que aportar, aquí lo hacemos crecer.</strong>
        </div>
      </div>
    </div>
  );
}

function CoparmexChapterInfo() {
  const items = [
    {
      title: "¿Qué es COPARMEX?",
      text: "COPARMEX es uno de los organismos empresariales más importantes de México. Agrupa a más de 36,000 empresas en todo el país y opera con total independencia del gobierno, lo que le permite defender con libertad la libre empresa, el estado de derecho y la responsabilidad social. Su misión es construir un México con más y mejores empresas, donde el emprendimiento y la innovación sean los motores del desarrollo. Nosotros somos parte de esa misión desde la universidad.",
    },
    {
      title: "Objetivo del capítulo",
      text: "Construimos una comunidad universitaria comprometida con el bien común. Impulsamos el emprendimiento, la innovación y la creación de más y mejores empresas, de la mano de COPARMEX y con el respaldo del Tec de Monterrey Campus Ciudad de México. Trabajamos para formar agentes de cambio que generen nuevas oportunidades — para ellos mismos y para México.",
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
        "Caso práctico aplicado al área",
      ],
    },
    {
      title: "Revisión de perfil",
      text: "Evaluamos experiencia, iniciativa, visión y compatibilidad con el área de interés.",
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


