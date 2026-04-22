"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/services";
import { getStoredRole, getStoredToken, saveSession } from "@/lib/session";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h14" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 5.5 5.6v5.7c0 4.3 2.7 8.2 6.5 9.9 3.8-1.7 6.5-5.6 6.5-9.9V5.6z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="2.3" />
      <circle cx="16" cy="9" r="2.3" />
      <path d="M3.5 18c0-2.7 2-4.3 4.5-4.3S12.5 15.3 12.5 18" />
      <path d="M11.5 18c0-2.5 1.9-4.1 4.2-4.1 2.4 0 4.3 1.6 4.3 4.1" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    const role = getStoredRole();
    router.replace(["admin", "ADMIN", "administrator", "Administrador"].includes(role) ? "/vistas/documentos-verificacion" : "/vistas/alojamiento");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        email,
        password,
        rememberMe,
      });

      if (response.token) {
        saveSession(response);
        router.push(["admin", "ADMIN", "administrator", "Administrador"].includes(response.role) ? "/vistas/documentos-verificacion" : "/vistas/alojamiento");
        return;
      }

      setSuccess("Inicio de sesión exitoso. Ya estás conectado con el backend.");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo iniciar sesión.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-split auth-split-left">
        <div className="auth-brand-block">
          <h1>PartnerLooking</h1>
          <p>La plataforma más segura para estudiantes universitarios</p>
        </div>

        <div className="auth-benefits">
          <article className="auth-benefit-item">
            <span className="auth-benefit-icon" aria-hidden="true">
              <ShieldIcon />
            </span>
            <div>
              <strong>100% Verificado</strong>
              <p>Todos los usuarios verificados con ID universitaria para tu seguridad</p>
            </div>
          </article>

          <article className="auth-benefit-item">
            <span className="auth-benefit-icon" aria-hidden="true">
              <UsersIcon />
            </span>
            <div>
              <strong>Comunidad Activa</strong>
              <p>Miles de estudiantes buscando alojamiento y roommates</p>
            </div>
          </article>

          <article className="auth-benefit-item">
            <span className="auth-benefit-icon" aria-hidden="true">
              <HomeIcon />
            </span>
            <div>
              <strong>Confianza Total</strong>
              <p>Propiedades verificadas y sistema de reseñas confiable</p>
            </div>
          </article>
        </div>

        <p className="auth-copyright">© 2026 PartnerLooking. Todos los derechos reservados.</p>
      </section>

      <section className="auth-split auth-split-right">
        <div className="auth-card-shell">
          <section className="auth-card">
            <h2>Iniciar sesión</h2>
            <p>Ingresa a tu cuenta para continuar</p>

            <form onSubmit={handleSubmit}>
              <label className="auth-field">
                <span>Correo electrónico</span>
                <div className="auth-input-wrap">
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Contraseña</span>
                <div className="auth-input-wrap auth-input-trailing">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button type="button" aria-label="Mostrar contraseña" className="auth-trailing-btn">
                    <EyeIcon />
                  </button>
                </div>
              </label>

              <div className="auth-meta-row">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Recordarme</span>
                </label>
                <Link href="#">¿Olvidaste tu contraseña?</Link>
              </div>

              {error && <p className="auth-feedback auth-feedback-error">{error}</p>}
              {success && <p className="auth-feedback auth-feedback-success">{success}</p>}

              <button type="submit" className="auth-primary-btn" disabled={loading}>
                {loading ? "Conectando..." : "Iniciar sesión"}
                <ArrowIcon />
              </button>
            </form>

            <p className="auth-register-line">
              ¿No tienes una cuenta? <Link href="/vistas/registro">Regístrate gratis</Link>
            </p>
          </section>

          <section className="auth-security-note">
            <ShieldIcon />
            <div>
              <strong>Tu seguridad es nuestra prioridad</strong>
              <p>Nunca compartas tu contraseña con nadie. PartnerLooking jamás te pedirá tu contraseña por email o teléfono.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
