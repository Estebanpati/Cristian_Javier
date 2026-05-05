import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY = {
  nombreCompleto: "", profesion: "", idNivelAcademico: "",
  fechaNacimiento: "", idBloque: "", idNivelResponsabilidad: "", pretensionSalarial: "",
};

export default function Personas() {
  const [personas,  setPersonas]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);
  const [search,    setSearch]    = useState("");
  const [nivAcad,   setNivAcad]   = useState([]);
  const [nivResp,   setNivResp]   = useState([]);
  const [bloques,   setBloques]   = useState([]);

  const fetchPersonas = () => {
    setLoading(true);
    api.get("/personas")
      .then((r) => setPersonas(r.data))
      .catch(() => setError("No se pudo cargar las personas."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPersonas();
    api.get("/niveles-academicos").then((r) => setNivAcad(r.data));
    api.get("/niveles-responsabilidad").then((r) => setNivResp(r.data));
    api.get("/bloques").then((r) => setBloques(r.data));
  }, []);

  const openModal = (p = null) => {
    setFormError(null);
    if (p) {
      setEditId(p.id);
      setForm({
        nombreCompleto:         p.nombreCompleto,
        profesion:              p.profesion || "",
        idNivelAcademico:       p.nivelAcademico?.id || "",
        fechaNacimiento:        p.fechaNacimiento?.split("T")[0] || "",
        idBloque:               p.bloque?.id || "",
        idNivelResponsabilidad: p.nivelResponsabilidad?.id || "",
        pretensionSalarial:     p.pretensionSalarial || "",
      });
    } else {
      setEditId(null);
      setForm(EMPTY);
    }
    new window.bootstrap.Modal(document.getElementById("modalPersona")).show();
  };

  const closeModal = () =>
    window.bootstrap.Modal.getInstance(document.getElementById("modalPersona"))?.hide();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombreCompleto.trim())     return setFormError("El nombre completo es obligatorio.");
    if (!form.idNivelAcademico)          return setFormError("Selecciona el nivel académico.");
    if (!form.idNivelResponsabilidad)    return setFormError("Selecciona el nivel de responsabilidad.");
    if (!form.fechaNacimiento)           return setFormError("La fecha de nacimiento es obligatoria.");
    setSaving(true); setFormError(null);
    try {
      const body = { ...form, idBloque: form.idBloque || null, pretensionSalarial: form.pretensionSalarial || null };
      editId ? await api.put(`/personas/${editId}`, body) : await api.post("/personas", body);
      closeModal();
      fetchPersonas();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta persona?")) return;
    try { await api.delete(`/personas/${id}`); fetchPersonas(); }
    catch { alert("No se pudo eliminar."); }
  };

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const filtered = personas.filter((p) =>
    p.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
    (p.profesion || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h4 className="page-heading">Personas</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{personas.length} registros totales</p>
        </div>
        <button className="btn-tech btn-primary-tech" onClick={() => openModal()}>
          <i className="bi bi-plus-lg"></i> Nueva persona
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        <i className="bi bi-search" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}></i>
        <input
          className="form-control-tech"
          style={{ paddingLeft: "2.4rem" }}
          placeholder="Buscar por nombre o profesión..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="tech-card">
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner-tech"></div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1rem", letterSpacing: "2px" }}>CARGANDO...</div>
          </div>
        )}
        {error && <div className="alert-tech" style={{ margin: "1rem" }}>{error}</div>}
        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table className="tech-table">
              <thead>
                <tr>
                  <th>ID</th><th>Nombre completo</th><th>Profesión</th>
                  <th>Nivel académico</th><th>Bloque</th>
                  <th>Nivel resp.</th><th>Pretensión Bs.</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      <i className="bi bi-inbox" style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}></i>
                      Sin registros
                    </td>
                  </tr>
                ) : filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="td-id">#{p.id}</td>
                    <td className="td-main">{p.nombreCompleto}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.profesion || "—"}</td>
                    <td><span className="badge-tech badge-cyan">{p.nivelAcademico?.nombre || "—"}</span></td>
                    <td>{p.bloque ? <span className="badge-tech badge-orange">{p.bloque.nombre}</span> : <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                    <td><span className="badge-tech badge-green">{p.nivelResponsabilidad?.nombre || "—"}</span></td>
                    <td style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", color: "var(--cyan)" }}>
                      {p.pretensionSalarial ? `${Number(p.pretensionSalarial).toLocaleString()}` : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="btn-tech btn-ghost-tech btn-icon" onClick={() => openModal(p)} title="Editar"><i className="bi bi-pencil"></i></button>
                        <button className="btn-tech btn-danger-tech btn-icon" onClick={() => handleDelete(p.id)} title="Eliminar"><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <div className="modal fade modal-tech" id="modalPersona" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editId ? "✎ Editar persona" : "⊕ Nueva persona"}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert-tech" style={{ marginBottom: "1rem" }}>{formError}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label-tech">Nombre completo <span style={{ color: "var(--orange)" }}>*</span></label>
                    <input className="form-control-tech" value={form.nombreCompleto} onChange={f("nombreCompleto")} placeholder="Ej. Juan Pérez López" />
                  </div>
                  <div>
                    <label className="form-label-tech">Profesión</label>
                    <input className="form-control-tech" value={form.profesion} onChange={f("profesion")} placeholder="Ej. Ingeniero de sistemas" />
                  </div>
                  <div>
                    <label className="form-label-tech">Fecha de nacimiento <span style={{ color: "var(--orange)" }}>*</span></label>
                    <input type="date" className="form-control-tech" value={form.fechaNacimiento} onChange={f("fechaNacimiento")} />
                  </div>
                  <div>
                    <label className="form-label-tech">Nivel académico <span style={{ color: "var(--orange)" }}>*</span></label>
                    <select className="form-select-tech" value={form.idNivelAcademico} onChange={f("idNivelAcademico")}>
                      <option value="">Seleccionar...</option>
                      {nivAcad.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label-tech">Nivel de responsabilidad <span style={{ color: "var(--orange)" }}>*</span></label>
                    <select className="form-select-tech" value={form.idNivelResponsabilidad} onChange={f("idNivelResponsabilidad")}>
                      <option value="">Seleccionar...</option>
                      {nivResp.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label-tech">Bloque</label>
                    <select className="form-select-tech" value={form.idBloque} onChange={f("idBloque")}>
                      <option value="">Sin bloque</option>
                      {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label-tech">Pretensión salarial (Bs.)</label>
                    <input type="number" className="form-control-tech" value={form.pretensionSalarial} onChange={f("pretensionSalarial")} placeholder="Ej. 5000" min="0" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tech btn-ghost-tech" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-tech btn-primary-tech" disabled={saving}>
                  {saving ? <span className="spinner-tech"></span> : <i className="bi bi-check-lg"></i>}
                  {editId ? "Guardar cambios" : "Crear persona"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
