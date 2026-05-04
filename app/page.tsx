import Image from "next/image";
import { ApplicationForm } from "./ui/application-form";
import { CoordinationCarousel } from "./ui/coordination-carousel";
import { IntroHero } from "./ui/intro-hero";

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
    name: "Comunicación y Marketing",
    description:
      "Diseña la narrativa del capítulo, comunica iniciativas, fortalece la presencia digital y convierte cada actividad en una experiencia visible y memorable.",
  },
  {
    emoji: "🪙",
    name: "Patrocinios",
    description:
      "Construye relaciones con aliados, desarrolla propuestas de valor, da seguimiento comercial y ayuda a convertir conexiones en oportunidades reales.",
  },
  {
    emoji: "🗂️",
    name: "Administrativa",
    description:
      "Organiza documentación, acuerdos, presupuestos, registros y procesos internos para que la mesa opere con claridad, orden y continuidad.",
  },
  {
    emoji: "🛠️",
    name: "Logística",
    description:
      "Planea experiencias, coordina recursos, tiempos, espacios y ejecución en sitio para que cada iniciativa funcione con precisión.",
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
    <main className="relative min-h-screen overflow-hidden bg-[#030204] text-[#fff8e8]">
      <video
        aria-hidden="true"
        autoPlay
        className="fixed inset-0 z-0 h-full w-full object-cover"
        loop
        muted
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 z-10 bg-[#030204]/48" />
      <div className="fixed inset-0 z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(136,20,30,0.34),transparent_34%),radial-gradient(circle_at_82%_28%,rgba(200,164,93,0.14),transparent_28%),linear-gradient(180deg,rgba(3,2,4,0.04),rgba(3,2,4,0.46)_86%)]" />

      <div className="relative z-20">
        <IntroHero />

        <section
          className="relative px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
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
                <p className="text-lg leading-8 text-[#e8dfcf]/82">
                  La Mesa de Líderes COPARMEX reúne a estudiantes con
                  iniciativa, visión y disciplina para transformar ideas en
                  proyectos con estándar ejecutivo. No es un club de asistencia:
                  es un punto de encuentro para quienes quieren aprender a
                  operar, comunicar, negociar y representar con criterio.
                </p>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((benefit) => (
                <article className="feature-card" key={benefit.title}>
                  <span className="font-mono text-sm text-[#c8a45d]">
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
          className="relative px-6 pb-24 pt-24 sm:px-10 lg:px-14 lg:pb-32 lg:pt-36"
          id="postulacion"
        >
          <SelectionProcess />
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
            <div className="mt-10 h-px w-full bg-gradient-to-r from-[#c8a45d] via-[#7a1119] to-transparent" />
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
          <h2>No es solo networking. Aquí no esperas oportunidades: las generas.</h2>
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
