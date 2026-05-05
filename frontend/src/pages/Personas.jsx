import { useEffect, useState } from "react";
import api from "../services/api";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    api.get("/personas")
      .then((res) => setPersonas(res.data))
      .catch(() => setError("No se pudo cargar la lista de personas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Personas</h4>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Nueva persona
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          )}

          {error && (
            <div className="alert alert-danger m-3">{error}</div>
          )}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nombre completo</th>
                    <th>Profesión</th>
                    <th>Nivel académico</th>
                    <th>Bloque</th>
                    <th>Pretensión salarial</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {personas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        Sin registros aún.
                      </td>
                    </tr>
                  ) : (
                    personas.map((p) => (
                      <tr key={p.id}>
                        <td className="text-muted">{p.id}</td>
                        <td className="fw-semibold">{p.nombreCompleto}</td>
                        <td>{p.profesion ?? "—"}</td>
                        <td>{p.nivelAcademico?.nombre ?? "—"}</td>
                        <td>{p.bloque?.nombre ?? "—"}</td>
                        <td>
                          {p.pretensionSalarial
                            ? `Bs. ${Number(p.pretensionSalarial).toLocaleString()}`
                            : "—"}
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
