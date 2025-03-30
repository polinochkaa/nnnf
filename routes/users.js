const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');


// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register
router.post('/register', async (req, res) => {
    const { email, password, password2, f, i, o, organisation, position } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: 'Не все поля заполнены' });
    }

    if (password.length < 5) {
        errors.push({ msg: 'Пароль должен содержать минимум 5 символов' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            email,
            password
        });
    } else {
        try {
            const user = await User.findOne({ email: email });
            if (user) {
                errors.push({ msg: 'Электронная почта уже зарегестрирована' });
                res.render('register', {
                    errors,
                    email,
                    password
                });
            } else {
                const username = `${f} ${i} ${o}`;
                const newUser = new User({
                    email,
                    password,
                    username,
                    organisation,
                    position
                });

                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(newUser.password, salt);
                await newUser.save();
                req.flash('success_msg', 'Регистрация успешно завершена');
                res.redirect('/users/login');
            }
        } catch (err) {
            console.log(err);
            res.render('register', {
                errors: [{ msg: 'Что-то пошло не так, попробуйте еще раз' }],
                email,
                password
            });
        }
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'Выполнен выход из аккаунта');
        res.redirect('/users/login');
    });
});

module.exports = router;
