const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Doclad = require('../models/Doclad');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) => {
    if (req.user.role === 'Админ') {
        res.redirect('/dashboard/admin');
    } else if (req.user.role === 'Руководитель секции') {
        res.redirect('/dashboard/sectionhead');
    } else if (req.user.role === 'Оргкомитет') {
        res.redirect('/dashboard/orgkomitet');
    } else {
        res.redirect('/dashboard/participant');
    }
});

router.get('/participant', async (req, res) => {
    const doclads = await Doclad.find({
        email: req.user.email,
        date:  new Date().getFullYear()
    })
    res.render('participant', {user: req.user, doclads: doclads})
});

router.get('/admin', async (req, res) => {
    const users = await User.find({
        $or: [
            { role: 'Участник' },
            { role: 'Руководитель секции' },
            { role: 'Оргкомитет' },
        ]
    })
    res.render('admin', {user: req.user, users: users})
});

router.get('/sectionhead', async (req, res) => {
    const doclads = await Doclad.find({
        section: req.user.section,
        date:  new Date().getFullYear()
    })
    res.render('sectionhead', {user: req.user, doclads: doclads})
});

router.get('/orgkomitet', async (req, res) => {
    const doclads = await Doclad.find({
        date:  new Date().getFullYear()
    })
    res.render('orgkomitet', {user: req.user, doclads: doclads})
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const currentYear = new Date().getFullYear();
        const extension = path.extname(file.originalname); // Расширение файла

        // Установка нового имени файла
        cb(null, `${currentYear} ${req.user.username} ${req.body.docladname}${extension}`);
    }
});
const upload = multer({
    storage: storage,
}).single('file');

router.post('/participant', (req, res) =>{
    upload(req, res, (err) => {
        if (err) {
            req.flash('error_msg', err);
            res.redirect('/dashboard');
        } else {
            if (!req.file) {
                req.flash('error_msg', 'No file selected!');
                res.redirect('/dashboard');
            } else {
                const newDoclad = new Doclad({
                    email: req.user.email,
                    username: req.user.username,
                    type: req.body.type,
                    section: req.body.section,
                    docladname: req.body.docladname
                });

                newDoclad.save()
                    .then(doclad => {
                        req.flash('success_msg', 'Доклад успешно загружен!');
                        res.redirect('/dashboard');
                    })
                    .catch(err => console.error(err));
            }
        }
    });
});


router.post('/admin', async (req, res) => {
    const { userId, role, section } = req.body;
    try {
        const updateData = { role };

        if (role === 'Руководитель секции' && section) {
            updateData.section = section.replace(/(\r\n|\n|\r)/gm, ""); // Добавить секцию только если роль 'section_head'
        } else {
            updateData.section = null; // Очистить поле секции, если роль не 'section_head'
        }

        await User.findByIdAndUpdate(userId, updateData);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

router.post('/sectionhead', async (req, res) => {
    const { docladId, status, section } = req.body;
    try {
        const updateData = { status };
        if (status === 'change-section'){
            updateData.status = 'На рассмотрении';
            updateData.section = section.replace(/(\r\n|\n|\r)/gm, "");
        }
        await Doclad.findByIdAndUpdate(docladId, updateData);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

router.post('/orgkomitet', async (req, res) => {
    const { docladId, type } = req.body;
    try {
        const updateData = { type };

        await Doclad.findByIdAndUpdate(docladId, updateData);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

module.exports = router;