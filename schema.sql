-- SQLBook: Code
-- ============================================================
--  laburo_db  |  Schema relacional
-- ============================================================

-- ------------------------------------------------------------
--  Tabla de catálogo: niveles académicos
-- ------------------------------------------------------------
CREATE TABLE nivel_academico (
    id   SERIAL      PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO nivel_academico (nombre) VALUES
    ('Ninguno'),
    ('Bachiller'),
    ('Técnico Medio'),
    ('Técnico Superios'),
    ('Licenciado'),
    ('Maestría'),
    ('Doctorado');


-- ------------------------------------------------------------
--  Tabla de catálogo: niveles de responsabilidad
-- ------------------------------------------------------------
CREATE TABLE nivel_responsabilidad (
    id     SERIAL      PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

INSERT INTO nivel_responsabilidad (nombre) VALUES
    ('Ninguno'),
    ('Militante de un bloque'),
    ('Líder de bloque');


-- ------------------------------------------------------------
--  Tabla: bloques / subgrupos
-- ------------------------------------------------------------
CREATE TABLE bloque (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);


-- ------------------------------------------------------------
--  Tabla principal: personas
-- ------------------------------------------------------------
CREATE TABLE persona (
    id                      SERIAL          PRIMARY KEY,
    nombre_completo         VARCHAR(200)    NOT NULL,
    profesion               VARCHAR(150),
    id_nivel_academico      INT             NOT NULL
                                REFERENCES nivel_academico(id),
    fecha_nacimiento        DATE            NOT NULL,
    id_bloque               INT
                                REFERENCES bloque(id),
    id_nivel_responsabilidad INT            NOT NULL
                                REFERENCES nivel_responsabilidad(id),
    pretension_salarial     NUMERIC(12, 2),
    creado_en               TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices útiles para búsquedas frecuentes
CREATE INDEX idx_persona_bloque         ON persona(id_bloque);
CREATE INDEX idx_persona_responsabilidad ON persona(id_nivel_responsabilidad);
CREATE INDEX idx_persona_nivel_academico ON persona(id_nivel_academico);
