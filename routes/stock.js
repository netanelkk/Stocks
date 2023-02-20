var express = require('express');
var router = express.Router();
const db = require('../models/database');


router.get('/:symbol', function (req, res, next) {
  const { symbol } = req.params;
  db.Stock.fetchBySymbol(symbol).then(result => {
    db.Stock.stockData(result[0].id).then(stockdata => {
      result[0].stockdata = stockdata;
      res.json({ data: result });
    }).catch(e => {
      console.log(e);
      return res.status(400).json({ msg: "" });
    });
  }).catch(e => {
    console.log(e);
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



module.exports = router;


