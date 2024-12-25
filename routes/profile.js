const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // โฟลเดอร์สำหรับเก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ไม่ซ้ำ
    },
});
const upload = multer({ storage });

// แสดงหน้าโปรไฟล์
router.get('/profile', async (req, res) => {
    try {
        const userId = req.session?.user_id || 1; // ใช้ user_id จาก session หรือ default = 1

        // ดึงข้อมูลผู้ใช้
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).send('User not found');
        }

        // ดึงโพสต์ของผู้ใช้
        const postsResult = await pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        const posts = postsResult.rows;

        res.render('profile', { user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// อัปโหลดโพสต์ใหม่ (รูปภาพหรือวิดีโอ)
router.post('/profile/posts', upload.single('content'), async (req, res) => {
    try {
        const userId = req.session?.user_id || 1; // ใช้ user_id จาก session หรือ default = 1
        const { caption } = req.body;
        const contentType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        const contentUrl = `/uploads/${req.file.filename}`;

        // เพิ่มข้อมูลโพสต์ลงในฐานข้อมูล
        await pool.query(
            'INSERT INTO posts (user_id, content_type, content_url, caption) VALUES ($1, $2, $3, $4)',
            [userId, contentType, contentUrl, caption]
        );

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// อัปเดตรูปภาพโปรไฟล์
router.post('/profile/upload', upload.single('profile_image'), async (req, res) => {
    try {
        const userId = req.session?.user_id || 1; // ใช้ user_id จาก session หรือ default = 1
        const profileImagePath = `/uploads/${req.file.filename}`;

        await pool.query(
            'UPDATE users SET profile_image = $1 WHERE id = $2',
            [profileImagePath, userId]
        );

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
