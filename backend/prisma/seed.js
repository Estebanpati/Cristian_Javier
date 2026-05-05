import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos de catálogo...");

  // Niveles académicos
  const nivelesAcademicos = [
    "Ninguno",
    "Bachiller",
    "Técnico",
    "Licenciado",
    "Maestría",
    "Doctorado",
  ];

  for (const nombre of nivelesAcademicos) {
    await prisma.nivelAcademico.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log("✅ NivelAcademico sembrado");

  // Niveles de responsabilidad
  const nivelesResponsabilidad = [
    "Ninguno",
    "Militante de un bloque",
    "Líder de bloque",
  ];

  for (const nombre of nivelesResponsabilidad) {
    await prisma.nivelResponsabilidad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log("✅ NivelResponsabilidad sembrado");

  console.log("🎉 Seed completado correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
