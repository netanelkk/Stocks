const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

/*
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/netanel.vps.webdock.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/netanel.vps.webdock.cloud/fullchain.pem')
};
*/

class Server {
  constructor() {
    this.app = express();
    this.port = 4100;
    this.paths = {
      main: "/main",
      stock: "/stock",
      user: "/user"
    };

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    require('../middleware/passport');

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // delay for testing - TODO: Remove it
/*
    this.app.use(function(req,res,next){
      setTimeout(next, 1000);
    }); 
*/
  }

  // Bind controllers to routes
  routes() {
    this.app.use(this.paths.main, require("../routes/main"));
    this.app.use(this.paths.stock, require("../routes/stock"));
    this.app.use(this.paths.user, require("../routes/user"));
  }

  listen() {
    this.server = this.app.listen(this.port);
    //this.server = https.createServer(options, this.app).listen(this.port);
  }
}

module.exports = Server;
