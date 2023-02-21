var express = require('express');
var router = express.Router();
const db = require('../models/database');


router.get('/', function (req, res, next) {
  db.Stock.fetch().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/articles', function (req, res, next) {
  db.Article.all().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/stocks', function (req, res, next) {
  db.Stock.fetch(100).then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

module.exports = router;


