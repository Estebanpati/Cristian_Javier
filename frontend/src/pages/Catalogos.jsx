import { useEffect, useState } from "react";
import api from "../services/api";

function CatalogoCard({ title, endpoint, icon, accentColor }) {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [nombre,    setNombre]    = useState("");
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);
  const modalId = `modal-cat-${endpoint.replace(/\//g, "-")}`;

  const fetch = () => {
    setLoading(true);
    api.get(endpoint).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openModal = (item = null) => {
    setFormError(null);
    if (item) { setEditId(item.id); setNombre(item.nombre); }
    else      { setEditId(null);   setNombre(""); }
    new window.bootstrap.Modal(document.getElementById(modalId)).show();
  };

  const closeModal = () =>
    window.bootstrap.Modal.getInstance(document.getElementById(modalId))?.hide();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setFormError("El nombre es obligatorio.");
    setSaving(true); setFormError(null);
    try {
      editId ? await api.put(`${endpoint}/${editId}`, { nombre }) : await api.post(endpoint, { nombre });
      closeModal(); fetch();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try { await api.delete(`${endpoint}/${id}`); fetch(); }
    catch { alert("No se pudo eliminar. Puede estar en uso."); }
  };

  return (
    <>
      <div className="tech-card" style={{ height: "100%" }}>
        <div className="tech-card-header">
          <span className="header-accent" style={{ color: accentColor }}>
            <i className={`bi ${icon}`}></i> {title}
          </span>
          <button className="btn-tech btn-primary-tech" style={{ padding: "0.35rem 0.85rem", fontSize: "0.72rem" }} onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i> Agregar
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}><div className="spinner-tech"></div></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tech-table">
              <thead><tr><th>ID</th><th>Nombre</th><th></th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Sin registros</td></tr>
                ) : items.map((item) => (
                  <tr key={item.id}>
                    <td className="td-id">#{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{item.nombre}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button className="btn-tech btn-ghost-tech btn-icon" onClick={() => openModal(item)} title="Editar"><i className="bi bi-pencil"></i></button>
                        <button className="btn-tech btn-danger-tech btn-icon" onClick={() => handleDelete(item.id)} title="Eliminar"><i className="bi bi-trash"></i></button>
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
      <div className="modal fade modal-tech" id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ color: accentColor }}>{editId ? "✎ Editar" : "⊕ Nuevo"} — {title}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert-tech" style={{ marginBottom: "1rem" }}>{formError}</div>}
                <label className="form-label-tech">Nombre <span style={{ color: "var(--orange)" }}>*</span></label>
                <input className="form-control-tech" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del registro" autoFocus />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-tech btn-ghost-tech" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-tech btn-primary-tech" disabled={saving}>
                  {saving ? <span className="spinner-tech"></span> : <i className="bi bi-check-lg"></i>}
                  {editId ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Catalogos() {
  return (
    <>
      <h4 className="page-heading" style={{ marginBottom: "1.5rem" }}>Catálogos</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <CatalogoCard title="Niveles Académicos"      endpoint="/niveles-academicos"      icon="bi-mortarboard"  accentColor="var(--cyan)"   />
        <CatalogoCard title="Niveles Responsabilidad" endpoint="/niveles-responsabilidad" icon="bi-shield-check" accentColor="var(--green)"  />
      </div>
    </>
  );
}
