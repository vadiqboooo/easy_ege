# Node.js часть
FROM node:24-alpine as builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx часть
FROM nginx:stable-alpine

COPY --from=builder /dist /usr/share/nginx/html
COPY --from=builder nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
