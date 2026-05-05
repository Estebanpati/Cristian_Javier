import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Dashboard  from "./pages/Dashboard";
import Personas   from "./pages/Personas";
import Bloques    from "./pages/Bloques";
import Catalogos  from "./pages/Catalogos";
import Registro   from "./pages/Registro";

const NAV = [
  { to: "/",          label: "Dashboard",  icon: "bi-speedometer2" },
  { to: "/personas",  label: "Personas",   icon: "bi-people" },
  { to: "/bloques",   label: "Bloques",    icon: "bi-collection" },
  { to: "/catalogos", label: "Catálogos",  icon: "bi-tags" },
];

const PAGE_TITLES = {
  "/":          "DASHBOARD",
  "/personas":  "PERSONAS",
  "/bloques":   "BLOQUES",
  "/catalogos": "CATÁLOGOS",
  "/registro":  "REGISTRO",
};

// Registro page goes fullscreen without sidebar
function RegisterLayout() {
  return <Registro />;
}

function AppLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "LABURO";

  return (
    <div style={{ display: "flex" }}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">LABURO</div>
            <div className="logo-sub">Sistema de Gestión</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navegación</div>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              <span className="nav-icon"><i className={`bi ${icon}`}></i></span>
              {label}
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: "1.5rem" }}>Acceso</div>
          <NavLink
            to="/registro"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <span className="nav-icon"><i className="bi bi-person-plus"></i></span>
            Registro público
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div>v1.0.0 — 2025</div>
          <div style={{ color: "var(--cyan)", marginTop: "0.25rem" }}>● ONLINE</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content" style={{ flex: 1 }}>
        <div className="topbar">
          <span className="topbar-title">{title}</span>
          <span className="topbar-status">SISTEMA ACTIVO</span>
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
  const location = useLocation();
  const isRegister = location.pathname === "/registro";

  if (isRegister) return <Routes><Route path="/registro" element={<RegisterLayout />} /></Routes>;

  return (
    <Routes>
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}
