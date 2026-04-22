"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getStoredToken, getStoredUserId, saveSession } from "@/lib/session";
import { deleteUserAccount, getUserById, getUserContact, updateUserPassword, updateUserProfile, type UserProfile } from "@/lib/services";

type ProfileTab = "informacion" | "publicaciones" | "favoritos";

const tabs: Array<{ id: ProfileTab; label: string; icon: string }> = [
  { id: "informacion", label: "Información", icon: "user" },
  { id: "publicaciones", label: "Mis publicaciones", icon: "home" },
  { id: "favoritos", label: "Favoritos", icon: "heart" },
];

const verificationItems = [
  { label: "Email", status: "Verificado" },
  { label: "Teléfono", status: "Verificado" },
  { label: "Identidad", status: "Verificado" },
  { label: "Credencial universitaria", status: "Verificar" },
];

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h1.5l1-2h4l1 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function TabIcon({ kind }: { kind: string }) {
  if (kind === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8z" />
      </svg>
    );
  }
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-6.5-3.8-6.5-8.8c0-2.4 1.9-4.2 4.2-4.2 1.3 0 2.2.5 2.8 1.4.6-.9 1.5-1.4 2.8-1.4 2.3 0 4.2 1.8 4.2 4.2 0 5-6.5 8.8-6.5 8.8z" />
      </svg>
    );
  }
  if (kind === "gear") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
        <path d="M4 12l2-.7.7-1.7-.9-2 2-2 2 .9 1.7-.7L12 4l.7 2 .7 1.7 2-.9 2 2-.9 2 .7 1.7 2 .7-2 2-.7 1.7.9 2-2 2-2-.9-1.7.7L12 20l-.7-2-.7-1.7-2 .9-2-2 .9-2-.7-1.7L4 12z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
    </svg>
  );
}

export default function PerfilUsuarioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("informacion");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contact, setContact] = useState<{ email: string; phone: string }>({ email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function decodeUserIdFromToken(token: string): string {
    try {
      const parts = token.split(".");
      if (parts.length < 2) {
        return "";
      }

      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
        sub?: unknown;
        userId?: unknown;
        id?: unknown;
      };

      if (typeof payload.userId === "string" && payload.userId.trim().length > 0) {
        return payload.userId;
      }
      if (typeof payload.id === "string" && payload.id.trim().length > 0) {
        return payload.id;
      }
      if (typeof payload.sub === "string" && payload.sub.trim().length > 0) {
        return payload.sub;
      }
      return "";
    } catch {
      return "";
    }
  }

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/vistas/login");
      return;
    }

    const token = getStoredToken();
    const userId = getStoredUserId() || decodeUserIdFromToken(token);

    if (userId && !getStoredUserId()) {
      saveSession({ userId });
    }

    if (!userId) {
      setError("No se pudo identificar al usuario actual. Vuelve a iniciar sesión.");
      setLoading(false);
      return;
    }

    let active = true;

    void (async () => {
      try {
        setLoading(true);
        const [user, userContact] = await Promise.all([getUserById(userId), getUserContact(userId)]);
        if (active) {
          setProfile(user);
          setContact(userContact);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el perfil.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSaveProfile() {
    setFeedback("");
    setError("");

    if (!profile) {
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await updateUserProfile(profile);
      setProfile(updated);
      setFeedback("Perfil actualizado correctamente.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleUpdatePassword() {
    setFeedback("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Completa la contraseña actual y la nueva contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      setSavingPassword(true);
      await updateUserPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback("Contraseña actualizada correctamente.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar la contraseña.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    const accepted = window.confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");

    if (!accepted) {
      return;
    }

    try {
      setDeletingAccount(true);
      await deleteUserAccount();
      clearSession();
      router.push("/vistas/registro");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar la cuenta.");
    } finally {
      setDeletingAccount(false);
    }
  }

  const summaryName = profile?.fullName || (loading ? "Cargando..." : "Sin nombre");
  const summaryUsername = profile?.username ? `@${profile.username}` : "Sin usuario";
  const summaryEmail = profile?.email || contact.email || (loading ? "Cargando..." : "Sin correo");
  const summaryPhone = profile?.phone || contact.phone || (loading ? "Cargando..." : "Sin teléfono");

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <Link href="/vistas/roommates" className="back-link">
          <BackIcon />
          Volver
        </Link>
        <h1>Mi Perfil</h1>
        <span />
      </header>

      <main className="profile-layout">
        <aside className="profile-sidebar">
          <section className="profile-summary-card">
            <div className="profile-cover">
              <button type="button" className="floating-camera top-camera" aria-label="Cambiar portada">
                <CameraIcon />
              </button>
              <div className="profile-avatar-wrap">
                <Image
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Juan Pérez"
                  fill
                  sizes="160px"
                />
                <button type="button" className="floating-camera avatar-camera" aria-label="Cambiar foto">
                  <CameraIcon />
                </button>
              </div>
            </div>

            <div className="profile-summary-body">
              <div className="profile-name-row">
                <h2>{summaryName}</h2>
                <span className="verified-badge">✓</span>
              </div>
              <p className="profile-username">{summaryUsername}</p>
              <p className="profile-member-since">{summaryEmail}</p>

              <div className="profile-stats-grid">
                <div>
                  <strong>4.8</strong>
                  <span>Calificación</span>
                </div>
                <div>
                  <strong>15</strong>
                  <span>Reseñas</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>Publicaciones</span>
                </div>
              </div>

              <div className="verification-card">
                <h3>Estado de verificación</h3>
                <div className="verification-list">
                  {verificationItems.map((item) => (
                    <div key={item.label} className="verification-row">
                      <span>{item.label}</span>
                      <strong className={item.status === "Verificar" ? "verify-link" : "verify-ok"}>
                        {item.status}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="verification-card">
                <h3>Contacto actual</h3>
                <div className="verification-list">
                  <div className="verification-row">
                    <span>Email</span>
                    <strong>{summaryEmail}</strong>
                  </div>
                  <div className="verification-row">
                    <span>Teléfono</span>
                    <strong>{summaryPhone}</strong>
                  </div>
                </div>
              </div>

              <button type="button" className="edit-profile-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 20h16" />
                  <path d="M14.5 5.5 18.5 9.5 9 19H5v-4z" />
                </svg>
                Editar perfil
              </button>
            </div>
          </section>
        </aside>

        <section className="profile-content">
          <div className="profile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon kind={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "informacion" && (
            <>
              <section className="profile-panel">
                <h3>Información personal</h3>
                <div className="profile-form-grid">
                  <label className="profile-field profile-field-full">
                    <span>Nombre completo</span>
                    <input type="text" placeholder="Juan Pérez González" value={profile?.fullName || ""} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), fullName: event.target.value }))} />
                  </label>
                  <label className="profile-field profile-field-full verified-field">
                    <span>Email</span>
                    <input type="email" placeholder="juan.perez@ejemplo.com" value={profile?.email || ""} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), email: event.target.value }))} />
                    <span className="field-check">✓</span>
                  </label>
                  <label className="profile-field verified-field">
                    <span>Teléfono</span>
                    <input type="tel" placeholder="+52 55 1234 5678" value={profile?.phone || ""} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), phone: event.target.value }))} />
                    <span className="field-check">✓</span>
                  </label>
                  <label className="profile-field">
                    <span>Edad</span>
                    <input type="number" placeholder="24" value={profile?.age || 0} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), age: Number(event.target.value) }))} />
                  </label>
                  <label className="profile-field profile-field-full">
                    <span>Género</span>
                    <select value={profile?.gender || "Hombre"} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), gender: event.target.value }))}>
                      <option>Hombre</option>
                      <option>Mujer</option>
                      <option>No binario</option>
                      <option>Prefiero no decirlo</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="profile-panel">
                <h3>Información académica</h3>
                <div className="profile-form-grid">
                  <label className="profile-field profile-field-full">
                    <span>Universidad</span>
                    <input type="text" placeholder="Universidad Nacional Autónoma de México" value={profile?.university || ""} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), university: event.target.value }))} />
                  </label>
                  <label className="profile-field profile-field-full">
                    <span>Carrera</span>
                    <input type="text" placeholder="Ingeniería en Computación" value={profile?.career || ""} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), career: event.target.value }))} />
                  </label>
                  <label className="profile-field profile-field-full">
                    <span>Semestre</span>
                    <select value={profile?.semester || "6to semestre"} onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), semester: event.target.value }))}>
                      <option>1er semestre</option>
                      <option>2do semestre</option>
                      <option>3er semestre</option>
                      <option>4to semestre</option>
                      <option>5to semestre</option>
                      <option>6to semestre</option>
                      <option>7mo semestre</option>
                      <option>8vo semestre</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="profile-panel">
                <h3>Sobre mí</h3>
                <textarea
                  className="profile-about"
                  rows={5}
                  placeholder="Estudiante de ingeniería en la UNAM, me gusta la tecnología, el deporte y conocer gente nueva. Busco un ambiente tranquilo y respetuoso para vivir."
                  value={profile?.about || ""}
                  onChange={(event) => setProfile((current) => ({ ...(current || { id: "", fullName: "", username: "", email: "", phone: "", age: 0, gender: "", university: "", career: "", semester: "", about: "" }), about: event.target.value }))}
                />
              </section>

              <section className="profile-panel">
                <h3>Seguridad</h3>
                <div className="profile-form-grid">
                  <label className="profile-field profile-field-full">
                    <span>Contraseña actual</span>
                    <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                  </label>
                  <label className="profile-field">
                    <span>Nueva contraseña</span>
                    <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                  </label>
                  <label className="profile-field">
                    <span>Confirmar nueva contraseña</span>
                    <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                  </label>
                  <div className="profile-panel-actions">
                    <button type="button" className="edit-profile-btn" onClick={() => void handleUpdatePassword()} disabled={savingPassword || savingProfile}>
                      {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
                    </button>
                    <button type="button" className="edit-profile-btn" onClick={handleDeleteAccount} disabled={deletingAccount}>
                      {deletingAccount ? "Eliminando..." : "Eliminar cuenta"}
                    </button>
                  </div>
                </div>
              </section>

              {error && <p className="auth-feedback auth-feedback-error">{error}</p>}
              {feedback && <p className="auth-feedback auth-feedback-success">{feedback}</p>}

              <div className="profile-panel-actions">
                <button type="button" className="edit-profile-btn" onClick={() => void handleSaveProfile()} disabled={savingProfile}>
                  {savingProfile ? "Guardando..." : "Guardar perfil"}
                </button>
              </div>
            </>
          )}

          {activeTab === "publicaciones" && (
            <section className="profile-panel">
              <h3>Mis publicaciones</h3>
              <p className="listing-empty-state">Aún no hay publicaciones conectadas para este usuario.</p>
            </section>
          )}

          {activeTab === "favoritos" && (
            <section className="profile-panel">
              <h3>Mis favoritos</h3>
              <p className="listing-empty-state">Aún no hay favoritos conectados para este usuario.</p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
