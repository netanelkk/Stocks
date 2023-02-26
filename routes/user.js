var express = require('express');
const jwt_decode = require('jwt-decode');
var router = express.Router();
const db = require('../models/database');
const {
  OAuth2Client,
} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const oAuth2Client = new OAuth2Client(
  "807610763496-k7j550ut1ngc77tq9mo0ehe3tv4gm2k7.apps.googleusercontent.com",
  "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",
  'postmessage',
);


router.post('/auth', function (req, res, next) {
  oAuth2Client.getToken(req.body.code).then(result => {
    let data = jwt_decode(result.tokens.id_token);
    db.User.register(data).then(rows => {
      const user = rows[0];
      const userToken = { id: user.id, googleid: user.googleid, email: user.email };
      const token = jwt.sign(userToken, 'ninja', { expiresIn: '5y' });
      res.json({ token: token });
    }).catch(e => {
      return res.status(400).json({ msg: "" });
    });
  }).catch(e => {
    console.log(e);
    return res.status(400).json({ msg: "Auth Failed!" });
  });
});



router.get('/mydetails', passport.authenticate('jwt', { session: false }), function (req, res) {
  const userId = req.user.id;
  if (userId) {
    db.User.details(userId).then(rows => {
      res.json({ data: rows });
    }).catch(e => {
      return res.status(400).json({ msg: e });
    });
  } else {
    return res.status(400).json({ msg: "AUTH_FAIL" });
  }
});

router.get('/mysaved', passport.authenticate('jwt', { session: false }), function (req, res) {
  const userId = req.user.id;
  db.Stock.mySaved(userId).then(rows => {
    res.json({ data: rows });
  }).catch(e => {
    return res.status(400).json({ msg: e });
  });
});

module.exports = router;