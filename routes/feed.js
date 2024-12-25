const express = require('express');
const router = express.Router();
const pool = require('../db');

// เส้นทางสำหรับแสดงฟีดทั้งหมด
router.get('/feed', async (req, res) => {
    try {
        // ดึงข้อมูลโพสต์ทั้งหมดจากฐานข้อมูล
        const postsResult = await pool.query(`
            SELECT posts.*, users.name AS user_name, users.profile_image 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            ORDER BY posts.created_at DESC
        `);
        const posts = postsResult.rows;

        res.render('feed', { posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// เส้นทางสำหรับค้นหาผู้ใช้งาน
router.get('/feed/search', async (req, res) => {
    try {
        const { query } = req.query; // รับคำค้นหาจาก URL
        const usersResult = await pool.query(`
            SELECT * FROM users 
            WHERE name ILIKE $1 OR email ILIKE $1
        `, [`%${query}%`]);
        const users = usersResult.rows;

        res.render('search', { users, query });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
