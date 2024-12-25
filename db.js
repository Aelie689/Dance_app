const { Pool } = require('pg');

// สร้างการเชื่อมต่อกับฐานข้อมูล
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dance_app',
    password: 'hiranyika0898731476', // ใส่รหัสผ่านของคุณ
    port: 5432,                // พอร์ตเริ่มต้นของ PostgreSQL
});

module.exports = pool;
