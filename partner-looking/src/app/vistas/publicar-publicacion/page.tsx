"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StepId = 1 | 2 | 3 | 4 | 5;

type PublicationType = {
  id: string;
  title: string;
  description: string;
  icon: "room" | "building" | "roommate";
};

const publicationTypes: PublicationType[] = [
  {
    id: "room",
    title: "Habitación",
    description: "Renta una habitación en tu casa",
    icon: "room",
  },
  {
    id: "apartment",
    title: "Departamento",
    description: "Renta un departamento completo",
    icon: "building",
  },
  {
    id: "roommate",
    title: "Busco Roommate",
    description: "Encuentra compañeros de cuarto",
    icon: "roommate",
  },
];

const amenityItems = [
  "WiFi de alta velocidad",
  "TV por cable",
  "Aire acondicionado",
  "Estacionamiento",
  "Baño privado",
  "Cocina equipada",
  "Muebles incluidos",
  "Zona segura 24/7",
] as const;

const houseRules = [
  "¿Se permiten mascotas?",
  "¿Se permite fumar?",
  "¿Se permiten visitas?",
] as const;

const steps: Array<{ id: StepId; label: string }> = [
  { id: 1, label: "Tipo" },
  { id: 2, label: "Básica" },
  { id: 3, label: "Ubicación" },
  { id: 4, label: "Amenidades" },
  { id: 5, label: "Fotos" },
];

function StepIcon({ kind }: { kind: PublicationType["icon"] }) {
  if (kind === "building") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V4h16v16" />
        <path d="M8 20v-4h3v4" />
        <path d="M13 20v-3h3v3" />
        <path d="M7 8h2" />
        <path d="M7 11h2" />
        <path d="M12 8h2" />
        <path d="M12 11h2" />
      </svg>
    );
  }

  if (kind === "roommate") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M16.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M3.8 18.5c.7-2.4 2.7-3.8 4.7-3.8 2 0 4 1.4 4.7 3.8" />
        <path d="M13.7 17.7c.5-1.9 2-3 3.6-3 1.5 0 3 .9 3.7 2.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 16.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5" />
    </svg>
  );
}

function AmenityIcon({ label }: { label: string }) {
  if (label.includes("WiFi")) {
    return <path d="M3 9c4.4-4 13.6-4 18 0" />;
  }
  if (label.includes("TV")) {
    return (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M10 3h4" />
      </>
    );
  }
  if (label.includes("Aire")) {
    return (
      <>
        <path d="M3 9h10a2 2 0 1 0-2-2" />
        <path d="M3 13h14a2 2 0 1 1-2 2" />
      </>
    );
  }
  if (label.includes("Estacionamiento")) {
    return (
      <>
        <path d="M6 15h12l-1.2-4H7.2L6 15z" />
        <circle cx="8" cy="16" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
      </>
    );
  }
  if (label.includes("Baño")) {
    return (
      <>
        <path d="M4 12h16" />
        <path d="M6 12v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2" />
      </>
    );
  }
  if (label.includes("Cocina")) {
    return (
      <>
        <path d="M6 4v16" />
        <path d="M10 4v16" />
        <path d="M14 7h6" />
        <path d="M14 13h6" />
      </>
    );
  }
  if (label.includes("Muebles")) {
    return (
      <>
        <path d="M4 14h16" />
        <path d="M6 14V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
      </>
    );
  }
  return (
    <>
      <path d="M12 2.5 5 5.5v6c0 4.5 2.9 8.7 7 10 4.1-1.3 7-5.5 7-10v-6l-7-3z" />
    </>
  );
}

export default function CreatePublicationPage() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [selectedType, setSelectedType] = useState("room");
  const progress = useMemo(() => currentStep * 20, [currentStep]);

  const goNext = () => setCurrentStep((step) => Math.min(5, step + 1) as StepId);
  const goBack = () => setCurrentStep((step) => Math.max(1, step - 1) as StepId);

  return (
    <div className="create-page">
      <header className="create-topbar">
        <Link href="/" className="create-cancel-link">
          <ArrowLeftIcon />
          Cancelar
        </Link>
        <h1>Crear publicación</h1>
        <span />
      </header>

      <section className="create-progress-shell">
        <div className="create-progress-meta">
          <span>Paso {currentStep} de 5</span>
          <span>{progress}%</span>
        </div>
        <div className="create-progress-bar">
          <div className="create-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="create-stepper">
          {steps.map((step) => (
            <div key={step.id} className={`create-step ${step.id === currentStep ? "active" : step.id < currentStep ? "done" : ""}`}>
              <span>{step.id}</span>
              <small>{step.label}</small>
            </div>
          ))}
        </div>
      </section>

      <main className="create-content-shell">
        <section className="create-card">
          {currentStep === 1 && (
            <>
              <h2>¿Qué deseas publicar?</h2>
              <p>Selecciona el tipo de publicación que mejor se adapte a tus necesidades</p>
              <div className="publication-types-grid">
                {publicationTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`publication-type-card ${selectedType === item.id ? "selected" : ""}`}
                    onClick={() => setSelectedType(item.id)}
                  >
                    <span className="publication-type-icon">
                      <StepIcon kind={item.icon} />
                    </span>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2>Información básica</h2>
              <p>Cuéntanos sobre tu publicación</p>
              <div className="form-grid">
                <label className="field field-full">
                  <span>Título de la publicación</span>
                  <input type="text" placeholder="Ej: Habitación amplia cerca de UNAM" />
                </label>
                <label className="field field-full">
                  <span>Descripción</span>
                  <textarea
                    rows={7}
                    placeholder="Describe las características principales, ambiente, y lo que buscas en un roommate..."
                  />
                  <small>Mínimo 100 caracteres</small>
                </label>
                <label className="field field-full">
                  <span>Tipo de espacio</span>
                  <select defaultValue="Habitación privada">
                    <option>Habitación privada</option>
                    <option>Departamento completo</option>
                    <option>Espacio compartido</option>
                  </select>
                </label>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2>Ubicación y precio</h2>
              <p>Información sobre dónde se encuentra y cuánto cuesta</p>
              <div className="form-grid form-grid-two">
                <label className="field field-full">
                  <span>Dirección completa</span>
                  <input type="text" placeholder="Av. Universidad 3000" />
                </label>
                <label className="field">
                  <span>Ciudad</span>
                  <input type="text" placeholder="Ciudad de México" />
                </label>
                <label className="field">
                  <span>Colonia/Delegación</span>
                  <input type="text" placeholder="Ciudad Universitaria" />
                </label>
                <label className="field">
                  <span>Precio mensual (MXN)</span>
                  <div className="input-prefix">
                    <span>$</span>
                    <input type="text" placeholder="3500" />
                  </div>
                </label>
                <label className="field">
                  <span>Disponible desde</span>
                  <input type="text" placeholder="mm/dd/yyyy" />
                </label>
                <label className="field field-full">
                  <span>Número de roommates actuales</span>
                  <select defaultValue="1 persona">
                    <option>1 persona</option>
                    <option>2 personas</option>
                    <option>3 personas</option>
                    <option>4 personas</option>
                  </select>
                </label>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2>Amenidades incluidas</h2>
              <p>Selecciona las amenidades que ofreces</p>
              <div className="amenity-grid">
                {amenityItems.map((amenity) => (
                  <button key={amenity} type="button" className="amenity-card">
                    <span className="amenity-card-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <AmenityIcon label={amenity} />
                      </svg>
                    </span>
                    <span>{amenity}</span>
                  </button>
                ))}
              </div>

              <div className="house-rules-block">
                <h3>Reglas de la casa</h3>
                <div className="house-rules-list">
                  {houseRules.map((rule, index) => (
                    <label key={rule} className="rule-row">
                      <span>{rule}</span>
                      <input type="checkbox" defaultChecked={index === 2} />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <h2>Agrega fotos</h2>
              <p>Las publicaciones con fotos reciben 5x más respuestas</p>
              <div className="photo-dropzone">
                <UploadIcon />
                <strong>Arrastra tus fotos aquí</strong>
                <span>o haz clic para seleccionar archivos</span>
                <button type="button" className="select-photos-btn">
                  Seleccionar fotos
                </button>
                <small>JPG, PNG o WEBP · Máximo 10 fotos</small>
              </div>

              <div className="photos-tips">
                <h3>Consejos para mejores fotos</h3>
                <ul>
                  <li>Usa buena iluminación natural</li>
                  <li>Muestra diferentes ángulos de la habitación</li>
                  <li>Incluye fotos de áreas comunes</li>
                  <li>Mantén el espacio ordenado y limpio</li>
                </ul>
              </div>
            </>
          )}
        </section>

        <footer className="create-footer-actions">
          <button type="button" className="secondary-action" onClick={goBack} disabled={currentStep === 1}>
            <ArrowLeftIcon />
            Anterior
          </button>
          {currentStep < 5 ? (
            <button type="button" className="primary-action" onClick={goNext}>
              Siguiente
              <ArrowRightIcon />
            </button>
          ) : (
            <button type="button" className="publish-action">
              ✓ Publicar ahora
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
