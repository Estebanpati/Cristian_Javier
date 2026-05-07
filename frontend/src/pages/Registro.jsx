import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// ─── Field fuera del componente principal ────────────────────
// Si se define adentro, React lo trata como un tipo nuevo en cada
// render y desmonta/remonta el input, perdiendo el foco.
function Field({ label, error, children, required }) {
  return (
    <div className="form-group">
      <label className="form-label-clean">
        {label}
        {required && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <div className="form-error">
          <i className="bi bi-exclamation-circle"></i> {error}
        </div>
      )}
    </div>
  );
}

const EMPTY = {
  nombreCompleto: "", profesion: "", fechaNacimiento: "",
  idNivelAcademico: "", idBloque: "", idNivelResponsabilidad: "", pretensionSalarial: "",
};
const STEPS = ["Datos personales", "Académico y laboral", "Confirmar"];

export default function Registro() {
  const [step,    setStep]    = useState(0);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [nivAcad, setNivAcad] = useState([]);
  const [nivResp, setNivResp] = useState([]);
  const [bloques, setBloques] = useState([]);

  useEffect(() => {
    api.get("/niveles-academicos").then((r) => setNivAcad(r.data)).catch(() => {});
    api.get("/niveles-responsabilidad").then((r) => setNivResp(r.data)).catch(() => {});
    api.get("/bloques").then((r) => setBloques(r.data)).catch(() => {});
  }, []);

  // Handler estable: no recrea funciones en cada render
  const set = (key) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate0 = () => {
    const e = {};
    if (!form.nombreCompleto.trim()) e.nombreCompleto = "El nombre completo es obligatorio.";
    if (!form.fechaNacimiento)       e.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    return e;
  };

  const validate1 = () => {
    const e = {};
    if (!form.idNivelAcademico)       e.idNivelAcademico = "Selecciona el nivel académico.";
    if (!form.idNivelResponsabilidad) e.idNivelResponsabilidad = "Selecciona el nivel de responsabilidad.";
    return e;
  };

  const next = () => {
    const errs = step === 0 ? validate0() : step === 1 ? validate1() : {};
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep((s) => s + 1);
  };

  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/personas", {
        ...form,
        idBloque:           form.idBloque || null,
        pretensionSalarial: form.pretensionSalarial || null,
      });
      setDone(true);
    } catch {
      setErrors({ submit: "Ocurrió un error. Intenta nuevamente." });
    } finally { setSaving(false); }
  };

  const nivelAcadName = nivAcad.find((n) => String(n.id) === String(form.idNivelAcademico))?.nombre;
  const nivelRespName = nivResp.find((n) => String(n.id) === String(form.idNivelResponsabilidad))?.nombre;
  const bloqueName    = bloques.find((b) => String(b.id) === String(form.idBloque))?.nombre;

  return (
    <div className="register-page">
      <div className="register-card">

        {/* Header */}
        <div className="register-card-header">
          <div className="register-logo">💼</div>
          <h2>Registro de persona</h2>
          <p>Completa el formulario para unirte al sistema</p>
        </div>

        {!done ? (
          <>
            {/* Indicador de pasos */}
            <div className="register-steps">
              {STEPS.map((_, i) => (
                <div key={i} className="step-item">
                  <div className={`step-num ${i < step ? "done" : i === step ? "active" : ""}`}>
                    {i < step
                      ? <i className="bi bi-check-lg" style={{ fontSize: "0.7rem" }}></i>
                      : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-connector ${i < step ? "done" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="step-labels">
              {STEPS.map((label, i) => (
                <div
                  key={i}
                  className={`step-label-item ${i === step ? "active" : i < step ? "done" : ""}`}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="register-body">

              {/* ── Paso 0: Datos personales ── */}
              {step === 0 && (
                <>
                  <Field label="Nombre completo" required error={errors.nombreCompleto}>
                    <input
                      className="form-control-clean"
                      value={form.nombreCompleto}
                      onChange={set("nombreCompleto")}
                      placeholder="Ej. Juan Carlos Pérez López"
                    />
                  </Field>

                  <Field label="Profesión" error={errors.profesion}>
                    <input
                      className="form-control-clean"
                      value={form.profesion}
                      onChange={set("profesion")}
                      placeholder="Ej. Licenciado en administración"
                    />
                  </Field>

                  <Field label="Fecha de nacimiento" required error={errors.fechaNacimiento}>
                    <input
                      type="date"
                      className="form-control-clean"
                      value={form.fechaNacimiento}
                      onChange={set("fechaNacimiento")}
                    />
                  </Field>
                </>
              )}

              {/* ── Paso 1: Académico y laboral ── */}
              {step === 1 && (
                <>
                  <Field label="Nivel académico" required error={errors.idNivelAcademico}>
                    <select
                      className="form-select-clean"
                      value={form.idNivelAcademico}
                      onChange={set("idNivelAcademico")}
                    >
                      <option value="">Seleccionar...</option>
                      {nivAcad.map((n) => (
                        <option key={n.id} value={n.id}>{n.nombre}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Nivel de responsabilidad" required error={errors.idNivelResponsabilidad}>
                    <select
                      className="form-select-clean"
                      value={form.idNivelResponsabilidad}
                      onChange={set("idNivelResponsabilidad")}
                    >
                      <option value="">Seleccionar...</option>
                      {nivResp.map((n) => (
                        <option key={n.id} value={n.id}>{n.nombre}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Bloque (opcional)" error={errors.idBloque}>
                    <select
                      className="form-select-clean"
                      value={form.idBloque}
                      onChange={set("idBloque")}
                    >
                      <option value="">Sin bloque</option>
                      {bloques.map((b) => (
                        <option key={b.id} value={b.id}>{b.nombre}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Pretensión salarial en Bs. (opcional)">
                    <input
                      type="number"
                      className="form-control-clean"
                      value={form.pretensionSalarial}
                      onChange={set("pretensionSalarial")}
                      placeholder="Ej. 5000"
                      min="0"
                    />
                  </Field>
                </>
              )}

              {/* ── Paso 2: Confirmación ── */}
              {step === 2 && (
                <>
                  <div style={{
                    background: "#f8fafc", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", padding: "1rem", marginBottom: "1rem"
                  }}>
                    <div style={{
                      fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "0.75rem"
                    }}>
                      Resumen del registro
                    </div>
                    {[
                      ["Nombre completo",       form.nombreCompleto],
                      ["Profesión",             form.profesion || "—"],
                      ["Fecha de nacimiento",   form.fechaNacimiento],
                      ["Nivel académico",       nivelAcadName  || "—"],
                      ["Nivel responsabilidad", nivelRespName  || "—"],
                      ["Bloque",                bloqueName     || "Sin bloque"],
                      ["Pretensión Bs.",         form.pretensionSalarial || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="confirm-row">
                        <span className="confirm-key">{k}</span>
                        <span className="confirm-val">{v}</span>
                      </div>
                    ))}
                  </div>
                  {errors.submit && (
                    <div className="alert-error">
                      <i className="bi bi-exclamation-triangle"></i> {errors.submit}
                    </div>
                  )}
                </>
              )}

              {/* Navegación entre pasos */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                {step > 0 && (
                  <button className="btn-outline-clean" onClick={back} style={{ flex: 1, justifyContent: "center" }}>
                    <i className="bi bi-arrow-left"></i> Anterior
                  </button>
                )}
                {step < 2 ? (
                  <button className="btn-primary-clean" onClick={next} style={{ flex: 1, justifyContent: "center" }}>
                    Siguiente <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    className="btn-success-clean"
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {saving
                      ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span>
                      : <i className="bi bi-send-check"></i>}
                    Enviar registro
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ── Pantalla de éxito ── */
          <div className="register-body" style={{ textAlign: "center", paddingTop: "2rem", paddingBottom: "2rem" }}>
            <div className="success-icon"><i className="bi bi-check-lg"></i></div>
            <h5 style={{ fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>¡Registro exitoso!</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              <strong style={{ color: "var(--primary)" }}>{form.nombreCompleto}</strong> fue registrado correctamente.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn-outline-clean"
                onClick={() => { setDone(false); setStep(0); setForm(EMPTY); }}
              >
                <i className="bi bi-plus-circle"></i> Nuevo registro
              </button>
              <Link to="/" className="btn-primary-clean">
                <i className="bi bi-speedometer2"></i> Ir al dashboard
              </Link>
            </div>
          </div>
        )}

        {/*<div className="register-footer">
          ¿Eres administrador? <Link to="/">Ir al panel de gestión</Link>
        </div>*/}
      </div>
    </div>
  );
}
