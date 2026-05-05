import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ personas: "—", bloques: "—" });

  useEffect(() => {
    api.get("/personas").then((r) => setCounts((c) => ({ ...c, personas: r.data.length }))).catch(() => {});
    api.get("/bloques").then((r)  => setCounts((c) => ({ ...c, bloques:  r.data.length }))).catch(() => {});
  }, []);

  const stats = [
    { label: "Personas",         value: counts.personas, icon: "bi-people-fill",     accent: "#00d4ff",  bg: "rgba(0,212,255,0.1)" },
    { label: "Bloques activos",  value: counts.bloques,  icon: "bi-collection-fill", accent: "#00ff88",  bg: "rgba(0,255,136,0.1)" },
    { label: "Niv. Académicos",  value: "6",             icon: "bi-mortarboard-fill",accent: "#ff6b35",  bg: "rgba(255,107,53,0.1)" },
    { label: "Roles",            value: "3",             icon: "bi-shield-fill",     accent: "#7c3aed",  bg: "rgba(124,58,237,0.1)" },
  ];

  return (
    <>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card" style={{ "--accent-color": s.accent }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.accent }}>
              <i className={`bi ${s.icon}`}></i>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid de info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Endpoints activos */}
        <div className="tech-card">
          <div className="tech-card-header">
            <span>Endpoints activos</span>
            <span className="header-accent"><i className="bi bi-activity"></i> LIVE</span>
          </div>
          <div style={{ padding: "1rem" }}>
            {[
              ["GET", "/api/personas",                "#00d4ff"],
              ["POST","  /api/personas",              "#00ff88"],
              ["GET", "/api/bloques",                 "#00d4ff"],
              ["GET", "/api/niveles-academicos",      "#00d4ff"],
              ["GET", "/api/niveles-responsabilidad", "#00d4ff"],
            ].map(([method, path, color], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.3rem", borderRadius: "7px", background: "rgba(0,0,0,0.2)" }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: "4px", padding: "2px 6px", minWidth: "40px", textAlign: "center" }}>{method}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sistema */}
        <div className="tech-card">
          <div className="tech-card-header">
            <span>Estado del sistema</span>
            <span className="header-accent"><i className="bi bi-cpu"></i></span>
          </div>
          <div style={{ padding: "1.25rem" }}>
            {[
              ["Base de datos",  "PostgreSQL",       "var(--green)"],
              ["ORM / Driver",   "node-postgres (pg)","var(--cyan)"],
              ["Backend",        "Express 4.x",       "var(--cyan)"],
              ["Frontend",       "React + Vite",      "var(--cyan)"],
              ["Estilos",        "Bootstrap + Custom","var(--orange)"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{k}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="tech-card" style={{ gridColumn: "1 / -1" }}>
          <div className="tech-card-header">
            <span>Accesos rápidos</span>
          </div>
          <div style={{ padding: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { href: "/personas",  icon: "bi-person-plus", label: "Nueva persona",   cls: "btn-primary-tech" },
              { href: "/bloques",   icon: "bi-plus-circle",  label: "Nuevo bloque",   cls: "btn-success-tech" },
              { href: "/registro",  icon: "bi-qr-code",      label: "Registro público",cls: "btn-ghost-tech" },
              { href: "/catalogos", icon: "bi-tags",         label: "Ver catálogos",  cls: "btn-ghost-tech" },
            ].map(({ href, icon, label, cls }) => (
              <a key={label} href={href} className={`btn-tech ${cls}`}>
                <i className={`bi ${icon}`}></i> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
