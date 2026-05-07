import { useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Personas  from "./pages/Personas";
import Bloques   from "./pages/Bloques";
import Catalogos from "./pages/Catalogos";
import Registro  from "./pages/Registro";

const NAV = [
  { to: "/",          label: "Dashboard",      icon: "bi-speedometer2" },
  { to: "/personas",  label: "Personas",       icon: "bi-people" },
  { to: "/bloques",   label: "Bloques",        icon: "bi-collection" },
  { to: "/catalogos", label: "Catálogos",      icon: "bi-tags" },
];

const TITLES = {
  "/":          "Dashboard",
  "/personas":  "Personas",
  "/bloques":   "Bloques",
  "/catalogos": "Catálogos",
  "/registro":  "Registro público",
};

function AppLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: "flex" }}>
      {/* Overlay móvil */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">💼</div>
          <div>
            <div className="brand-name">Laburo</div>
            <div className="brand-sub">Sistema de gestión</div>
          </div>
          {/* Botón cerrar en móvil */}
          <button
            onClick={closeSidebar}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center" }}
            aria-label="Cerrar menú"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menú principal</div>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={closeSidebar}
            >
              <i className={`bi ${icon}`}></i> {label}
            </NavLink>
          ))}
          <div className="nav-section-label" style={{ marginTop: "1rem" }}>Público</div>
          <NavLink
            to="/registro"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            onClick={closeSidebar}
          >
            <i className="bi bi-person-plus"></i> Registro público
          </NavLink>
        </nav>

        <div className="sidebar-footer">Laburo v1.0 — 2026</div>
      </aside>

      {/* Main */}
      <main className="main-content" style={{ flex: 1 }}>
        {/* Topbar */}
        <div className="topbar">
          {/* Hamburguesa — solo visible en móvil */}
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            style={{ display: "none" }}
            id="hamburger-btn"
          >
            <i className="bi bi-list"></i>
          </button>

          <span className="topbar-title">{TITLES[pathname] || "Laburo"}</span>
          <span className="topbar-badge">Sistema activo</span>
        </div>

        <div className="page-body">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/personas"  element={<Personas />} />
            <Route path="/bloques"   element={<Bloques />} />
            <Route path="/catalogos" element={<Catalogos />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  if (pathname === "/registro") {
    return <Routes><Route path="/registro" element={<Registro />} /></Routes>;
  }
  return <Routes><Route path="/*" element={<AppLayout />} /></Routes>;
}
