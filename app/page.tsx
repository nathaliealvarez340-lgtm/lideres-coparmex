import { ApplicationForm } from "./ui/application-form";
import { IntroHero } from "./ui/intro-hero";

const benefits = [
  {
    metric: "01",
    title: "Dirección ejecutiva",
    description:
      "Trabaja con objetivos, responsables y entregables claros, como en un comité profesional.",
  },
  {
    metric: "02",
    title: "Red estratégica",
    description:
      "Conecta con perfiles empresariales, aliados y estudiantes que están construyendo trayectoria.",
  },
  {
    metric: "03",
    title: "Portafolio real",
    description:
      "Suma experiencia visible en eventos, comunicación, patrocinios y operación institucional.",
  },
  {
    metric: "04",
    title: "Criterio de liderazgo",
    description:
      "Aprende a decidir, priorizar y ejecutar con seriedad sin perder la energía universitaria.",
  },
];

const coordinations = [
  {
    name: "Comunicación y Marketing",
    description:
      "Narrativa, redes, identidad visual y posicionamiento de cada iniciativa.",
  },
  {
    name: "Patrocinios",
    description:
      "Relación con aliados, propuestas de valor y seguimiento comercial.",
  },
  {
    name: "Administrativa",
    description:
      "Control, documentación, presupuesto y orden interno para que todo avance.",
  },
  {
    name: "Logística",
    description:
      "Planeación de experiencias, coordinación en sitio y ejecución impecable.",
  },
];

const coordinationNames = coordinations.map((coordination) => coordination.name);

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030204] text-[#fff8e8]">
      <video
        aria-hidden="true"
        autoPlay
        className="fixed inset-0 -z-30 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster=""
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 -z-20 bg-[#030204]/72" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(136,20,30,0.42),transparent_31%),radial-gradient(circle_at_82%_28%,rgba(200,164,93,0.16),transparent_26%),linear-gradient(180deg,rgba(3,2,4,0.18),rgba(3,2,4,0.92)_78%)]" />

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
                Un espacio selectivo para liderar antes de graduarte.
              </h2>
            </div>
            <div className="glass-panel p-7 sm:p-9">
              <p className="text-lg leading-8 text-[#e8dfcf]/82">
                La Mesa de Líderes COPARMEX reúne a estudiantes con iniciativa,
                visión y disciplina para transformar ideas en proyectos con
                estándar ejecutivo. No es un club de asistencia: es un punto de
                encuentro para quienes quieren aprender a operar, comunicar,
                negociar y representar con criterio.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <article className="feature-card" key={benefit.title}>
                <span className="font-mono text-sm text-[#c8a45d]">
                  {benefit.metric}
                </span>
                <h3 className="mt-8 text-2xl font-semibold text-[#fff8e8]">
                  {benefit.title}
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

            <div className="grid gap-4 sm:grid-cols-2">
              {coordinations.map((coordination) => (
                <article className="coordination-card" key={coordination.name}>
                  <div className="h-10 w-10 rounded-full border border-[#c8a45d]/35 bg-[#c8a45d]/10" />
                  <h3 className="mt-6 text-2xl font-semibold">
                    {coordination.name}
                  </h3>
                  <p className="mt-4 leading-7 text-[#e8dfcf]/70">
                    {coordination.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a className="premium-button" href="#postulacion">
              Quiero postularme
            </a>
          </div>
        </div>
      </section>

      <section
        className="relative px-6 pb-24 pt-10 sm:px-10 lg:px-14 lg:pb-32"
        id="postulacion"
      >
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
          </div>

          <div>
            <div className="mb-8 lg:hidden">
              <p className="section-kicker">Postulación</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-normal">
                Tu siguiente rol empieza con una decisión.
              </h2>
            </div>
            <ApplicationForm coordinations={coordinationNames} />
          </div>
        </div>
      </section>
    </main>
  );
}
