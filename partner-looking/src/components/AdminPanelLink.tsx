"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 5.5 5.6v5.7c0 4.3 2.7 8.2 6.5 9.9 3.8-1.7 6.5-5.6 6.5-9.9V5.6z" />
    </svg>
  );
}

export default function AdminPanelLink() {
  const isAdmin = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      const storedRole = window.localStorage.getItem("partnerlooking_role") || "";
      return ["admin", "ADMIN", "administrator", "Administrador"].includes(storedRole);
    },
    () => false,
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <Link className="admin-panel-link" href="/vistas/documentos-verificacion">
      <ShieldIcon />
      Panel admin
    </Link>
  );
}