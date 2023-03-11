var express = require('express');
const jwt_decode = require('jwt-decode');
var router = express.Router();
const db = require('../models/database');
const {
  OAuth2Client,
} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const local = false;
let oAuth2Client;
if(local) {
  oAuth2Client = new OAuth2Client(
    "807610763496-k7j550ut1ngc77tq9mo0ehe3tv4gm2k7.apps.googleusercontent.com",
    "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",
    'postmessage',
  );
}else{
  oAuth2Client = new OAuth2Client(
    "1080386090306-m2d5qjqopa839bvlb7u9jhc3c0lng0qv.apps.googleusercontent.com",
    "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",
    'postmessage',
  );
}


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
    return res.status(400).json({ msg: "" });
  });
});

router.post('/reorder', passport.authenticate('jwt', { session: false }), async function (req, res) {
  const userId = req.user.id;
  try {
    const neworder = req.body.neworder.split(',');
    console.log(neworder);
    for (let i = 0; i < neworder.length; i++) {
      await db.Stock.reorder(i, parseInt(neworder[i]), userId).catch(e => { 
        console.log(e);
        //return res.status(400).json({ msg: "" });
      });
    }
    res.json({ result: "OK" });
  } catch (e) {
    return res.status(400).json({ msg: "" });
  }
});

router.delete('/removesaved/:stockid',passport.authenticate('jwt', { session: false }), function(req, res) {
  db.Stock.removeFromSaved(req.params.stockid, req.user.id).then(() => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
      return res.status(400).json({ msg: "" });
  });
});

router.post('/addsaved', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.Stock.addSaved(req.body.stockid, req.user.id).then(() => {
    res.status(200).send({ status: "OK" });
  }).catch(e => {
    console.log(e);
      return res.status(400).json({ msg: "" });
  });
});

router.delete('/deleteaccount',passport.authenticate('jwt', { session: false }), function(req, res) {
  db.User.deleteAccount(req.user.id).then(() => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
      return res.status(400).json({ msg: "" });
  });
});
module.exports = router;