import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY = { nombre: "", descripcion: "" };

export default function Bloques() {
  const [bloques,   setBloques]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);
  const [detail,    setDetail]    = useState(null); // bloque seleccionado para ver miembros

  const fetchBloques = () => {
    setLoading(true);
    api.get("/bloques")
      .then((r) => setBloques(r.data))
      .catch(() => setError("No se pudo cargar los bloques."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBloques(); }, []);

  const openModal = (b = null) => {
    setFormError(null);
    if (b) { setEditId(b.id); setForm({ nombre: b.nombre, descripcion: b.descripcion || "" }); }
    else   { setEditId(null); setForm(EMPTY); }
    new window.bootstrap.Modal(document.getElementById("modalBloque")).show();
  };

  const closeModal = () =>
    window.bootstrap.Modal.getInstance(document.getElementById("modalBloque"))?.hide();

  const openDetail = (b) => {
    setDetail(null);
    api.get(`/bloques/${b.id}`).then((r) => setDetail(r.data));
    new window.bootstrap.Modal(document.getElementById("modalDetalle")).show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setFormError("El nombre es obligatorio.");
    setSaving(true); setFormError(null);
    try {
      editId ? await api.put(`/bloques/${editId}`, form) : await api.post("/bloques", form);
      closeModal(); fetchBloques();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este bloque?")) return;
    try { await api.delete(`/bloques/${id}`); fetchBloques(); }
    catch { alert("No se pudo eliminar. Puede tener personas asignadas."); }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h4 className="page-heading">Bloques</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{bloques.length} bloques registrados</p>
        </div>
        <button className="btn-tech btn-primary-tech" onClick={() => openModal()}>
          <i className="bi bi-plus-lg"></i> Nuevo bloque
        </button>
      </div>

      {/* Cards grid */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="spinner-tech"></div>
        </div>
      )}
      {error && <div className="alert-tech">{error}</div>}
      {!loading && !error && (
        <>
          {bloques.length === 0 ? (
            <div className="tech-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <i className="bi bi-collection" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}></i>
              Sin bloques registrados. Crea el primero.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {bloques.map((b) => (
                <div key={b.id} className="tech-card" style={{ padding: "1.5rem", position: "relative" }}>
                  {/* Corner accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "60px", background: "linear-gradient(180deg, var(--cyan), transparent)", borderRadius: "16px 0 0 0" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "0.4rem" }}>BLOQUE #{b.id}</div>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{b.nombre}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{b.descripcion || "Sin descripción"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.6rem", fontWeight: 900, color: "var(--cyan)", lineHeight: 1 }}>{b.total_personas ?? 0}</div>
                      <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>personas</div>
                    </div>
                  </div>
                  <div className="divider" style={{ margin: "1rem 0" }}></div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn-tech btn-ghost-tech" style={{ flex: 1, justifyContent: "center", fontSize: "0.75rem" }} onClick={() => openDetail(b)}>
                      <i className="bi bi-eye"></i> Ver
                    </button>
                    <button className="btn-tech btn-ghost-tech btn-icon" onClick={() => openModal(b)} title="Editar"><i className="bi bi-pencil"></i></button>
                    <button className="btn-tech btn-danger-tech btn-icon" onClick={() => handleDelete(b.id)} title="Eliminar"><i className="bi bi-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Crear/Editar */}
      <div className="modal fade modal-tech" id="modalBloque" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editId ? "✎ Editar bloque" : "⊕ Nuevo bloque"}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert-tech" style={{ marginBottom: "1rem" }}>{formError}</div>}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="form-label-tech">Nombre <span style={{ color: "var(--orange)" }}>*</span></label>
                  <input className="form-control-tech" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del bloque" />
                </div>
                <div>
                  <label className="form-label-tech">Descripción</label>
                  <textarea className="form-control-tech" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción opcional" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tech btn-ghost-tech" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-tech btn-primary-tech" disabled={saving}>
                  {saving ? <span className="spinner-tech"></span> : <i className="bi bi-check-lg"></i>}
                  {editId ? "Guardar cambios" : "Crear bloque"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Detalle */}
      <div className="modal fade modal-tech" id="modalDetalle" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">⬡ {detail?.nombre || "Detalle bloque"}</h5>
              <button type="button" className="btn-close" onClick={() => window.bootstrap.Modal.getInstance(document.getElementById("modalDetalle"))?.hide()}></button>
            </div>
            <div className="modal-body">
              {!detail ? (
                <div style={{ textAlign: "center", padding: "2rem" }}><div className="spinner-tech"></div></div>
              ) : (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>{detail.descripcion || "Sin descripción"}</p>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "0.75rem" }}>
                    MIEMBROS — {detail.personas?.length ?? 0} personas
                  </div>
                  {detail.personas?.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>Sin personas asignadas</div>
                  ) : (
                    <table className="tech-table">
                      <thead><tr><th>ID</th><th>Nombre</th><th>Profesión</th><th>Nivel</th></tr></thead>
                      <tbody>
                        {detail.personas.map((p) => (
                          <tr key={p.id}>
                            <td className="td-id">#{p.id}</td>
                            <td className="td-main">{p.nombre_completo}</td>
                            <td style={{ color: "var(--text-secondary)" }}>{p.profesion || "—"}</td>
                            <td><span className="badge-tech badge-green">{p.nivel_responsabilidad}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
