# ── Etapa 1: Build React con Vite ────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Etapa 2: Servir con Nginx ─────────────────────────────────
FROM nginx:1.25-alpine

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx (proxy al backend + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
