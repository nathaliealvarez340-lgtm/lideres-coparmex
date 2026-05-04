"use client";

import { useMemo, useState } from "react";
import type {
  CandidateApplication,
  CandidateStatus,
} from "../lib/application-store";

type AdminDashboardProps = {
  initialApplications: CandidateApplication[];
};

const statusLabels: Record<CandidateStatus, string> = {
  pending: "Pendiente",
  rejected: "Rechazado",
  reviewed: "Revisado",
  shortlisted: "Shortlisted",
};

export function AdminDashboard({ initialApplications }: AdminDashboardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState(initialApplications[0]?.id ?? "");
  const [coordinationFilter, setCoordinationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [highScoreOnly, setHighScoreOnly] = useState(false);

  const activeApplication =
    applications.find((application) => application.id === activeId) ??
    applications[0] ??
    null;
  const coordinations = Array.from(
    new Set(applications.map((application) => application.coordination)),
  );
  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesCoordination =
        coordinationFilter === "all" ||
        application.coordination === coordinationFilter;
      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;
      const matchesScore = !highScoreOnly || application.scoreTotal >= 70;
      const matchesSearch =
        !query ||
        application.fullName.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        application.career.toLowerCase().includes(query);

      return matchesCoordination && matchesStatus && matchesScore && matchesSearch;
    });
  }, [applications, coordinationFilter, highScoreOnly, search, statusFilter]);
  const pendingCount = applications.filter(
    (application) => application.status === "pending",
  ).length;
  const averageScore =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (total, application) => total + application.scoreTotal,
            0,
          ) / applications.length,
        )
      : 0;
  const topProfiles = [...applications]
    .sort((a, b) => b.scoreTotal - a.scoreTotal)
    .slice(0, 4);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function updateApplication(
    id: string,
    updates: Partial<Pick<CandidateApplication, "adminNotes" | "status">>,
  ) {
    const response = await fetch(`/api/admin/applications/${id}`, {
      body: JSON.stringify(updates),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const payload = (await response.json()) as {
      application?: CandidateApplication;
      message?: string;
    };

    if (!response.ok || !payload.application) {
      throw new Error(payload.message ?? "No se pudo actualizar.");
    }

    setApplications((current) =>
      current.map((application) =>
        application.id === id ? payload.application! : application,
      ),
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-dashboard">
        <header className="admin-header">
          <div>
            <p className="section-kicker">SUPER ADMIN</p>
            <h1>Panel de postulaciones</h1>
            <p>
              Revisa perfiles, evidencia de construcción, CVs y ranking inicial
              de candidatos.
            </p>
          </div>
          <button className="admin-ghost-button" onClick={handleLogout} type="button">
            Cerrar sesión
          </button>
        </header>

        <section className="admin-stats-grid">
          <StatCard label="Postulantes" value={applications.length} />
          <StatCard label="Pendientes" value={pendingCount} />
          <StatCard label="Score promedio" value={averageScore} />
          <StatCard label="Coordinaciones" value={coordinations.length} />
        </section>

        <section className="admin-top-grid">
          {topProfiles.map((application) => (
            <button
              className="admin-top-card"
              key={application.id}
              onClick={() => setActiveId(application.id)}
              type="button"
            >
              <span>{application.classification}</span>
              <strong>{application.fullName}</strong>
              <em>{application.scoreTotal}/100</em>
            </button>
          ))}
        </section>

        <section className="admin-content-grid">
          <div className="admin-table-panel">
            <div className="admin-filters">
              <input
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Buscar por nombre, correo o carrera"
                type="search"
                value={search}
              />
              <select
                onChange={(event) => setCoordinationFilter(event.currentTarget.value)}
                value={coordinationFilter}
              >
                <option value="all">Todas las coordinaciones</option>
                {coordinations.map((coordination) => (
                  <option key={coordination} value={coordination}>
                    {coordination}
                  </option>
                ))}
              </select>
              <select
                onChange={(event) => setStatusFilter(event.currentTarget.value)}
                value={statusFilter}
              >
                <option value="all">Todos los estados</option>
                {Object.entries(statusLabels).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>
              <label className="admin-checkbox">
                <input
                  checked={highScoreOnly}
                  onChange={(event) => setHighScoreOnly(event.currentTarget.checked)}
                  type="checkbox"
                />
                Score alto
              </label>
            </div>

            <div className="admin-table">
              {filteredApplications.map((application) => (
                <button
                  className={application.id === activeApplication?.id ? "is-active" : ""}
                  key={application.id}
                  onClick={() => setActiveId(application.id)}
                  type="button"
                >
                  <span>{application.fullName}</span>
                  <span>{application.career}</span>
                  <span>{application.coordination}</span>
                  <strong>{application.scoreTotal}</strong>
                  <Badge status={application.status} />
                  <time>{new Date(application.createdAt).toLocaleDateString("es-MX")}</time>
                  <em>Ver perfil</em>
                </button>
              ))}
              {filteredApplications.length === 0 ? (
                <p className="admin-empty">No hay postulantes con esos filtros.</p>
              ) : null}
            </div>
          </div>

          {activeApplication ? (
            <CandidateProfile
              application={activeApplication}
              key={activeApplication.id}
              onUpdate={updateApplication}
            />
          ) : (
            <div className="admin-profile-panel">
              <p>No hay postulaciones todavía.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Badge({ status }: { status: CandidateStatus }) {
  return <span className={`admin-status-badge ${status}`}>{statusLabels[status]}</span>;
}

function CandidateProfile({
  application,
  onUpdate,
}: {
  application: CandidateApplication;
  onUpdate: (
    id: string,
    updates: Partial<Pick<CandidateApplication, "adminNotes" | "status">>,
  ) => Promise<void>;
}) {
  const [notes, setNotes] = useState(application.adminNotes);
  const [isSaving, setIsSaving] = useState(false);

  async function save(updates: Partial<Pick<CandidateApplication, "adminNotes" | "status">>) {
    setIsSaving(true);

    try {
      await onUpdate(application.id, updates);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <aside className="admin-profile-panel">
      <div className="admin-profile-heading">
        <div>
          <Badge status={application.status} />
          <h2>{application.fullName}</h2>
          <p>
            {application.career} · {application.coordination}
          </p>
        </div>
        <div className="admin-score-ring">
          <strong>{application.scoreTotal}</strong>
          <span>/100</span>
        </div>
      </div>

      <div className="admin-contact-grid">
        <a href={`mailto:${application.email}`}>{application.email}</a>
        <a href={`tel:${application.phone}`}>{application.phone}</a>
        {application.projectLink ? (
          <a href={application.projectLink} rel="noreferrer" target="_blank">
            Proyecto
          </a>
        ) : (
          <span>Sin link de proyecto</span>
        )}
        <a href={application.cvFileUrl} rel="noreferrer" target="_blank">
          {application.cvFileName}
        </a>
      </div>

      <ScoreBreakdown application={application} />

      <section className="admin-answer-block">
        <h3>Qué está construyendo</h3>
        <p>{application.currentProjectAnswer}</p>
      </section>
      <section className="admin-answer-block">
        <h3>Avances o resultados</h3>
        <p>{application.progressAnswer}</p>
      </section>

      <label className="admin-notes">
        Notas internas
        <textarea
          onChange={(event) => setNotes(event.currentTarget.value)}
          value={notes}
        />
      </label>

      <div className="admin-actions">
        <button disabled={isSaving} onClick={() => save({ adminNotes: notes, status: "reviewed" })} type="button">
          Revisado
        </button>
        <button disabled={isSaving} onClick={() => save({ adminNotes: notes, status: "shortlisted" })} type="button">
          Shortlist
        </button>
        <button disabled={isSaving} onClick={() => save({ adminNotes: notes, status: "rejected" })} type="button">
          Rechazar
        </button>
        <button disabled={isSaving} onClick={() => save({ adminNotes: notes })} type="button">
          Guardar notas
        </button>
      </div>
    </aside>
  );
}

function ScoreBreakdown({ application }: { application: CandidateApplication }) {
  const scores = [
    ["Claridad", application.scoreClarity, 20],
    ["Iniciativa", application.scoreInitiative, 20],
    ["Evidencia", application.scoreEvidence, 20],
    ["Comunicación", application.scoreCommunication, 15],
    ["Fit", application.scoreFit, 15],
    ["Compromiso", application.scoreCommitment, 10],
  ];

  return (
    <div className="admin-score-list">
      {scores.map(([label, score, max]) => (
        <div key={label}>
          <span>
            {label} <em>{score}/{max}</em>
          </span>
          <div>
            <i style={{ width: `${(Number(score) / Number(max)) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
