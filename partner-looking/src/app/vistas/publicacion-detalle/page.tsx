"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { addFavorite, createReview, removeFavorite } from "@/lib/services";

type Amenity = {
  label: string;
  icon: string;
};

const gallery = [
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1400",
];

const amenities: Amenity[] = [
  { icon: "wifi", label: "WiFi de alta velocidad" },
  { icon: "tv", label: "TV por cable" },
  { icon: "wind", label: "Aire acondicionado" },
  { icon: "car", label: "Estacionamiento" },
  { icon: "bath", label: "Bano privado" },
  { icon: "food", label: "Cocina equipada" },
  { icon: "sofa", label: "Muebles incluidos" },
  { icon: "shield", label: "Zona segura 24/7" },
];

const rules = [
  "No se permiten mascotas",
  "No fumar dentro de la casa",
  "Visitas permitidas hasta las 10:00 PM",
  "Limpieza compartida de areas comunes",
];

function AmenityIcon({ kind }: { kind: string }) {
  if (kind === "wifi") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9c4.4-4 13.6-4 18 0" />
        <path d="M6 12.5c2.9-2.5 9.1-2.5 12 0" />
        <path d="M9.5 16c1.4-1 3.6-1 5 0" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    );
  }

  if (kind === "tv") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M10 3h4" />
      </svg>
    );
  }

  if (kind === "wind") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9h10a2 2 0 1 0-2-2" />
        <path d="M3 13h14a2 2 0 1 1-2 2" />
        <path d="M3 17h8" />
      </svg>
    );
  }

  if (kind === "car") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 15h12l-1.2-4H7.2L6 15z" />
        <circle cx="8" cy="16" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
      </svg>
    );
  }

  if (kind === "bath") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12h16" />
        <path d="M6 12v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2" />
        <path d="M8 10a2 2 0 1 1 4 0" />
      </svg>
    );
  }

  if (kind === "food") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4v8" />
        <path d="M9 4v8" />
        <path d="M6 8h3" />
        <path d="M16 4v16" />
        <path d="M13 7h3" />
      </svg>
    );
  }

  if (kind === "sofa") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="10" width="16" height="6" rx="2" />
        <path d="M6 10V8a2 2 0 0 1 2-2h2" />
        <path d="M18 10V8a2 2 0 0 0-2-2h-2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 5 5.5v6c0 4.5 2.9 8.7 7 10 4.1-1.3 7-5.5 7-10v-6l-7-3z" />
    </svg>
  );
}

export default function PublicacionDetallePage() {
  const [listingId, setListingId] = useState("listing-demo");
  const [hostId, setHostId] = useState("host-demo");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setListingId(params.get("listingId") || "listing-demo");
    setHostId(params.get("userId") || params.get("hostId") || "host-demo");
  }, []);

  async function toggleFavorite() {
    setReviewError("");

    try {
      if (isFavorite) {
        await removeFavorite(listingId);
      } else {
        await addFavorite(listingId);
      }
      setIsFavorite((current) => !current);
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "No se pudo actualizar el favorito.");
    }
  }

  async function handleSubmitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    try {
      await createReview(hostId, Number(rating), comment.trim() || undefined);
      setReviewSuccess("Reseña enviada correctamente.");
      setComment("");
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "No se pudo enviar la reseña.");
    }
  }

  return (
    <div className="detail-page">
      <header className="detail-topbar">
        <div className="detail-topbar-inner">
          <Link href="/vistas/alojamiento" className="back-link">
            ← Volver
          </Link>
          <div className="detail-actions">
            <button type="button" aria-label="Compartir" className="plain-icon-btn">
              ⤴
            </button>
            <button type="button" aria-label="Favorito" className="plain-icon-btn" onClick={toggleFavorite}>
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </header>

      <main className="detail-layout">
        <section className="detail-main-column">
          <section className="gallery-card">
            <div className="gallery-main">
              <Image
                src={gallery[0]}
                alt="Foto principal de la publicacion"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 58vw"
              />
            </div>
            <div className="gallery-side">
              <div className="gallery-thumb">
                <Image
                  src={gallery[1]}
                  alt="Foto secundaria 1"
                  fill
                  sizes="(max-width: 980px) 50vw, 21vw"
                />
              </div>
              <div className="gallery-thumb">
                <Image
                  src={gallery[2]}
                  alt="Foto secundaria 2"
                  fill
                  sizes="(max-width: 980px) 50vw, 21vw"
                />
              </div>
              <div className="gallery-thumb gallery-wide">
                <Image
                  src={gallery[3]}
                  alt="Foto secundaria 3"
                  fill
                  sizes="(max-width: 980px) 100vw, 43vw"
                />
              </div>
            </div>
          </section>

          <section className="detail-card listing-summary">
            <div className="summary-head">
              <h1>Habitacion amplia cerca de UNAM</h1>
              <span className="status-pill">Disponible</span>
            </div>
            <p className="summary-address">Av. Universidad 3000, Ciudad Universitaria, CDMX</p>

            <div className="summary-meta-grid">
              <div>
                <span className="meta-label">Renta mensual</span>
                <strong>$3,500</strong>
              </div>
              <div>
                <span className="meta-label">Roommates</span>
                <strong>2 personas</strong>
              </div>
              <div>
                <span className="meta-label">Tipo</span>
                <strong>Habitacion privada</strong>
              </div>
              <div>
                <span className="meta-label">Disponible desde</span>
                <strong>1 Mayo 2026</strong>
              </div>
            </div>
          </section>

          <section className="detail-card text-card">
            <h2>Descripcion</h2>
            <p>
              Hermosa habitacion amplia con excelente iluminacion natural, ubicada a solo 5 minutos
              caminando de Ciudad Universitaria. Ideal para estudiantes de la UNAM que buscan un
              espacio comodo, seguro y bien comunicado.
            </p>
            <p>
              La casa cuenta con dos roommates mas, ambos estudiantes universitarios de 21-23 anos,
              ambiente tranquilo y respetuoso. Buscamos personas ordenadas, responsables y que valoren
              la convivencia sana.
            </p>
          </section>

          <section className="detail-card amenity-card">
            <h2>Amenidades incluidas</h2>
            <div className="amenity-grid">
              {amenities.map((item) => (
                <div key={item.label} className="amenity-item">
                  <span className="amenity-icon" aria-hidden="true">
                    <AmenityIcon kind={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-card rules-card">
            <h2>Reglas de la casa</h2>
            <ul>
              {rules.map((rule) => (
                <li key={rule}>✓ {rule}</li>
              ))}
            </ul>
          </section>

          <section className="detail-card map-card">
            <h2>Ubicacion</h2>
            <div className="map-box">
              <span>Mapa interactivo</span>
              <small>Ciudad Universitaria, CDMX</small>
            </div>
            <p>
              <strong>Transporte cercano:</strong> Metro Copilco (10 min), Metrobus CU (5 min)
            </p>
            <p>
              <strong>Servicios cercanos:</strong> OXXO, Farmacias Guadalajara, Restaurantes, Gimnasio
            </p>
          </section>
        </section>

        <aside className="detail-sidebar">
          <section className="host-card">
            <div className="host-head">
              <div className="host-avatar">MA</div>
              <div>
                <h3>Maria Alvarez</h3>
                <p>UNAM - Derecho</p>
              </div>
            </div>

            <div className="verified-box">
              <strong>Perfil verificado</strong>
              <span>Identidad y credencial universitaria confirmadas</span>
            </div>

            <div className="host-stats">
              <div>
                <strong>4.9</strong>
                <span>Calificacion</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Resenas</span>
              </div>
            </div>

            <button type="button" className="primary-cta">
              Enviar mensaje
            </button>
            <button type="button" className="secondary-cta">
              Ver perfil completo
            </button>

            <form className="review-form" onSubmit={handleSubmitReview}>
              <h4>Deja una reseña</h4>
              <label>
                <span>Calificación</span>
                <select value={rating} onChange={(event) => setRating(event.target.value)}>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </label>
              <label>
                <span>Comentario opcional</span>
                <textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comparte tu experiencia con este anfitrión" />
              </label>
              <button type="submit" className="primary-cta">
                Enviar reseña
              </button>
              {reviewError && <p className="auth-feedback auth-feedback-error">{reviewError}</p>}
              {reviewSuccess && <p className="auth-feedback auth-feedback-success">{reviewSuccess}</p>}
            </form>

            <p className="security-note">
              <strong>Consejo de seguridad:</strong> Nunca transfieras dinero antes de ver la propiedad
              en persona.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}
