import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || "laburo_db",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "Deadpool1243",
});

pool.on("connect", () => console.log("✅ Conectado a PostgreSQL"));
pool.on("error",   (err) => console.error("❌ Error en pool pg:", err));

export default pool;
