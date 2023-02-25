var express = require('express');
var router = express.Router();
const db = require('../models/database');

router.get('/', function (req, res, next) {
  db.Stock.fetch().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: e });
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
  fetch().then(result => {
    res.json({ data: result });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
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
  fetch(query).then(result => {
    res.json({ data: result });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});



const fetch = (query="",limit=100) => {
  return new Promise((resolve, reject) => {
    db.Stock.fetch(query,limit).then(result => {
      resolve(result);
    }).catch(e => {
      return reject(); 
    });
  });
}


module.exports = router;


