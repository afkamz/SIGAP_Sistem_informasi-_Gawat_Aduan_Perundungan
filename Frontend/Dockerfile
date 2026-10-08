FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Production image ──────────────────────────────────────────────
FROM nginx:alpine

# Salin hasil build React
COPY --from=builder /app/dist /usr/share/nginx/html

# Pakai nginx.conf custom (SPA routing + proxy ke backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
