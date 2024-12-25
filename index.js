const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const app = express();

// ตั้งค่า session middleware
app.use(session({
    secret: 'secret_key', // ใช้ key ที่ปลอดภัย
    resave: false,
    saveUninitialized: true,
}));

// ตั้งค่าที่จัดเก็บไฟล์สำหรับอัปโหลด
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // โฟลเดอร์สำหรับเก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // ชื่อไฟล์ไม่ซ้ำ
    },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ดึง routes
const homeRoutes = require('./routes/home');
const profileRoutes = require('./routes/profile');
const feedRoutes = require('./routes/feed');

// ตั้งค่า View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// จำลอง user login สำหรับ session
app.use((req, res, next) => {
    req.session.user_id = 1; // จำลอง user ID = 1
    next();
});

// เส้นทางเริ่มต้น
app.get('/', (req, res) => {
    res.render('index', { title: 'Dance App' });
});

// ใช้ routes อื่น ๆ
app.use(homeRoutes);
app.use(profileRoutes);
app.use(feedRoutes);

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    const open = await import('open');
    open.default(`http://localhost:${PORT}`);
});
