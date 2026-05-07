import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const EMPTY = { nombreCompleto: "", profesion: "", idNivelAcademico: "", fechaNacimiento: "", idBloque: "", idNivelResponsabilidad: "", pretensionSalarial: "" };

export default function Personas() {
  const [personas,  setPersonas]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    api.get("/personas").then((r) => setPersonas(r.data)).catch(() => setError("No se pudo cargar.")).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPersonas();
    api.get("/niveles-academicos").then((r) => setNivAcad(r.data));
    api.get("/niveles-responsabilidad").then((r) => setNivResp(r.data));
    api.get("/bloques").then((r) => setBloques(r.data));
  }, []);

  const openNew  = () => { setEditId(null); setForm(EMPTY); setFormError(null); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      nombreCompleto:         p.nombreCompleto,
      profesion:              p.profesion || "",
      idNivelAcademico:       String(p.nivelAcademico?.id || ""),
      fechaNacimiento:        p.fechaNacimiento?.split("T")[0] || "",
      idBloque:               String(p.bloque?.id || ""),
      idNivelResponsabilidad: String(p.nivelResponsabilidad?.id || ""),
      pretensionSalarial:     p.pretensionSalarial || "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombreCompleto.trim())  return setFormError("El nombre completo es obligatorio.");
    if (!form.idNivelAcademico)       return setFormError("Selecciona el nivel académico.");
    if (!form.idNivelResponsabilidad) return setFormError("Selecciona el nivel de responsabilidad.");
    if (!form.fechaNacimiento)        return setFormError("La fecha de nacimiento es obligatoria.");
    setSaving(true); setFormError(null);
    try {
      const body = { ...form, idBloque: form.idBloque || null, pretensionSalarial: form.pretensionSalarial || null };
      editId ? await api.put(`/personas/${editId}`, body) : await api.post("/personas", body);
      setModalOpen(false); fetchPersonas();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta persona?")) return;
    try { await api.delete(`/personas/${id}`); fetchPersonas(); }
    catch { alert("No se pudo eliminar."); }
  };

  const filtered = personas.filter((p) =>
    p.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
    (p.profesion || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h4>Personas</h4>
          <p>{personas.length} registros en total</p>
        </div>
        <button className="btn-primary-clean" onClick={openNew}>
          <i className="bi bi-plus-lg"></i> Nueva persona
        </button>
      </div>

      <div className="search-wrap">
        <i className="bi bi-search"></i>
        <input
          className="search-input"
          placeholder="Buscar por nombre o profesión..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {loading && (
          <div className="empty-state">
            <div className="spinner spinner-blue" style={{ width: 28, height: 28, borderWidth: 3 }}></div>
          </div>
        )}
        {error && (
          <div className="alert-error" style={{ margin: "1rem" }}>
            <i className="bi bi-exclamation-triangle"></i>{error}
          </div>
        )}
        {!loading && !error && (
          <div className="table-scroll-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th className="th-hide-mobile">Profesión</th>
                  <th>Nivel académico</th>
                  <th className="th-hide-mobile">Bloque</th>
                  <th className="th-hide-mobile">Responsabilidad</th>
                  <th className="th-hide-mobile">Pretensión Bs.</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty-state">
                        <i className="bi bi-inbox"></i>
                        <p>Sin registros encontrados</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="td-id">#{p.id}</td>
                    <td className="td-name">{p.nombreCompleto}</td>
                    <td className="td-hide-mobile" style={{ color: "var(--text-muted)" }}>{p.profesion || "—"}</td>
                    <td><span className="badge-blue">{p.nivelAcademico?.nombre || "—"}</span></td>
                    <td className="td-hide-mobile">
                      {p.bloque
                        ? <span className="badge-orange">{p.bloque.nombre}</span>
                        : <span style={{ color: "var(--text-light)" }}>—</span>}
                    </td>
                    <td className="td-hide-mobile"><span className="badge-green">{p.nivelResponsabilidad?.nombre || "—"}</span></td>
                    <td className="td-hide-mobile" style={{ fontWeight: 700, color: "var(--primary)" }}>
                      {p.pretensionSalarial ? Number(p.pretensionSalarial).toLocaleString() : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button className="btn-icon-edit" onClick={() => openEdit(p)} title="Editar">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn-icon-del" onClick={() => handleDelete(p.id)} title="Eliminar">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Editar persona" : "Nueva persona"}
        icon={editId ? "bi-pencil" : "bi-person-plus"}
        size="lg"
        footer={
          <>
            <button className="btn-outline-clean" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary-clean" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : <i className="bi bi-check-lg"></i>}
              {editId ? "Guardar cambios" : "Crear persona"}
            </button>
          </>
        }
      >
        {formError && (
          <div className="alert-error">
            <i className="bi bi-exclamation-triangle"></i>{formError}
          </div>
        )}
        <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label-clean">Nombre completo <span style={{ color: "var(--danger)" }}>*</span></label>
            <input className="form-control-clean" value={form.nombreCompleto} onChange={handleChange("nombreCompleto")} placeholder="Ej. Juan Pérez López" />
          </div>
          <div className="form-group">
            <label className="form-label-clean">Profesión</label>
            <input className="form-control-clean" value={form.profesion} onChange={handleChange("profesion")} placeholder="Ej. Ingeniero de sistemas" />
          </div>
          <div className="form-group">
            <label className="form-label-clean">Fecha de nacimiento <span style={{ color: "var(--danger)" }}>*</span></label>
            <input type="date" className="form-control-clean" value={form.fechaNacimiento} onChange={handleChange("fechaNacimiento")} />
          </div>
          <div className="form-group">
            <label className="form-label-clean">Nivel académico <span style={{ color: "var(--danger)" }}>*</span></label>
            <select className="form-select-clean" value={form.idNivelAcademico} onChange={handleChange("idNivelAcademico")}>
              <option value="">Seleccionar...</option>
              {nivAcad.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label-clean">Nivel de responsabilidad <span style={{ color: "var(--danger)" }}>*</span></label>
            <select className="form-select-clean" value={form.idNivelResponsabilidad} onChange={handleChange("idNivelResponsabilidad")}>
              <option value="">Seleccionar...</option>
              {nivResp.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label-clean">Bloque</label>
            <select className="form-select-clean" value={form.idBloque} onChange={handleChange("idBloque")}>
              <option value="">Sin bloque</option>
              {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label-clean">Pretensión salarial (Bs.)</label>
            <input type="number" className="form-control-clean" value={form.pretensionSalarial} onChange={handleChange("pretensionSalarial")} placeholder="Ej. 5000" min="0" />
          </div>
        </div>
      </Modal>
    </>
  );
}
