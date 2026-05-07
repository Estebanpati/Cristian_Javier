# ── Backend — Node.js 20 Alpine ──────────────────────────────
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package.json ./
RUN npm install --omit=dev

# Copiar código fuente
COPY src/ ./src/

# Puerto expuesto
EXPOSE 3000

# Arrancar servidor
CMD ["node", "src/index.js"]
