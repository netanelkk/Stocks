var express = require('express');
var router = express.Router();
const db = require('../models/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const axios = require('axios');
const fs = require('fs');

router.post('/auth', async function (req, res, next) {
  const fbtoken = req.body.code;
  try {
    const fbinfo = await axios.get(`https://graph.facebook.com/me?access_token=` + fbtoken);
    db.User.register(fbinfo.data).then(async (rows) => {
      const user = rows[0];
      const userToken = { id: user.id, facebookid: user.facebookid };
      const token = jwt.sign(userToken, 'ninja', { expiresIn: '5y' });

      const picpath = "./public/profile/"+user.facebookid+".jpg";
      if (!fs.existsSync(picpath)) {
        const picstream = fs.createWriteStream(picpath);
        const picurl = 'https://graph.facebook.com/v5.0/' + user.facebookid + '/picture?access_token=' + fbtoken + '&type=large';

        const fbpicture = await axios({method: 'GET', url: picurl, responseType: 'stream' });
        fbpicture.data.pipe(picstream);
  
        picstream.on("finish", () => {
          picstream.close();
          res.json({ token: token });
        });
      }else{
        res.json({ token: token });
      }

    }).catch(e => {
      console.log(e);
      return res.status(400).json({ msg: "" });
    });
  } catch (error) {
    return res.status(400).json({ msg: "Auth Failed!" });
  }
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

router.delete('/removesaved/:stockid', passport.authenticate('jwt', { session: false }), function (req, res) {
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

router.delete('/deleteaccount', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.User.deleteAccount(req.user.id).then(() => {
    res.status(200).send({ status: "DELETED" });
  }).catch(e => {
    return res.status(400).json({ msg: "" });
  });
});
module.exports = router;