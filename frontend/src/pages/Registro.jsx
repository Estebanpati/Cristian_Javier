import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const STEPS = ["Datos personales", "Académico & laboral", "Confirmar"];

const EMPTY = {
  nombreCompleto: "", profesion: "", fechaNacimiento: "",
  idNivelAcademico: "", idBloque: "", idNivelResponsabilidad: "", pretensionSalarial: "",
};

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

  const f = (key) => (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); };

  const validateStep0 = () => {
    const e = {};
    if (!form.nombreCompleto.trim()) e.nombreCompleto = "Requerido";
    if (!form.fechaNacimiento)       e.fechaNacimiento = "Requerida";
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.idNivelAcademico)       e.idNivelAcademico = "Requerido";
    if (!form.idNivelResponsabilidad) e.idNivelResponsabilidad = "Requerido";
    return e;
  };

  const next = () => {
    const errs = step === 0 ? validateStep0() : step === 1 ? validateStep1() : {};
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(step + 1);
  };

  const back = () => { setErrors({}); setStep(step - 1); };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/personas", {
        ...form,
        idBloque:           form.idBloque           || null,
        pretensionSalarial: form.pretensionSalarial  || null,
      });
      setDone(true);
    } catch {
      setErrors({ submit: "Ocurrió un error al enviar. Intenta nuevamente." });
    } finally { setSaving(false); }
  };

  const Field = ({ label, error, children }) => (
    <div style={{ marginBottom: "1.1rem" }}>
      <label className="form-label-tech">{label}</label>
      {children}
      {error && <div style={{ color: "#ff6b6b", fontSize: "0.73rem", marginTop: "0.3rem" }}>⚠ {error}</div>}
    </div>
  );

  const nivelAcadName = nivAcad.find((n) => String(n.id) === String(form.idNivelAcademico))?.nombre;
  const nivelRespName = nivResp.find((n) => String(n.id) === String(form.idNivelResponsabilidad))?.nombre;
  const bloqueName    = bloques.find((b) => String(b.id) === String(form.idBloque))?.nombre;

  return (
    <div className="register-page">
      <div className="register-glow"></div>

      <div className="register-card">
        {/* Top line */}
        <div className="register-header">
          <div className="register-logo">⚡</div>
          <div className="register-title">LABURO</div>
          <div className="register-subtitle">Formulario de registro de persona</div>
        </div>

        {!done ? (
          <>
            {/* Steps */}
            <div style={{ padding: "1.5rem 2.5rem 0" }}>
              <div className="step-indicator">
                {STEPS.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`} title={label}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`}></div>}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-secondary)", fontFamily: "'Orbitron', monospace", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                {STEPS[step]}
              </div>
            </div>

            <div className="register-body">
              {/* STEP 0: Datos personales */}
              {step === 0 && (
                <>
                  <Field label="Nombre completo *" error={errors.nombreCompleto}>
                    <input className="form-control-tech" value={form.nombreCompleto} onChange={f("nombreCompleto")} placeholder="Ej. Juan Carlos Pérez López" />
                  </Field>
                  <Field label="Profesión" error={errors.profesion}>
                    <input className="form-control-tech" value={form.profesion} onChange={f("profesion")} placeholder="Ej. Licenciado en administración" />
                  </Field>
                  <Field label="Fecha de nacimiento *" error={errors.fechaNacimiento}>
                    <input type="date" className="form-control-tech" value={form.fechaNacimiento} onChange={f("fechaNacimiento")} />
                  </Field>
                </>
              )}

              {/* STEP 1: Académico & laboral */}
              {step === 1 && (
                <>
                  <Field label="Nivel académico *" error={errors.idNivelAcademico}>
                    <select className="form-select-tech" value={form.idNivelAcademico} onChange={f("idNivelAcademico")}>
                      <option value="">Seleccionar...</option>
                      {nivAcad.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                  </Field>
                  <Field label="Nivel de responsabilidad *" error={errors.idNivelResponsabilidad}>
                    <select className="form-select-tech" value={form.idNivelResponsabilidad} onChange={f("idNivelResponsabilidad")}>
                      <option value="">Seleccionar...</option>
                      {nivResp.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                  </Field>
                  <Field label="Bloque (opcional)" error={errors.idBloque}>
                    <select className="form-select-tech" value={form.idBloque} onChange={f("idBloque")}>
                      <option value="">Sin bloque</option>
                      {bloques.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                    </select>
                  </Field>
                  <Field label="Pretensión salarial en Bs. (opcional)" error={errors.pretensionSalarial}>
                    <input type="number" className="form-control-tech" value={form.pretensionSalarial} onChange={f("pretensionSalarial")} placeholder="Ej. 5000" min="0" />
                  </Field>
                </>
              )}

              {/* STEP 2: Confirm */}
              {step === 2 && (
                <>
                  <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "10px", border: "1px solid var(--border)", padding: "1.25rem", marginBottom: "1rem" }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "1rem" }}>RESUMEN DEL REGISTRO</div>
                    {[
                      ["Nombre completo",  form.nombreCompleto],
                      ["Profesión",        form.profesion || "—"],
                      ["Fecha nacimiento", form.fechaNacimiento],
                      ["Nivel académico",  nivelAcadName  || "—"],
                      ["Nivel resp.",      nivelRespName  || "—"],
                      ["Bloque",           bloqueName     || "Sin bloque"],
                      ["Pretensión Bs.",   form.pretensionSalarial || "—"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{k}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "60%", textAlign: "right" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {errors.submit && <div className="alert-tech" style={{ marginBottom: "1rem" }}>{errors.submit}</div>}
                </>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", gap: "0.75rem" }}>
                {step > 0 ? (
                  <button className="btn-tech btn-ghost-tech" onClick={back} style={{ flex: 1 }}>
                    <i className="bi bi-arrow-left"></i> Anterior
                  </button>
                ) : <div style={{ flex: 1 }}></div>}

                {step < 2 ? (
                  <button className="btn-tech btn-primary-tech" onClick={next} style={{ flex: 1, justifyContent: "center" }}>
                    Siguiente <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button className="btn-tech btn-success-tech" onClick={handleSubmit} disabled={saving} style={{ flex: 1, justifyContent: "center" }}>
                    {saving ? <span className="spinner-tech"></span> : <i className="bi bi-send-check"></i>}
                    Enviar registro
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* SUCCESS */
          <div className="register-body">
            <div className="success-panel">
              <div className="success-icon"><i className="bi bi-check-lg"></i></div>
              <h5 style={{ fontFamily: "'Orbitron', monospace", color: "var(--green)", letterSpacing: "2px", marginBottom: "0.75rem" }}>¡REGISTRO EXITOSO!</h5>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "2rem" }}>
                Tu información fue enviada correctamente.<br />
                <span style={{ color: "var(--cyan)" }}>{form.nombreCompleto}</span> ya está en el sistema.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-tech btn-ghost-tech" onClick={() => { setDone(false); setStep(0); setForm(EMPTY); }}>
                  <i className="bi bi-plus-circle"></i> Nuevo registro
                </button>
                <Link to="/" className="btn-tech btn-primary-tech">
                  <i className="bi bi-speedometer2"></i> Ir al Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="register-footer">
          ¿Eres administrador? <Link to="/">Ir al panel de gestión</Link>
        </div>
      </div>
    </div>
  );
}
