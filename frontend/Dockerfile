FROM node:20-alpine AS builder
WORKDIR /app

# Копируем package.json и lock-файлы
COPY package.json package-lock.json ./

# Устанавливаем ВСЕ зависимости (включая devDependencies)
RUN npm ci  # Не используем --omit=dev!

# Копируем остальные файлы
COPY . .

# Запускаем сборку
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /dist /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/defualt.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]