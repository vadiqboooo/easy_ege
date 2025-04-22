# Используем BuildKit (обязательно!)
# syntax=docker/dockerfile:1.4

# === Этап 1: Установка зависимостей с кэшированием ===
FROM node:22-alpine AS deps
WORKDIR /app

# Копируем только файлы зависимостей для кэширования
COPY package.json package-lock.json* ./
RUN npm ci #--omit=dev  # Только production-зависимости

# === Этап 2: Сборка приложения ===
FROM node:22-alpine AS builder
WORKDIR /app

# Копируем кэш зависимостей из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Запускаем сборку (Vite уже очень быстрый)
RUN npm run build

# Nginx часть
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
