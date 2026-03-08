"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ReviewStatus = "Pendiente" | "Aprobado" | "Rechazado";
type FilterTab = "todos" | "pendientes" | "aprobados" | "rechazados";

type DocumentItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  documentType: string;
  submittedAt: string;
  status: ReviewStatus;
  image: string;
};

const initialDocuments: DocumentItem[] = [
  {
    id: "DOC-001",
    name: "María González",
    email: "maria.gonzalez@ejemplo.com",
    phone: "+52 55 1234 5678",
    university: "UNAM - Psicología",
    documentType: "Credencial universitaria",
    submittedAt: "20 abr 2026, 10:30 a.m.",
    status: "Pendiente",
    image:
      "https://images.pexels.com/photos/268362/pexels-photo-268362.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "DOC-002",
    name: "Carlos Ramírez",
    email: "carlos.ramirez@ejemplo.com",
    phone: "+52 55 9876 5432",
    university: "ITESM - Ingeniería",
    documentType: "Identificación oficial",
    submittedAt: "21 abr 2026, 02:15 p.m.",
    status: "Pendiente",
    image:
      "https://images.pexels.com/photos/886743/pexels-photo-886743.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "DOC-003",
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    phone: "+52 55 5555 1234",
    university: "TEC de Monterrey - Diseño Gráfico",
    documentType: "Credencial universitaria",
    submittedAt: "21 abr 2026, 09:20 a.m.",
    status: "Pendiente",
    image:
      "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "DOC-004",
    name: "Luis Ortega",
    email: "luis.ortega@ejemplo.com",
    phone: "+52 55 2233 4455",
    university: "UAM - Economía",
    documentType: "Comprobante de inscripción",
    submittedAt: "22 abr 2026, 08:05 a.m.",
    status: "Aprobado",
    image:
      "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "DOC-005",
    name: "Sofía Torres",
    email: "sofia.torres@ejemplo.com",
    phone: "+52 55 7788 9911",
    university: "IPN - Arquitectura",
    documentType: "Credencial universitaria",
    submittedAt: "22 abr 2026, 09:40 a.m.",
    status: "Rechazado",
    image:
      "https://images.pexels.com/photos/374746/pexels-photo-374746.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
      <path d="M14 7l5 5-5 5" />
      <path d="M19 12H9" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v6h6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.8 1.7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
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

export default function DocumentosVerificacionPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeTab, setActiveTab] = useState<FilterTab>("pendientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0].id);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesTab =
        activeTab === "todos" ||
        (activeTab === "pendientes" && document.status === "Pendiente") ||
        (activeTab === "aprobados" && document.status === "Aprobado") ||
        (activeTab === "rechazados" && document.status === "Rechazado");

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [document.name, document.email, document.university, document.documentType, document.id]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, documents, searchTerm]);

  const selectedDocument =
    filteredDocuments.find((document) => document.id === selectedDocumentId) || filteredDocuments[0] || documents[0];

  const counts = {
    total: documents.length,
    pending: documents.filter((document) => document.status === "Pendiente").length,
    approved: documents.filter((document) => document.status === "Aprobado").length,
    rejected: documents.filter((document) => document.status === "Rechazado").length,
  };

  function updateDocumentStatus(status: ReviewStatus) {
    if (!selectedDocument) {
      return;
    }

    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === selectedDocument.id
          ? {
              ...document,
              status,
            }
          : document,
      ),
    );
  }

  function logout() {
    window.localStorage.removeItem("partnerlooking_token");
    window.localStorage.removeItem("partnerlooking_role");
    window.location.href = "/";
  }

  return (
    <main className="docs-page">
      <header className="docs-topbar">
        <div className="docs-topbar-title">
          <ShieldIcon />
          <span>Panel de Administración</span>
        </div>
        <button type="button" className="docs-logout-btn" onClick={logout}>
          <LogoutIcon />
          Cerrar sesión
        </button>
      </header>

      <section className="docs-hero-grid">
        <article className="docs-stat-card">
          <div className="docs-stat-icon docs-stat-docs">
            <DocumentIcon />
          </div>
          <div className="docs-stat-copy">
            <span>Total documentos</span>
            <strong>{counts.total}</strong>
          </div>
        </article>

        <article className="docs-stat-card">
          <div className="docs-stat-icon docs-stat-pending">
            <ClockIcon />
          </div>
          <div className="docs-stat-copy">
            <span>Pendientes</span>
            <strong>{counts.pending}</strong>
          </div>
        </article>

        <article className="docs-stat-card">
          <div className="docs-stat-icon docs-stat-approved">
            <CheckIcon />
          </div>
          <div className="docs-stat-copy">
            <span>Aprobados</span>
            <strong>{counts.approved}</strong>
          </div>
        </article>

        <article className="docs-stat-card">
          <div className="docs-stat-icon docs-stat-rejected">
            <CloseIcon />
          </div>
          <div className="docs-stat-copy">
            <span>Rechazados</span>
            <strong>{counts.rejected}</strong>
          </div>
        </article>
      </section>

      <section className="docs-controls-bar">
        <div className="docs-search-wrap">
          <SearchIcon />
          <input
            type="search"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="docs-tabs-row">
          <button type="button" className={`docs-tab ${activeTab === "todos" ? "active" : ""}`} onClick={() => setActiveTab("todos")}>Todos</button>
          <button type="button" className={`docs-tab ${activeTab === "pendientes" ? "active" : ""}`} onClick={() => setActiveTab("pendientes")}>Pendientes ({counts.pending})</button>
          <button type="button" className={`docs-tab ${activeTab === "aprobados" ? "active" : ""}`} onClick={() => setActiveTab("aprobados")}>Aprobados</button>
          <button type="button" className={`docs-tab ${activeTab === "rechazados" ? "active" : ""}`} onClick={() => setActiveTab("rechazados")}>Rechazados</button>
        </div>
      </section>

      <section className="docs-cards-grid">
        {filteredDocuments.map((document) => (
          <article key={document.id} className={`docs-card ${selectedDocument?.id === document.id ? "selected" : ""}`}>
            <div className="docs-card-image">
              <Image src={document.image} alt={document.documentType} fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span className={`docs-card-status docs-card-status-${document.status.toLowerCase()}`}>{document.status}</span>
              <span className="docs-card-chip">{document.documentType}</span>
            </div>

            <div className="docs-card-body">
              <h2>{document.name}</h2>
              <p>{document.email}</p>
              <p>{document.phone}</p>
              <p>{document.university}</p>
              <span className="docs-card-date">Enviado: {document.submittedAt}</span>
              <button
                type="button"
                className="docs-review-btn"
                onClick={() => {
                  setSelectedDocumentId(document.id);
                  updateDocumentStatus(document.status);
                }}
              >
                <ShieldIcon />
                Revisar
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="docs-review-panel">
        <div className="docs-review-panel-head">
          <div>
            <span className={`docs-card-status docs-card-status-${selectedDocument?.status.toLowerCase() || "pendiente"}`}>
              {selectedDocument?.status || "Pendiente"}
            </span>
            <h3>{selectedDocument?.name}</h3>
            <p>{selectedDocument?.email} · {selectedDocument?.university}</p>
          </div>
          <div className="docs-review-mini">
            <div>
              <span>Documento</span>
              <strong>{selectedDocument?.documentType}</strong>
            </div>
            <div>
              <span>Enviado</span>
              <strong>{selectedDocument?.submittedAt}</strong>
            </div>
          </div>
        </div>

        <div className="docs-review-split">
          <div className="docs-review-preview">
            <Image src={selectedDocument?.image || initialDocuments[0].image} alt="Vista previa del documento" fill sizes="(max-width: 760px) 100vw, 640px" />
          </div>

          <div className="docs-review-details">
            <h4>Detalle del análisis</h4>
            <div className="docs-review-row">
              <span>Coincidencia de nombre</span>
              <strong>Alta</strong>
            </div>
            <div className="docs-review-row">
              <span>Legibilidad</span>
              <strong>{selectedDocument?.status === "Rechazado" ? "Baja" : "Correcta"}</strong>
            </div>
            <div className="docs-review-row">
              <span>Verificación</span>
              <strong>{selectedDocument?.status === "Aprobado" ? "Completa" : "Pendiente"}</strong>
            </div>

            <div className="docs-notes-box">
              <span>Notas del admin</span>
              <p>
                {selectedDocument?.status === "Aprobado"
                  ? "Documento validado correctamente."
                  : selectedDocument?.status === "Rechazado"
                    ? "Documento rechazado por inconsistencias visuales."
                    : "Documento en revisión manual. Verifica nitidez, coincidencia de datos y vigencia."}
              </p>
            </div>

            <div className="docs-actions-row">
              <button type="button" className="docs-action approve" onClick={() => updateDocumentStatus("Aprobado")}>
                <CheckIcon />
                Aprobar
              </button>
              <button type="button" className="docs-action changes" onClick={() => updateDocumentStatus("Pendiente")}>
                <DocumentIcon />
                Pedir cambios
              </button>
              <button type="button" className="docs-action reject" onClick={() => updateDocumentStatus("Rechazado")}>
                <CloseIcon />
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}