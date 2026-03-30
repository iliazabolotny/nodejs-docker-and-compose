FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g pm2

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]