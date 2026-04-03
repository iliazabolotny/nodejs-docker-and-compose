require('dotenv').config();

// Безопасное преобразование типов с fallback‑значениями
const PORT = parseInt(process.env.PORT, 10) || 3000;
const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT, 10) || 5432;
const DATABASE_SYNCHRONIZE = process.env.DATABASE_SYNCHRONIZE === 'true';

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/main.js',
      exec_mode: 'cluster',
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      max_memory_restart: '512M',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: PORT,
        POSTGRES_HOST: process.env.POSTGRES_HOST || 'postgres',
        POSTGRES_PORT: POSTGRES_PORT || 5432,
        POSTGRES_USER: process.env.POSTGRES_USER || 'student',
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'student',
        POSTGRES_DB: process.env.POSTGRES_DB || 'kupipodariday',
        JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
        DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
        POSTGRES_PGDATA: process.env.POSTGRES_PGDATA || '/app/postgreqsl/data',
        DATABASE_SYNCHRONIZE: DATABASE_SYNCHRONIZE || true
      }
    },
  ],
};