const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//const helpers = require('./helpers/hbs');

const app = express();


// Passport config
require('./config/passport')(passport);

// DB Config
const db = 'mongodb://127.0.0.1:27017/nnnf';

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));



// Настройка Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
   helpers: {
       "equal": function(arg1, arg2, options) {
           return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
       }
    }
});

// Handlebars Helpers
Handlebars.registerHelper("equal", function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Bodyparser Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard',require('./routes/dashboard'))



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
