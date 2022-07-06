const express = require('express');
const router = express.Router();
const knex = require('../db/client');

router.get('/new', (req, res) => {
  res.render('pages/new');
});

router.post('/', (req, res) => {
  let imgURL = "assets/img/placeholder.png"
  if (req.body.imgURL) {
    imgURL = req.body.imgURL;
  }

  knex
    .insert({
      content: req.body.content,
      img_url: imgURL,
      username: req.cookies.username
    })
    .into('clucks')
    .returning('*')
    .then(([cluck]) => {
      res.redirect('/clucks');
    });
});

router.get('/', (req, res) => {

  knex
    .select('*')
    .from('clucks')
    .orderBy('createdAt', 'desc')
    .then(clucks => {

      const newClucks = clucks;
      for (let cluck of newClucks) {
        cluck.easyCreatedAt = dateParser(dateConverter(cluck.createdAt));
      }
      
    });
})

function dateParser(date) {
  let dateString = "";
  if (date.minute === 0) {
    return "Just now";
  }
  for (let key in date) {

    if (date[key] != 0) {
      if (date[key] > 1) {
        dateString += (date[key] + " " + key + 's')
      } else {
        dateString += (date[key] + " " + key)
      }
      dateString += " ";
    }
  }
  return dateString + " ago";
}


function dateConverter(date_created) {

  const seconds = (Date.now() - date_created) / 1000;
  const totalMinutes = seconds / 60;
  const minute = totalMinutes % 60;
  const totalHours = totalMinutes / 60;
  const hour = totalHours % 24;
  const totalDays =totalHours / 24;
  const day = totalDays % 7;
  const totalWeeks = totalDays / 7;
  const week = totalWeeks % 5;
  const month = week / 5;

  return {month, week, day, hour, minute };
}


module.exports = router;