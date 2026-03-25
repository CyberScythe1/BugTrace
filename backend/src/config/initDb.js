const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function init() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../models/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Schema error:', err.message);
  } finally {
    await pool.end();
  }
}
init();
