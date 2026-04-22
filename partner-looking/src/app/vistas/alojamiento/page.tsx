"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminPanelLink from "@/components/AdminPanelLink";
import { addFavorite, getListings, getNearbyListings, removeFavorite, type Listing } from "@/lib/services";

export default function AlojamientoPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [listingError, setListingError] = useState("");
  const [nearbyError, setNearbyError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setLoadingListings(true);
        setListingError("");
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

  const sourceListings = nearbyListings.length > 0 ? nearbyListings : listings;

  const displayedListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return sourceListings;
    }

    return sourceListings.filter((listing) => {
      const haystack = [listing.title, listing.location, listing.city, listing.neighborhood].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [search, sourceListings]);

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

  async function loadNearby(lat: number, lng: number) {
    setNearbyError("");
    setLoadingNearby(true);

    try {
      const response = await getNearbyListings(lat, lng);
      setNearbyListings(response);
    } catch (error) {
      setNearbyError(error instanceof Error ? error.message : "No se pudieron cargar publicaciones cercanas.");
    } finally {
      setLoadingNearby(false);
    }
  }

  function handleNearbyFromBrowserLocation() {
    setNearbyError("");

    if (!navigator.geolocation) {
      setNearbyError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadNearby(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setNearbyError("No se pudo obtener tu ubicación. Usa coordenadas manuales.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleNearbyManualSearch() {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setNearbyError("Ingresa coordenadas válidas para latitud y longitud.");
      return;
    }

    void loadNearby(lat, lng);
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Link className="publish-btn" href="/vistas/publicar-publicacion">
          + Publicar
        </Link>
        <AdminPanelLink />
        <Link className="icon-btn" href="/vistas/perfil-usuario" aria-label="Perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
          </svg>
        </Link>
      </header>

      <section className="listing-area">
        <div className="toolbar">
          <div className="tabs">
            <button className="tab active" type="button" role="tab" aria-selected="true">
              Alojamiento
            </button>
            <Link className="tab" href="/vistas/roommates" role="tab" aria-selected="false">
              Roommates
            </Link>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="filter-btn" type="button" onClick={handleNearbyFromBrowserLocation}>
              Cerca de mí
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 12 }}>
          <input
            className="tab"
            style={{ textAlign: "left", justifyContent: "flex-start" }}
            type="text"
            placeholder="Latitud"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
          />
          <input
            className="tab"
            style={{ textAlign: "left", justifyContent: "flex-start" }}
            type="text"
            placeholder="Longitud"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
          />
          <button className="filter-btn" type="button" onClick={handleNearbyManualSearch}>
            Buscar
          </button>
        </div>

        <section className="section-header">
          <h2>Encuentra tu alojamiento ideal</h2>
          <p>{nearbyListings.length > 0 ? "Mostrando resultados cercanos" : "Explora publicaciones disponibles"}</p>
        </section>

        {listingError && <p className="auth-feedback auth-feedback-error">{listingError}</p>}
        {nearbyError && <p className="auth-feedback auth-feedback-error">{nearbyError}</p>}

        {(loadingListings || loadingNearby) && <p className="auth-feedback">Cargando publicaciones...</p>}

        {!loadingListings && displayedListings.length === 0 && (
          <p className="auth-feedback">No se encontraron publicaciones para tu búsqueda.</p>
        )}

        <section className="listing-grid">
          {displayedListings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <div className="image-wrap">
                <Image src={listing.image} alt={listing.title} fill sizes="(max-width: 980px) 100vw, 33vw" />
                <span className="pill">Disponible</span>
                <button type="button" className="save-btn" aria-label="Guardar" onClick={() => void toggleFavorite(listing.id)}>
                  {favoriteIds.includes(listing.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="card-body">
                <h3>{listing.title}</h3>
                <p className="location">{listing.location}</p>
                <div className="meta-row">
                  <strong className="price">{priceLabel(listing.price)}</strong>
                  <span className="people">{listing.people || "Sin dato"}</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                  <Link
                    className="filter-btn"
                    href={`/vistas/publicacion-detalle?listingId=${encodeURIComponent(listing.id)}&userId=${encodeURIComponent(listing.hostId)}`}
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
