# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent --verbose
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:latest
WORKDIR /usr/share/nginx/html
# Copy build from Stage 1
COPY --from=builder /app/build /usr/share/nginx/html
# Copy config Nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]