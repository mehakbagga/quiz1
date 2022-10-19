const express = require('express');
const router = express.Router();
const knex = require('../../db/client');

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

router.get('/new', (req, res) => {
    res.render('clucks/new')
})

router.get('/', async (req, res) => {
    const hashtags =
    await knex('hashtags')
    .orderBy('count', 'desc')
    .returning('*');
    //console.log(hashtags);
    knex('clucks')
    .orderBy('created_at', 'desc')
    .then(clucks => {
        console.log(clucks);
        res.render('clucks/index', { clucks, timeDifference, hashtags })
    })
})

router.post('/', (req, res) => {
    const { content, image_url } = req.body;
    const username = req.cookies.username;
    const hashtagRegex = /\B(\#[a-zA-Z0-9]+\b)/gm;
    const hashtagArr = content.match(hashtagRegex);
    //console.log(hashtagArr);
    if (hashtagArr) {
        hashtagArr.forEach(async (hashtag) => {
            const data = await knex('hashtags').where('name', hashtag).first().returning('*');
            //console.log(data);
            if (data) {
                await knex('hashtags')
                .where('name', hashtag)
                .increment({
                    count: 1
                })
            } else {
                await knex('hashtags')
                .insert({
                    name: hashtag,
                    count: 1
                })
            }
        }) 
    }
    
    knex('clucks')
    .insert({username, content, image_url})
    .returning('*')
    .then(() => {
        res.redirect('/clucks')
    }) 
})

module.exports = router;