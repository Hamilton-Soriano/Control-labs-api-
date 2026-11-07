import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  ...(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
      host: process.env.PGHOST ?? 'localhost',
      port: Number(process.env.PGPORT ?? 5432),
      database: process.env.PGDATABASE ?? 'controllabs',
      user: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD
    }),
  connectionTimeoutMillis: 5000
};

export const database = new Pool(poolConfig);

database.on('error', (error: Error) => {
  console.error('Error inesperado en una conexión inactiva de PostgreSQL:', error);
});
