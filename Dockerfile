# syntax=docker/dockerfile:1

# ---------- Stage 1: сборка приложения ----------
FROM node:22-alpine AS build

WORKDIR /app

# Сначала копируем только манифесты — слой с зависимостями кешируется
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники и собираем production-бандл
COPY . .
RUN npm run build

# ---------- Stage 2: раздача статики через nginx ----------
FROM nginx:1.27-alpine AS runtime

# Конфиг nginx с поддержкой SPA-роутинга
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Статика из этапа сборки
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
