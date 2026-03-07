import Image from "next/image";
import Link from "next/link";

type FilterChip = {
  label: string;
  active?: boolean;
};

type RoommateProfile = {
  name: string;
  age: number;
  school: string;
  career: string;
  location: string;
  description: string;
  gender: string;
  image: string;
  interests: string[];
  traits: {
    cleanliness: string;
    social: string;
    schedule: string;
  };
  budget: string;
  date: string;
  verified?: boolean;
};

const filterChips: FilterChip[] = [
  { label: "Todos", active: true },
  { label: "Verificados" },
  { label: "UNAM" },
  { label: "TEC" },
  { label: "Zona Sur" },
  { label: "Disponible ya" },
];

const profiles: RoommateProfile[] = [
  {
    name: "María González",
    age: 22,
    school: "UNAM",
    career: "Psicología",
    location: "Coyoacán, CDMX",
    description:
      "Estudiante de psicología buscando roommate tranquilo y ordenado. Me gusta el yoga, leer y tomar café.",
    gender: "Mujer",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Music", "Coffee", "Reading", "Fitness"],
    traits: {
      cleanliness: "★★★★☆",
      social: "★★★☆☆",
      schedule: "Nocturno",
    },
    budget: "$ 3,000 - $ 4,500",
    date: "1 Jun 2026",
    verified: true,
  },
  {
    name: "Carlos Ramírez",
    age: 23,
    school: "TEC de Monterrey",
    career: "Ingeniería en Sistemas",
    location: "Santa Fe, CDMX",
    description:
      "Ingeniero en formación, gamer casual y amante del café. Busco ambiente tranquilo para estudiar.",
    gender: "Hombre",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Gaming", "Coffee", "Music", "Reading"],
    traits: {
      cleanliness: "★★★★☆",
      social: "★★★☆☆",
      schedule: "Madrugador",
    },
    budget: "$ 4,000 - $ 6,000",
    date: "15 May 2026",
    verified: true,
  },
  {
    name: "Ana Martínez",
    age: 21,
    school: "UAM",
    career: "Diseño Gráfico",
    location: "Roma Norte, CDMX",
    description:
      "Diseñadora creativa, me encanta el arte, la música indie y los espacios inspiradores.",
    gender: "Mujer",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Art", "Music", "Coffee", "Reading"],
    traits: {
      cleanliness: "★★★☆☆",
      social: "★★★★☆",
      schedule: "Flexible",
    },
    budget: "$ 3,500 - $ 5,000",
    date: "1 Jul 2026",
    verified: true,
  },
  {
    name: "Luis Hernández",
    age: 24,
    school: "UNAM",
    career: "Medicina",
    location: "Ciudad Universitaria, CDMX",
    description:
      "Estudiante de medicina, busco lugar cerca de CU. Tranquilo, responsable y enfocado en mis estudios.",
    gender: "Hombre",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Reading", "Fitness", "Music"],
    traits: {
      cleanliness: "★★★★★",
      social: "★★★☆☆",
      schedule: "Madrugador",
    },
    budget: "$ 2,800 - $ 4,000",
    date: "10 Jun 2026",
  },
  {
    name: "Sofía Torres",
    age: 22,
    school: "ITAM",
    career: "Economía",
    location: "Polanco, CDMX",
    description:
      "Estudiante de economía, amante del fitness y la vida saludable. Busco ambiente positivo.",
    gender: "Mujer",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Fitness", "Coffee", "Reading", "Music"],
    traits: {
      cleanliness: "★★★★☆",
      social: "★★★★☆",
      schedule: "Madrugador",
    },
    budget: "$ 5,000 - $ 7,000",
    date: "1 May 2026",
    verified: true,
  },
  {
    name: "Diego Sánchez",
    age: 23,
    school: "IPN",
    career: "Arquitectura",
    location: "Condesa, CDMX",
    description:
      "Arquitecto en formación, creativo y ordenado. Me gusta el arte, los museos y el buen diseño.",
    gender: "Hombre",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1200",
    interests: ["Art", "Music", "Coffee"],
    traits: {
      cleanliness: "★★★★☆",
      social: "★★★★☆",
      schedule: "Nocturno",
    },
    budget: "$ 3,000 - $ 4,500",
    date: "20 May 2026",
    verified: true,
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5s-6.5-3.8-6.5-8.8c0-2.4 1.9-4.2 4.2-4.2 1.3 0 2.2.5 2.8 1.4.6-.9 1.5-1.4 2.8-1.4 2.3 0 4.2 1.8 4.2 4.2 0 5-6.5 8.8-6.5 8.8z" />
    </svg>
  );
}

function MiniIcon({ kind }: { kind: string }) {
  if (kind === "Music") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="16" r="2" /></svg>
    );
  }
  if (kind === "Coffee") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h9v6a4 4 0 0 1-4 4H8a2 2 0 0 1-2-2V8z" /><path d="M15 9h2a2 2 0 1 1 0 4h-2" /></svg>
    );
  }
  if (kind === "Reading") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5z" /><path d="M20 5h-6a3 3 0 0 0-3 3v11h6a3 3 0 0 1 3 3V5z" /></svg>
    );
  }
  if (kind === "Fitness") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h3l2-3 3 9 2-6h8" /><path d="M3 14h18" /></svg>
    );
  }
  if (kind === "Gaming") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4z" /><path d="M9 12h2" /><path d="M10 11v2" /><circle cx="15.5" cy="12.5" r="1" /><circle cx="18" cy="11.5" r="1" /></svg>
    );
  }
  if (kind === "Art") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a8 8 0 1 0 8 8c0-1.7-.5-3.3-1.4-4.6A4 4 0 0 0 12 3z" /><path d="M8 14c1 .8 1.5 1.7 1.5 3" /></svg>
    );
  }
  return null;
}

export default function RoommatesPage() {
  return (
    <div className="roommates-page">
      <header className="roommates-hero-bar">
        <div className="roommates-topbar-shell">
          <div className="brand">PartnerLooking</div>
          <div className="search-wrap roommates-search">
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
          <Link className="icon-btn" href="/vistas/perfil-usuario" aria-label="Perfil">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c0-3.6 2.7-5.8 7-5.8 4.3 0 7 2.2 7 5.8" />
            </svg>
          </Link>
        </div>
      </header>

      <section className="roommates-toolbar-wrap">
        <div className="listing-area roommates-shell roommates-tabs-row">
          <div className="tabs">
            <Link className="tab" href="/" role="tab" aria-selected="false">
              Alojamiento
            </Link>
            <button className="tab active" type="button" role="tab" aria-selected="true">
              Roommates
            </button>
          </div>
          <button className="filter-btn" type="button">
            Filtros
          </button>
        </div>
      </section>

      <section className="roommates-hero">
        <div className="roommates-shell roommates-hero-inner">
          <div className="roommates-hero-copy">
            <span className="roommates-hero-eyebrow">Roommates</span>
            <h1>Encuentra tu roommate ideal</h1>
            <p>
              Descubre perfiles compatibles por universidad, zona, presupuesto y estilo de vida.
            </p>
          </div>

          <div className="roommates-hero-stats">
            <div>
              <strong>6+</strong>
              <span>Perfiles compatibles</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Verificados</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Soporte de seguridad</span>
            </div>
          </div>
        </div>
      </section>

      <main className="roommates-shell roommates-content">
        <section className="roommates-header-block">
          <div>
            <p className="roommates-kicker">Encuentra tu roommate ideal</p>
          </div>
          <button className="filter-btn advanced-btn" type="button">
            Filtros avanzados
          </button>
        </section>

        <div className="chips-row" aria-label="Filtros rapidos">
          {filterChips.map((chip) => (
            <button
              key={chip.label}
              className={`chip ${chip.active ? "chip-active" : ""}`}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <p className="results-hint">Mostrando 6 perfiles compatibles</p>

        <section className="roommate-grid">
          {profiles.map((profile) => (
            <article className="roommate-card" key={profile.name}>
              <div className="roommate-card-top">
                {profile.verified ? <span className="verified-pill">Verificado</span> : <span />}
                <button className="save-btn roommate-save" type="button" aria-label="Guardar perfil">
                  <HeartIcon />
                </button>
              </div>

              <div className="roommate-hero">
                <div className="avatar-frame">
                  <Image src={profile.image} alt={profile.name} fill sizes="(max-width: 720px) 70vw, 250px" />
                </div>
              </div>

              <div className="roommate-body">
                <div className="roommate-name-row">
                  <h3>
                    {profile.name}, {profile.age}
                  </h3>
                  <span className="gender-tag">{profile.gender}</span>
                </div>
                <p className="roommate-school">{profile.school}</p>
                <p className="roommate-career">{profile.career}</p>
                <p className="roommate-location">{profile.location}</p>
                <p className="roommate-description">{profile.description}</p>

                <div className="roommate-section-title">Intereses</div>
                <div className="interest-row">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="interest-chip">
                      <MiniIcon kind={interest} />
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="compatibility-list">
                  <div>
                    <span>Limpieza</span>
                    <strong>{profile.traits.cleanliness}</strong>
                  </div>
                  <div>
                    <span>Sociabilidad</span>
                    <strong>{profile.traits.social}</strong>
                  </div>
                  <div>
                    <span>Horario</span>
                    <strong>{profile.traits.schedule}</strong>
                  </div>
                </div>

                <div className="roommate-footer-meta">
                  <span className="roommate-budget">{profile.budget}</span>
                  <span className="roommate-date">📅 {profile.date}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="center-actions">
          <button className="load-more" type="button">
            Cargar más perfiles
          </button>
        </div>
      </main>
    </div>
  );
}
