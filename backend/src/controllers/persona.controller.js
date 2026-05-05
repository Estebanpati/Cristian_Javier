import pool from "../lib/db.js";

const SELECT_BASE = `
  SELECT
    p.id,
    p.nombre_completo,
    p.profesion,
    p.fecha_nacimiento,
    p.pretension_salarial,
    p.creado_en,
    na.id     AS nivel_academico_id,
    na.nombre AS nivel_academico,
    nr.id     AS nivel_responsabilidad_id,
    nr.nombre AS nivel_responsabilidad,
    b.id      AS bloque_id,
    b.nombre  AS bloque
  FROM persona p
  JOIN nivel_academico       na ON na.id = p.id_nivel_academico
  JOIN nivel_responsabilidad nr ON nr.id = p.id_nivel_responsabilidad
  LEFT JOIN bloque            b  ON b.id  = p.id_bloque
`;

function formatRow(row) {
  return {
    id:                   row.id,
    nombreCompleto:       row.nombre_completo,
    profesion:            row.profesion,
    fechaNacimiento:      row.fecha_nacimiento,
    pretensionSalarial:   row.pretension_salarial,
    creadoEn:             row.creado_en,
    nivelAcademico:       { id: row.nivel_academico_id,       nombre: row.nivel_academico },
    nivelResponsabilidad: { id: row.nivel_responsabilidad_id, nombre: row.nivel_responsabilidad },
    bloque:               row.bloque_id ? { id: row.bloque_id, nombre: row.bloque } : null,
  };
}

// GET /api/personas
export async function getPersonas(_req, res) {
  try {
    const { rows } = await pool.query(`${SELECT_BASE} ORDER BY p.id ASC`);
    res.json(rows.map(formatRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/personas/:id
export async function getPersonaById(req, res) {
  try {
    const { rows } = await pool.query(`${SELECT_BASE} WHERE p.id = $1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Persona no encontrada" });
    res.json(formatRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/personas
export async function createPersona(req, res) {
  const {
    nombreCompleto, profesion, idNivelAcademico,
    fechaNacimiento, idBloque, idNivelResponsabilidad, pretensionSalarial,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO persona
        (nombre_completo, profesion, id_nivel_academico,
         fecha_nacimiento, id_bloque, id_nivel_responsabilidad, pretension_salarial)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [nombreCompleto, profesion ?? null, idNivelAcademico,
       fechaNacimiento, idBloque ?? null, idNivelResponsabilidad, pretensionSalarial ?? null]
    );
    const { rows: full } = await pool.query(`${SELECT_BASE} WHERE p.id = $1`, [rows[0].id]);
    res.status(201).json(formatRow(full[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/personas/:id
export async function updatePersona(req, res) {
  const {
    nombreCompleto, profesion, idNivelAcademico,
    fechaNacimiento, idBloque, idNivelResponsabilidad, pretensionSalarial,
  } = req.body;
  try {
    const { rowCount } = await pool.query(
      `UPDATE persona SET
        nombre_completo          = $1,
        profesion                = $2,
        id_nivel_academico       = $3,
        fecha_nacimiento         = $4,
        id_bloque                = $5,
        id_nivel_responsabilidad = $6,
        pretension_salarial      = $7
       WHERE id = $8`,
      [nombreCompleto, profesion ?? null, idNivelAcademico,
       fechaNacimiento, idBloque ?? null, idNivelResponsabilidad,
       pretensionSalarial ?? null, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Persona no encontrada" });
    const { rows } = await pool.query(`${SELECT_BASE} WHERE p.id = $1`, [req.params.id]);
    res.json(formatRow(rows[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/personas/:id
export async function deletePersona(req, res) {
  try {
    const { rowCount } = await pool.query("DELETE FROM persona WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Persona no encontrada" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
