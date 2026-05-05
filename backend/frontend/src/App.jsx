import { Routes, Route, NavLink } from "react-router-dom";

import Dashboard     from "./pages/Dashboard";
import Personas      from "./pages/Personas";
import Bloques       from "./pages/Bloques";
import Catalogos     from "./pages/Catalogos";

export default function App() {
  return (
    <div className="d-flex">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="brand">
          <i className="bi bi-briefcase-fill me-2"></i>Laburo
        </div>
        <nav className="d-flex flex-column gap-1">
          <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
          <NavLink to="/personas" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <i className="bi bi-people"></i> Personas
          </NavLink>
          <NavLink to="/bloques" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <i className="bi bi-collection"></i> Bloques
          </NavLink>
          <NavLink to="/catalogos" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <i className="bi bi-tags"></i> Catálogos
          </NavLink>
        </nav>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="main-content flex-grow-1">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/personas"  element={<Personas />} />
          <Route path="/bloques"   element={<Bloques />} />
          <Route path="/catalogos" element={<Catalogos />} />
        </Routes>
      </main>
    </div>
  );
}
