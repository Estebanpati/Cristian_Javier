# laburo — Backend

API REST construida con **Node.js**, **Express** y **Prisma ORM** sobre PostgreSQL.

## Estructura del proyecto

```
backend/
├── prisma/
│   ├── schema.prisma   ← Modelos Prisma (fuente de verdad)
│   └── seed.js         ← Datos iniciales de catálogo
├── src/
│   ├── lib/
│   │   └── prisma.js   ← Cliente Prisma (singleton)
│   └── index.js        ← Entrada principal Express
├── .env.example
└── package.json
```

## Puesta en marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL
```

### 3. Generar el cliente Prisma
```bash
npm run prisma:generate
```

### 4. Ejecutar migraciones
```bash
npm run prisma:migrate
# Nombre sugerido: init
```

### 5. Sembrar datos de catálogo
```bash
npm run prisma:seed
```

### 6. Iniciar en desarrollo
```bash
npm run dev
```

El servidor quedará disponible en `http://localhost:3000`.

---

## Modelos

| Modelo               | Tabla                  | Descripción                        |
|----------------------|------------------------|------------------------------------|
| `NivelAcademico`     | `nivel_academico`      | Catálogo de niveles de estudio     |
| `NivelResponsabilidad` | `nivel_responsabilidad` | Catálogo de roles en bloques     |
| `Bloque`             | `bloque`               | Subgrupos / equipos                |
| `Persona`            | `persona`              | Registro principal de candidatos   |

## Próximos pasos

- [ ] Agregar rutas CRUD para cada modelo
- [ ] Validación de datos con `zod`
- [ ] Documentación con Swagger
