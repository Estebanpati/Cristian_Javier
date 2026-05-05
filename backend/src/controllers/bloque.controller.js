import pool from "../lib/db.js";

// GET /api/bloques
export async function getBloques(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT b.id, b.nombre, b.descripcion,
             COUNT(p.id)::int AS total_personas
      FROM bloque b
      LEFT JOIN persona p ON p.id_bloque = b.id
      GROUP BY b.id
      ORDER BY b.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/bloques/:id
export async function getBloqueById(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM bloque WHERE id = $1",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Bloque no encontrado" });

    const { rows: personas } = await pool.query(
      `SELECT p.id, p.nombre_completo, p.profesion,
              na.nombre AS nivel_academico,
              nr.nombre AS nivel_responsabilidad
       FROM persona p
       JOIN nivel_academico       na ON na.id = p.id_nivel_academico
       JOIN nivel_responsabilidad nr ON nr.id = p.id_nivel_responsabilidad
       WHERE p.id_bloque = $1
       ORDER BY p.id ASC`,
      [req.params.id]
    );

    res.json({ ...rows[0], personas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/bloques
export async function createBloque(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO bloque (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/bloques/:id
export async function updateBloque(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      "UPDATE bloque SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion ?? null, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Bloque no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/bloques/:id
export async function deleteBloque(req, res) {
  try {
    const { rowCount } = await pool.query("DELETE FROM bloque WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Bloque no encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
