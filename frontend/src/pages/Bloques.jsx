import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const EMPTY = { nombre: "", descripcion: "" };

export default function Bloques() {
  const [bloques,    setBloques]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState(null);
  const [detail,     setDetail]     = useState(null);

  const fetchBloques = () => {
    setLoading(true);
    api.get("/bloques").then((r) => setBloques(r.data)).catch(() => setError("No se pudo cargar.")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBloques(); }, []);

  const openNew  = () => { setEditId(null); setForm(EMPTY); setFormError(null); setModalOpen(true); };
  const openEdit = (b) => { setEditId(b.id); setForm({ nombre: b.nombre, descripcion: b.descripcion || "" }); setFormError(null); setModalOpen(true); };
  const openDetail = (b) => {
    setDetail(null); setDetailOpen(true);
    api.get(`/bloques/${b.id}`).then((r) => setDetail(r.data));
  };

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setFormError("El nombre es obligatorio.");
    setSaving(true); setFormError(null);
    try {
      editId ? await api.put(`/bloques/${editId}`, form) : await api.post("/bloques", form);
      setModalOpen(false); fetchBloques();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este bloque?")) return;
    try { await api.delete(`/bloques/${id}`); fetchBloques(); }
    catch { alert("No se puede eliminar: tiene personas asignadas."); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h4>Bloques</h4>
          <p>{bloques.length} bloques registrados</p>
        </div>
        <button className="btn-primary-clean" onClick={openNew}>
          <i className="bi bi-plus-lg"></i> Nuevo bloque
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="spinner spinner-blue" style={{ width: 28, height: 28, borderWidth: 3 }}></div>
        </div>
      )}
      {error && <div className="alert-error"><i className="bi bi-exclamation-triangle"></i>{error}</div>}

      {!loading && !error && (
        bloques.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <i className="bi bi-collection"></i>
              <p>Sin bloques registrados. Crea el primero.</p>
            </div>
          </div>
        ) : (
          <div
            className="bloques-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}
          >
            {bloques.map((b) => (
              <div key={b.id} className="bloque-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>
                      Bloque #{b.id}
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)" }}>{b.nombre}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{b.total_personas ?? 0}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-light)", fontWeight: 600 }}>personas</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {b.descripcion || "Sin descripción"}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-outline-clean"
                    style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "0.4rem 0.75rem" }}
                    onClick={() => openDetail(b)}
                  >
                    <i className="bi bi-eye"></i> Ver miembros
                  </button>
                  <button className="btn-icon-edit" onClick={() => openEdit(b)} title="Editar"><i className="bi bi-pencil"></i></button>
                  <button className="btn-icon-del"  onClick={() => handleDelete(b.id)} title="Eliminar"><i className="bi bi-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal Crear/Editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Editar bloque" : "Nuevo bloque"}
        icon={editId ? "bi-pencil" : "bi-collection"}
        footer={
          <>
            <button className="btn-outline-clean" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary-clean" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : <i className="bi bi-check-lg"></i>}
              {editId ? "Guardar cambios" : "Crear bloque"}
            </button>
          </>
        }
      >
        {formError && <div className="alert-error"><i className="bi bi-exclamation-triangle"></i>{formError}</div>}
        <div className="form-group">
          <label className="form-label-clean">Nombre <span style={{ color: "var(--danger)" }}>*</span></label>
          <input className="form-control-clean" value={form.nombre} onChange={handleChange("nombre")} placeholder="Nombre del bloque" />
        </div>
        <div className="form-group">
          <label className="form-label-clean">Descripción</label>
          <textarea className="form-control-clean" rows={3} value={form.descripcion} onChange={handleChange("descripcion")} placeholder="Descripción opcional" />
        </div>
      </Modal>

      {/* Modal Detalle */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={detail?.nombre || "Detalle del bloque"}
        icon="bi-collection"
        size="lg"
      >
        {!detail ? (
          <div className="empty-state">
            <div className="spinner spinner-blue" style={{ width: 24, height: 24, borderWidth: 3 }}></div>
          </div>
        ) : (
          <>
            {detail.descripcion && (
              <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
                {detail.descripcion}
              </p>
            )}
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Miembros — {detail.personas?.length ?? 0} personas
            </div>
            {!detail.personas?.length ? (
              <div className="empty-state" style={{ padding: "1.5rem" }}>
                <i className="bi bi-people"></i><p>Sin personas asignadas</p>
              </div>
            ) : (
              <div className="table-scroll-wrap">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th className="th-hide-mobile">Profesión</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.personas.map((p) => (
                      <tr key={p.id}>
                        <td className="td-id">#{p.id}</td>
                        <td className="td-name">{p.nombre_completo}</td>
                        <td className="td-hide-mobile" style={{ color: "var(--text-muted)" }}>{p.profesion || "—"}</td>
                        <td><span className="badge-green">{p.nivel_responsabilidad}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
