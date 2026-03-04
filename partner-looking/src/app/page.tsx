import Image from "next/image";
import Link from "next/link";

type Feature = {
  title: string;
  text: string;
};

type Listing = {
  title: string;
  location: string;
  price: string;
  people: string;
  image: string;
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

const listings: Listing[] = [
  {
    title: "Habitacion amplia cerca de UNAM",
    location: "Ciudad Universitaria, CDMX",
    price: "$ 3,500/mes",
    people: "2 personas",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Departamento completo - 2 recamaras",
    location: "Narvarte, CDMX",
    price: "$ 12,000/mes",
    people: "2 personas",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Busco roommate - Estudiante TEC",
    location: "Santa Fe, CDMX",
    price: "$ 4,500/mes",
    people: "2 personas",
    image:
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Cuarto individual con bano privado",
    location: "Copilco, CDMX",
    price: "$ 5,200/mes",
    people: "3 personas",
    image:
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Estudio amueblado - Zona segura",
    location: "Del Valle, CDMX",
    price: "$ 8,500/mes",
    people: "1 persona",
    image:
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Habitacion compartida economica",
    location: "Coyoacan, CDMX",
    price: "$ 2,800/mes",
    people: "4 personas",
    image:
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
        <button className="publish-btn" type="button">
          + Publicar
        </button>
        <button className="icon-btn" type="button" aria-label="Mensajes">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2v4l4-4h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
          </svg>
        </button>
        <button className="icon-btn" type="button" aria-label="Perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
          </svg>
        </button>
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
            <button className="tab" type="button" role="tab" aria-selected="false">
              Roommates
            </button>
          </div>
          <button className="filter-btn" type="button">
            Filtros
          </button>
        </div>

        <div className="section-header">
          <h2>Publicaciones recientes</h2>
          <p>Explora las mejores opciones de alojamiento y roommates</p>
        </div>

        <div className="listing-grid">
          {listings.map((item) => (
            <article className="listing-card" key={item.title}>
              <div className="image-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
                />
                <span className="pill">Disponible</span>
                <button className="save-btn" type="button" aria-label="Guardar">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20.5s-6.5-3.8-6.5-8.8c0-2.4 1.9-4.2 4.2-4.2 1.3 0 2.2.5 2.8 1.4.6-.9 1.5-1.4 2.8-1.4 2.3 0 4.2 1.8 4.2 4.2 0 5-6.5 8.8-6.5 8.8z" />
                  </svg>
                </button>
              </div>

              <div className="card-body">
                <h3>{item.title}</h3>
                <p className="location">{item.location}</p>
                <div className="meta-row">
                  <span className="price">{item.price}</span>
                  <span className="people">{item.people}</span>
                </div>
                <Link className="card-link" href="/vistas/publicacion-detalle">
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
