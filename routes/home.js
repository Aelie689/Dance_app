const express = require('express');
const router = express.Router();
const pool = require('../db');

// เส้นทาง /home
router.get('/home', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await pool.query(
            `SELECT name, genre, has_choreography, description, created_by, choreography_clip, song, location, event_date, event_time 
             FROM groups 
             WHERE event_date = $1`,
            [today]
        );
        res.render('home', { groups: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
