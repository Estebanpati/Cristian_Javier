# Laburo — Sistema de Gestión

API REST + Frontend React desplegados con Docker.

---

## 🚀 Despliegue con Docker (recomendado)

### Requisitos
- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### Pasos

```bash
# 1. Clona o descomprime el proyecto
cd laburo/

# 2. Crea el archivo de variables de entorno
cp .env.example .env
# Edita .env si quieres cambiar la contraseña de la BD

# 3. Levanta todos los servicios
docker compose up --build -d

# 4. Verifica que todo esté corriendo
docker compose ps
```

Listo. Accede en tu navegador:

| Servicio   | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost            |
| Backend    | http://localhost:3000       |
| API health | http://localhost:3000/      |
| pgAdmin    | Conecta a localhost:5432    |

---

## 🐳 Arquitectura Docker

```
docker-compose.yml
├── db          → PostgreSQL 16 (puerto 5432)
│   └── schema.sql se ejecuta automáticamente al primer inicio
├── backend     → Node.js + Express (puerto 3000)
│   └── espera a que db esté healthy antes de iniciar
└── frontend    → React (build) servido por Nginx (puerto 80)
    └── /api/*  → proxy automático al backend
```

---

## 📋 Comandos útiles

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Reiniciar un servicio
docker compose restart backend

# Detener todo
docker compose down

# Detener y borrar la base de datos (cuidado)
docker compose down -v

# Reconstruir imágenes (tras cambios en código)
docker compose up --build -d
```

---

## 💻 Desarrollo local (sin Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
cp .env.example .env   # edita con tus credenciales de PostgreSQL
npm run dev            # http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev            # http://localhost:5173
```

---

## 🗄️ Base de datos

El archivo `schema.sql` se carga automáticamente cuando Docker
crea el contenedor de PostgreSQL por primera vez.

Para conectar con pgAdmin externamente:
- Host: `localhost`
- Puerto: `5432`
- Base de datos: `laburo_db`
- Usuario: `postgres`
- Contraseña: la definida en `.env`
