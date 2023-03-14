var express = require('express');
var router = express.Router();
const db = require('../models/database');
const passport = require('passport');
const { check } = require('express-validator');
const { validateInput } = require('../middleware/validate-input');

router.get('/top3', function (req, res, next) {
  db.Stock.top3().then((rows) => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});


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
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    db.Stock.fetchSuggestion(ignoresymbol, userid).then((rows) => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.post('/addcomment/:stockid', [
  check('content', 'Comment is empty').not().isEmpty(),
  validateInput
], passport.authenticate('jwt', { session: false }), function (req, res = response) {
  db.Stock.addComment(req.user.id, req.body.content, req.params.stockid).then(rows => {
    res.json({ data: "OK" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.post('/addfeedback/:stockid', passport.authenticate('jwt', { session: false }), function (req, res) {
  const feedback = req.body.feedback;
  if (feedback !== 0 && feedback !== 1)
    return res.status(400).json({ msg: "Incorrect Input" });

  db.Stock.addFeedback(feedback, req.user.id, req.params.stockid).then(rows => {
    res.json({ data: "OK" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.delete('/deletecomment/:commentid', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.Stock.deleteComment(req.params.commentid, req.user.id).then(result => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});

router.get('/:symbol', function (req, res, next) {
  const { symbol } = req.params;
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    db.Stock.fetchBySymbol(symbol, userid).then(result => {
      res.json({ data: result });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});

router.get('/:stockid/graph/:range', function (req, res, next) {
  const { stockid, range } = req.params;
  if (range != 7 && range != 30 && range != 365)
    return res.status(400).json({ msg: "Wrong Range" });
  db.Stock.stockData(stockid, range).then(stockdata => {
    res.json({ data: stockdata });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });

});

router.get('/:id/comments/:page', function (req, res) {
  const { id, page } = req.params;
  db.Stock.fetchComments(id, Number(page)).then(async (rows) => {
    db.Stock.countComments(id).then(count => {
      res.json({ data: rows, count });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});


router.get('/:id/feedback', function (req, res, next) {
  const { id } = req.params;
  passport.authenticate('jwt', { session: false }, function (err, user) {
    let userid = null;
    if (!err && user) userid = user.id;
    db.Stock.feedback(id,userid).then((rows) => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  })(req, res);
});


module.exports = router;


