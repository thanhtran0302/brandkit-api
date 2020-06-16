import { Pool } from 'pg';

export const pool = new Pool({
  user: 'thanhtran',
  host: 'localhost',
  database: 'brandtoolkit',
  port: 5432
});
