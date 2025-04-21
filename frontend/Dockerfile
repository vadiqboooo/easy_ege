FROM node:22-apline AS build

COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build 
RUN npm cache clean --force

FROM nginx:stable-alpine

COPY --from=build /dist /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]