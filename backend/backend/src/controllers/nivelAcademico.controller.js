import pool from "../lib/db.js";

export async function getNivelesAcademicos(_req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM nivel_academico ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getNivelAcademicoById(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM nivel_academico WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Nivel académico no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNivelAcademico(req, res) {
  const { nombre } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO nivel_academico (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateNivelAcademico(req, res) {
  const { nombre } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      "UPDATE nivel_academico SET nombre = $1 WHERE id = $2 RETURNING *",
      [nombre, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Nivel académico no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteNivelAcademico(req, res) {
  try {
    const { rowCount } = await pool.query("DELETE FROM nivel_academico WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Nivel académico no encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
