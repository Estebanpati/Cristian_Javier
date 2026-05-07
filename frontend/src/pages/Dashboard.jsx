import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ personas: "—", bloques: "—" });

  useEffect(() => {
    api.get("/personas").then((r) => setCounts((c) => ({ ...c, personas: r.data.length }))).catch(() => {});
    api.get("/bloques").then((r)  => setCounts((c) => ({ ...c, bloques:  r.data.length }))).catch(() => {});
  }, []);

  const stats = [
    { label: "Personas registradas", value: counts.personas, icon: "bi-people-fill",      bg: "#eff6ff", color: "var(--primary)" },
    { label: "Bloques activos",       value: counts.bloques,  icon: "bi-collection-fill",  bg: "#f0fdf4", color: "var(--success)" },
    { label: "Niveles académicos",    value: "6",              icon: "bi-mortarboard-fill", bg: "#fffbeb", color: "var(--warning)" },
    { label: "Roles definidos",       value: "3",              icon: "bi-shield-fill",      bg: "#fdf4ff", color: "#9333ea" },
  ];

  const quickLinks = [
    { to: "/personas",  icon: "bi-person-plus",  label: "Agregar nueva persona",  cls: "btn-primary-clean" },
    { to: "/bloques",   icon: "bi-plus-circle",   label: "Crear nuevo bloque",     cls: "btn-outline-clean" },
    { to: "/registro",  icon: "bi-qr-code",       label: "Formulario de registro", cls: "btn-outline-clean" },
    { to: "/catalogos", icon: "bi-tags",          label: "Gestionar catálogos",    cls: "btn-outline-clean" },
  ];

  const sysInfo = [
    ["Base de datos",  "PostgreSQL",         "var(--success)"],
    ["Driver",         "node-postgres (pg)", "var(--primary)"],
    ["Backend",        "Node.js + Express",  "var(--primary)"],
    ["Frontend",       "React + Vite",       "var(--primary)"],
    ["Estado",         "Operativo ✓",         "var(--success)"],
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h4>Bienvenido al sistema 👋</h4>
          <p>Panel general de gestión de personas y bloques</p>
        </div>
        <Link to="/registro" className="btn-primary-clean">
          <i className="bi bi-person-plus"></i> Registro público
        </Link>
      </div>

      {/* Stats — 2 col en móvil, 4 en desktop */}
      <div
        className="stat-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info grid */}
      <div
        className="info-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}
      >
        <div className="card">
          <div className="card-header-clean">
            <h6><i className="bi bi-lightning-charge-fill" style={{ color: "var(--warning)" }}></i> Accesos rápidos</h6>
          </div>
          <div
            className="quick-access-grid"
            style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}
          >
            {quickLinks.map(({ to, icon, label, cls }) => (
              <Link key={label} to={to} className={cls} style={{ justifyContent: "flex-start", fontSize: "0.85rem" }}>
                <i className={`bi ${icon}`}></i> {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header-clean">
            <h6><i className="bi bi-info-circle-fill" style={{ color: "var(--primary)" }}></i> Información del sistema</h6>
          </div>
          <div style={{ padding: "1.25rem" }}>
            {sysInfo.map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{k}</span>
                <span style={{ color: c, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
