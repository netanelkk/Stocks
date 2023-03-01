var express = require('express');
var router = express.Router();
const db = require('../models/database');
const passport = require('passport');

router.get('/', function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    db.Stock.fetch(userid).then((rows) => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.get('/articles', function (req, res, next) {
  db.Article.all().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/stocks', function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    fetch(userid).then(result => {
      res.json({ data: result });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.get('/categories', function (req, res, next) {
  db.Stock.allCategories().then(result => {
    res.json({ data: result });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});


router.get('/stocks/:query', function (req, res, next) {
  const { query } = req.params;
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    fetch(userid, query).then(result => {
      res.json({ data: result });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});



const fetch = (userid = null, query = "", limit = 100) => {
  return new Promise((resolve, reject) => {
    db.Stock.fetch(userid, query, limit).then(result => {
      resolve(result);
    }).catch(e => {
      return reject();
    });
  });
}


module.exports = router;


