import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

function CatalogoCard({ title, endpoint, icon, accentColor }) {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre,    setNombre]    = useState("");
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchItems = () => {
    setLoading(true);
    api.get(endpoint).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew  = () => { setEditId(null); setNombre(""); setFormError(null); setModalOpen(true); };
  const openEdit = (item) => { setEditId(item.id); setNombre(item.nombre); setFormError(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setFormError("El nombre es obligatorio.");
    setSaving(true); setFormError(null);
    try {
      editId
        ? await api.put(`${endpoint}/${editId}`, { nombre })
        : await api.post(endpoint, { nombre });
      setModalOpen(false); fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try { await api.delete(`${endpoint}/${id}`); fetchItems(); }
    catch { alert("No se puede eliminar: está en uso."); }
  };

  return (
    <>
      <div className="card" style={{ height: "100%" }}>
        <div className="card-header-clean">
          <h6 style={{ color: accentColor }}>
            <i className={`bi ${icon}`}></i> {title}
          </h6>
          <button
            className="btn-primary-clean"
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
            onClick={openNew}
          >
            <i className="bi bi-plus-lg"></i> Agregar
          </button>
        </div>

        {loading ? (
          <div className="empty-state" style={{ padding: "2rem" }}>
            <div className="spinner spinner-blue" style={{ width: 22, height: 22, borderWidth: 3 }}></div>
          </div>
        ) : (
          <div className="table-scroll-wrap">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="empty-state" style={{ padding: "1.5rem" }}>
                        <i className="bi bi-inbox"></i><p>Sin registros</p>
                      </div>
                    </td>
                  </tr>
                ) : items.map((item) => (
                  <tr key={item.id}>
                    <td className="td-id">#{item.id}</td>
                    <td style={{ fontWeight: 600 }}>{item.nombre}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button className="btn-icon-edit" onClick={() => openEdit(item)} title="Editar">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn-icon-del" onClick={() => handleDelete(item.id)} title="Eliminar">
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
        title={`${editId ? "Editar" : "Nuevo"} — ${title}`}
        icon={icon}
        size="sm"
        footer={
          <>
            <button className="btn-outline-clean" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary-clean" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span> : <i className="bi bi-check-lg"></i>}
              {editId ? "Guardar" : "Crear"}
            </button>
          </>
        }
      >
        {formError && (
          <div className="alert-error"><i className="bi bi-exclamation-triangle"></i>{formError}</div>
        )}
        <div className="form-group">
          <label className="form-label-clean">
            Nombre <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            className="form-control-clean"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del registro"
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}

export default function Catalogos() {
  return (
    <>
      <div className="page-header">
        <div>
          <h4>Catálogos</h4>
          <p>Gestión de niveles académicos y de responsabilidad</p>
        </div>
      </div>
      <div
        className="catalogos-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
      >
        <CatalogoCard
          title="Niveles Académicos"
          endpoint="/niveles-academicos"
          icon="bi-mortarboard"
          accentColor="var(--primary)"
        />
        <CatalogoCard
          title="Niveles Responsabilidad"
          endpoint="/niveles-responsabilidad"
          icon="bi-shield-check"
          accentColor="var(--success)"
        />
      </div>
    </>
  );
}
