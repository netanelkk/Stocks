var express = require('express');
var router = express.Router();
const db = require('../models/database');

router.get('/suggestion/:query', function (req, res, next) {
  const { query } = req.params;
  db.Stock.searchSuggestion(query).then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});


router.get('/suggestions/:ignoresymbol', function (req, res, next) {
  const { ignoresymbol } = req.params;
  db.Stock.fetchSuggestion(ignoresymbol).then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/:symbol', function (req, res, next) {
  const { symbol } = req.params;
  db.Stock.fetchBySymbol(symbol).then(result => {
    res.json({ data: result });
  }).catch(e => {
    console.log(e);
    return res.status(400).json({ msg: "" });
  });
});

router.get('/:stockid/graph/:range', function (req, res, next) {
  const { stockid, range } = req.params;
  if (range != 7 && range != 30 && range != 365)
    return res.status(400).json({ msg: "Wrong Range" });

  db.Stock.stockData(stockid, range).then(stockdata => {
    res.json({ data: stockdata });
  }).catch(e => {
    console.log(e);
    return res.status(400).json({ msg: "" });
  });

});



module.exports = router;


