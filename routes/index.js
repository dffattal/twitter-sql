'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db/index')

// a reusable function
function respondWithAllTweets (req, res, next){
  // var allTheTweets = tweetBank.list();
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: allTheTweets,
  //   showForm: true
  client.query('SELECT tweets.id AS tweet_id, * FROM tweets INNER JOIN users ON users.id = tweets.user_id', function (err, result) {
    if (err) console.err(err); // pass errors to Express
    var tweets = result.rows;
    console.log(result)
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// single-user page
router.get('/users/:username', function(req, res, next){
  client.query('SELECT tweets.id AS tweet_id, * FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE name = $1', [req.params.username], function(err, result) {
    if (err) console.error(err);
    var tweets = result.rows;
    res.render('index', {title: 'Twitter.js', tweets:tweets, showForm:true})
  })
  // var tweetsForName = tweetBank.find({ name: req.params.username });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsForName,
  //   showForm: true,
  //   username: req.params.username
  // });
});

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  console.log(req.params.id)
  client.query('SELECT tweets.id AS tweet_id, * FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = $1', [req.params.id], function (err, result) {
    if (err) console.error(err);
    var tweets = result.rows;
    console.log(tweets)
    res.render('index', {title: 'Twitter.js', tweets:tweets, showForm:true})
  })
  // var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsWithThatId // an array of only one element ;-)
  // });
});

// create a new tweet
router.post('/tweets', function(req, res, next){
  tweetBank.add(req.body.name, req.body.text);
  res.redirect('/');
});

// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });

module.exports = router;
