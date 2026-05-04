"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({
          password: formData.get("password"),
          username: formData.get("username"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "No fue posible iniciar sesión.");
      }

      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No fue posible iniciar sesión.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-shell">
      <section className="admin-login-card">
        <p className="section-kicker">SUPER ADMIN</p>
        <h1>Mesa de Líderes COPARMEX</h1>
        <p>
          Acceso privado para revisar postulaciones, CVs y perfiles con mayor
          intención de construcción.
        </p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              autoComplete="username"
              name="username"
              placeholder="Usuario"
              required
              type="text"
            />
          </label>
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
            />
          </label>
          <button disabled={isLoading} type="submit">
            {isLoading ? "Entrando..." : "Entrar al panel"}
          </button>
        </form>
        {message ? <p className="admin-error">{message}</p> : null}
      </section>
    </main>
  );
}
