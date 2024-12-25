const express = require('express');
const router = express.Router();
const pool = require('../db');

// ดึงข้อมูลกลุ่มทั้งหมด
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// เพิ่มกลุ่มใหม่
router.post('/', async (req, res) => {
    try {
        const { name, genre, has_choreography, description } = req.body;
        const result = await pool.query(
            `INSERT INTO groups (name, genre, has_choreography, description) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, genre, has_choreography, description]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
