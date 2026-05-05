import { useEffect, useState } from "react";
import api from "../services/api";

function CatalogoTable({ title, endpoint, icon }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoint)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <div className="card h-100">
      <div className="card-header py-3 d-flex align-items-center gap-2">
        <i className={`bi ${icon}`}></i> {title}
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
          </div>
        ) : (
          <table className="table table-sm mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="text-muted">{item.id}</td>
                  <td>{item.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function Catalogos() {
  return (
    <>
      <h4 className="fw-bold mb-4">Catálogos</h4>
      <div className="row g-3">
        <div className="col-md-6">
          <CatalogoTable
            title="Niveles Académicos"
            endpoint="/niveles-academicos"
            icon="bi-mortarboard"
          />
        </div>
        <div className="col-md-6">
          <CatalogoTable
            title="Niveles de Responsabilidad"
            endpoint="/niveles-responsabilidad"
            icon="bi-shield-check"
          />
        </div>
      </div>
    </>
  );
}
