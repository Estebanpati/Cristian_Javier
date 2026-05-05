import { useEffect, useState } from "react";
import api from "../services/api";

export default function Bloques() {
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get("/bloques")
      .then((res) => setBloques(res.data))
      .catch(() => setError("No se pudo cargar los bloques."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Bloques</h4>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Nuevo bloque
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          )}

          {error && <div className="alert alert-danger m-3">{error}</div>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Miembros</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bloques.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Sin bloques registrados.
                      </td>
                    </tr>
                  ) : (
                    bloques.map((b) => (
                      <tr key={b.id}>
                        <td className="text-muted">{b.id}</td>
                        <td className="fw-semibold">{b.nombre}</td>
                        <td>{b.descripcion ?? "—"}</td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {b._count?.personas ?? 0} personas
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-1">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
