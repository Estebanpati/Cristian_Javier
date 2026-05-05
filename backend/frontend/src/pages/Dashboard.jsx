export default function Dashboard() {
  const stats = [
    { label: "Personas registradas", value: "—", icon: "bi-people-fill",    color: "primary" },
    { label: "Bloques activos",       value: "—", icon: "bi-collection-fill", color: "success" },
    { label: "Niveles académicos",    value: "6",  icon: "bi-mortarboard-fill", color: "warning" },
    { label: "Roles disponibles",     value: "3",  icon: "bi-shield-fill",    color: "info"    },
  ];

  return (
    <>
      <h4 className="fw-bold mb-4">Dashboard</h4>

      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-sm-6 col-xl-3" key={s.label}>
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`bg-${s.color} bg-opacity-10 rounded-3 p-3`}>
                  <i className={`bi ${s.icon} fs-4 text-${s.color}`}></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header py-3">Actividad reciente</div>
        <div className="card-body text-muted text-center py-5">
          <i className="bi bi-clock-history fs-1 d-block mb-2 opacity-25"></i>
          Sin actividad registrada aún.
        </div>
      </div>
    </>
  );
}
