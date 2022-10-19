const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const clucksRouter = require('./routes/clucks/clucksRouter');
const knex = require('./db/client')

const app = express();

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return 'Just Now';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use((req, res, next) => {
    const username = req.cookies.username || '';
    res.locals.username = username;
    next();
})
app.use(logger('dev'));
app.use(methodOverride((req, res) => {
    if (req.body && req.body._method) {
        return req.body._method
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    const hashtags =
    await knex('hashtags')
    .orderBy('count', 'desc')
    .returning('*');

    knex('clucks')
    .orderBy('created_at', 'desc')
    .then(clucks => {
        res.render('clucks/index', { clucks, timeDifference, hashtags })
    })
})

app.get('/sign_in', (req, res) => {
    res.render('sign_in')
})

app.post('/sign_in', (req, res) => {
    const { username } = req.body;
    res.cookie('username', username);
    res.redirect('/')
})

// add sign out button in navbar
app.post('/sign_out', (req, res) => {
    res.clearCookie('username');
    res.redirect('/')
})

app.use('/clucks', clucksRouter);

const PORT = 3000
const DOMAIN = 'localhost' //loopback address: 127.0.01

app.listen(PORT, DOMAIN, () => {
    console.log(`Server is listening on http://${DOMAIN}:${PORT}`);
})
