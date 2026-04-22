"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminPanelLink from "@/components/AdminPanelLink";
import { addFavorite, getListings, getNearbyListings, removeFavorite, type Listing } from "@/lib/services";

type Feature = {
  title: string;
  text: string;
};

const features: Feature[] = [
  {
    title: "100% Verificado",
    text: "Todos los usuarios verificados con ID universitaria",
  },
  {
    title: "Comunidad Activa",
    text: "Miles de estudiantes buscando roommates",
  },
  {
    title: "Alojamiento Seguro",
    text: "Propiedades verificadas y confiables",
  },
  {
    title: "Facil y Rapido",
    text: "Encuentra tu match en minutos",
  },
];

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 5 5.5v6c0 4.5 2.9 8.7 7 10 4.1-1.3 7-5.5 7-10v-6l-7-3z" />
      <path d="M9.2 12.4 11 14l3.8-3.8" />
    </svg>
  );
}

function IconGroup() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M16.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M3.8 18.5c.7-2.4 2.7-3.8 4.7-3.8 2 0 4 1.4 4.7 3.8" />
      <path d="M13.7 17.7c.5-1.9 2-3 3.6-3 1.5 0 3 .9 3.7 2.8" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8z" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
      <path d="M5 16 6 18.5 8.5 19 6 19.8 5 22l-1-2.2L1.5 19 4 18.5 5 16z" />
      <path d="M19 14.5 19.9 16.6 22 17.5l-2.1.8L19 20.5l-.9-2.2-2.1-.8 2.1-.9.9-2.1z" />
    </svg>
  );
}

const featureIcons = [IconShield, IconGroup, IconHome, IconSpark];

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [listingError, setListingError] = useState("");
  const [nearbyError, setNearbyError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setLoadingListings(true);
        const response = await getListings();
        if (active) {
          setListings(response);
        }
      } catch (error) {
        if (active) {
          setListingError(error instanceof Error ? error.message : "No se pudieron cargar las publicaciones.");
        }
      } finally {
        if (active) {
          setLoadingListings(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const displayedListings = nearbyListings.length > 0 ? nearbyListings : listings;

  const priceLabel = (value: number) => `$ ${value.toLocaleString("es-MX")}/mes`;

  async function toggleFavorite(listingId: string) {
    const isFavorite = favoriteIds.includes(listingId);

    try {
      setFavoriteIds((current) => (isFavorite ? current.filter((item) => item !== listingId) : [...current, listingId]));

      if (isFavorite) {
        await removeFavorite(listingId);
      } else {
        await addFavorite(listingId);
      }
    } catch (error) {
      setFavoriteIds((current) => (isFavorite ? [...current, listingId] : current.filter((item) => item !== listingId)));
      setNearbyError(error instanceof Error ? error.message : "No se pudo actualizar el favorito.");
    }
  }

  async function loadNearbyListings(lat: number, lng: number) {
    setNearbyError("");
    setLoadingNearby(true);

    try {
      const response = await getNearbyListings(lat, lng);
      setNearbyListings(response);
    } catch (error) {
      setNearbyError(error instanceof Error ? error.message : "No se pudieron cargar las publicaciones cercanas.");
    } finally {
      setLoadingNearby(false);
    }
  }

  async function handleNearbyFromBrowserLocation() {
    setNearbyError("");

    if (!navigator.geolocation) {
      setNearbyError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadNearbyListings(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setNearbyError("No se pudo obtener tu ubicación. Usa las coordenadas manuales.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleNearbyManualSearch() {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setNearbyError("Ingresa coordenadas válidas para latitud y longitud.");
      return;
    }

    await loadNearbyListings(lat, lng);
  }

  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand">PartnerLooking</div>
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por ciudad, universidad o zona..."
          />
        </div>
        <Link className="publish-btn" href="/vistas/publicar-publicacion">
          + Publicar
        </Link>
        <AdminPanelLink />
        <button className="icon-btn" type="button" aria-label="Mensajes">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2v4l4-4h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
          </svg>
        </button>
        <Link className="icon-btn" href="/vistas/perfil-usuario" aria-label="Perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
          </svg>
        </Link>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h1>Encuentra tu hogar perfecto</h1>
          <p>
            La plataforma mas segura para estudiantes universitarios que buscan
            alojamiento o companeros de cuarto
          </p>

          <div className="feature-grid">
            {features.map((feature, index) => {
              const FeatureIcon = featureIcons[index];
              return (
                <article key={feature.title} className="feature-card">
                  <span className="feature-icon" aria-hidden="true">
                    <FeatureIcon />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="listing-area">
        <div className="toolbar">
          <div className="tabs" role="tablist" aria-label="Tipo de publicaciones">
            <button className="tab active" type="button" role="tab" aria-selected="true">
              Alojamiento
            </button>
            <Link className="tab" href="/vistas/roommates" role="tab" aria-selected="false">
              Roommates
            </Link>
          </div>
          <button className="filter-btn" type="button">
            Filtros
          </button>
        </div>

        <div className="section-header">
          <h2>Publicaciones recientes</h2>
          <p>Explora las mejores opciones de alojamiento y roommates</p>
        </div>

        <div className="nearby-controls">
          <button type="button" className="filter-btn" onClick={handleNearbyFromBrowserLocation} disabled={loadingNearby}>
            {loadingNearby ? "Buscando cerca de ti..." : "Usar mi ubicación"}
          </button>
          <div className="nearby-manual-inputs">
            <input type="number" step="any" placeholder="Latitud" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
            <input type="number" step="any" placeholder="Longitud" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
            <button type="button" className="filter-btn" onClick={handleNearbyManualSearch} disabled={loadingNearby}>
              Buscar cerca
            </button>
          </div>
        </div>

        {listingError && <p className="listing-feedback listing-feedback-error">{listingError}</p>}
        {nearbyError && <p className="listing-feedback listing-feedback-error">{nearbyError}</p>}

        <div className="listing-grid">
          {displayedListings.length === 0 && !loadingListings ? (
            <p className="listing-empty-state">No hay publicaciones disponibles por ahora.</p>
          ) : null}
          {displayedListings.map((item) => (
            <article className="listing-card" key={item.title}>
              <div className="image-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
                />
                <span className="pill">Disponible</span>
                <button className="save-btn" type="button" aria-label="Guardar" aria-pressed={favoriteIds.includes(item.id)} onClick={() => toggleFavorite(item.id)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20.5s-6.5-3.8-6.5-8.8c0-2.4 1.9-4.2 4.2-4.2 1.3 0 2.2.5 2.8 1.4.6-.9 1.5-1.4 2.8-1.4 2.3 0 4.2 1.8 4.2 4.2 0 5-6.5 8.8-6.5 8.8z" />
                  </svg>
                </button>
              </div>

              <div className="card-body">
                <h3>{item.title}</h3>
                <p className="location">{item.location}</p>
                <div className="meta-row">
                  <span className="price">{priceLabel(item.price)}</span>
                  <span className="people">{item.people}</span>
                </div>
                <Link className="card-link" href={`/vistas/publicacion-detalle?listingId=${encodeURIComponent(item.id)}&userId=${encodeURIComponent(item.hostId)}`}>
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="center-actions">
          <button className="load-more" type="button">
            Cargar mas resultados
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>PartnerLooking</h4>
            <p>La plataforma mas segura para estudiantes universitarios</p>
          </div>
          <div>
            <h4>Explorar</h4>
            <a href="#">Alojamientos</a>
            <a href="#">Roommates</a>
            <a href="#">Universidades</a>
          </div>
          <div>
            <h4>Soporte</h4>
            <a href="#">Centro de ayuda</a>
            <a href="#">Seguridad</a>
            <a href="#">Terminos</a>
          </div>
          <div>
            <h4>Comunidad</h4>
            <a href="#">Blog</a>
            <a href="#">Consejos</a>
            <a href="#">Contacto</a>
          </div>
        </div>

        <p className="copyright">
          © 2026 PartnerLooking. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
