import Link from "next/link";

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

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 3.8 10 6.2 8.7 8.5c-.2.4-.2.8 0 1.2a14.5 14.5 0 0 0 5.6 5.6c.4.2.8.2 1.2 0l2.3-1.3 2.4 2.5-1.3 2.6c-.4.8-1.4 1.2-2.3 1-7.1-1.5-12.5-6.9-14-14-.2-.9.2-1.9 1-2.3z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
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

export default function RegistroPage() {
  return (
    <main className="auth-page auth-register-page">
      <section className="auth-split auth-split-left">
        <div className="auth-brand-block">
          <h1>PartnerLooking</h1>
          <p>Únete a la comunidad de estudiantes más grande</p>
        </div>

        <section className="register-reasons-card">
          <h3>¿Por qué registrarte?</h3>
          <ul>
            <li>Acceso a miles de publicaciones verificadas</li>
            <li>Sistema de mensajería seguro</li>
            <li>Encuentra roommates compatibles</li>
            <li>Publica gratis tus anuncios</li>
            <li>Perfil verificado con credencial universitaria</li>
          </ul>
        </section>

        <section className="register-safety-card">
          <ShieldIcon />
          <p>
            <strong>100% Seguro:</strong> Tus datos están protegidos con encriptación de nivel bancario.
          </p>
        </section>

        <p className="auth-copyright">© 2026 PartnerLooking. Todos los derechos reservados.</p>
      </section>

      <section className="auth-split auth-split-right">
        <div className="auth-card-shell">
          <div className="register-progress">
            <div className="register-progress-row">
              <span>Paso 1 de 2</span>
              <strong>50%</strong>
            </div>
            <div className="register-progress-track">
              <span style={{ width: "50%" }} />
            </div>
          </div>

          <section className="auth-card">
            <h2>Información personal</h2>
            <p>Completa tus datos básicos para continuar</p>

            <label className="auth-field">
              <span>Nombre completo *</span>
              <div className="auth-input-wrap">
                <UserIcon />
                <input type="text" placeholder="Juan Pérez González" />
              </div>
            </label>

            <label className="auth-field">
              <span>Correo electrónico *</span>
              <div className="auth-input-wrap">
                <MailIcon />
                <input type="email" placeholder="tu@ejemplo.com" />
              </div>
              <small>Preferiblemente tu correo universitario</small>
            </label>

            <label className="auth-field">
              <span>Teléfono *</span>
              <div className="auth-input-wrap">
                <PhoneIcon />
                <input type="tel" placeholder="+52 55 1234 5678" />
              </div>
            </label>

            <label className="auth-field">
              <span>Contraseña *</span>
              <div className="auth-input-wrap auth-input-trailing">
                <LockIcon />
                <input type="password" placeholder="••••••••" />
                <button type="button" aria-label="Mostrar contraseña" className="auth-trailing-btn">
                  <EyeIcon />
                </button>
              </div>
            </label>

            <label className="auth-field">
              <span>Confirmar contraseña *</span>
              <div className="auth-input-wrap auth-input-trailing">
                <LockIcon />
                <input type="password" placeholder="••••••••" />
                <button type="button" aria-label="Mostrar contraseña" className="auth-trailing-btn">
                  <EyeIcon />
                </button>
              </div>
            </label>

            <button type="button" className="auth-primary-btn">
              Continuar
              <ArrowIcon />
            </button>

            <p className="auth-register-line">
              ¿Ya tienes una cuenta? <Link href="/vistas/login">Inicia sesión</Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
