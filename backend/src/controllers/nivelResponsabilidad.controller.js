import pool from "../lib/db.js";

export async function getNivelesResponsabilidad(_req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM nivel_responsabilidad ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getNivelResponsabilidadById(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM nivel_responsabilidad WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Nivel de responsabilidad no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNivelResponsabilidad(req, res) {
  const { nombre } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO nivel_responsabilidad (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateNivelResponsabilidad(req, res) {
  const { nombre } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      "UPDATE nivel_responsabilidad SET nombre = $1 WHERE id = $2 RETURNING *",
      [nombre, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Nivel de responsabilidad no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteNivelResponsabilidad(req, res) {
  try {
    const { rowCount } = await pool.query("DELETE FROM nivel_responsabilidad WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Nivel de responsabilidad no encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
