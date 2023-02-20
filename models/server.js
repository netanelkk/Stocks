const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

class Server {
  constructor() {
    this.app = express();
    this.port = 5000;
    this.paths = {
      main: "/main",
      stock: "/stock"
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
      setTimeout(next, 500);
    });
    */
  }

  // Bind controllers to routes
  routes() {
    this.app.use(this.paths.main, require("../routes/main"));
    this.app.use(this.paths.stock, require("../routes/stock"));
  }

  listen() {
    this.server = this.app.listen(this.port);
  }
}

module.exports = Server;
