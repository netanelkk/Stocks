const sql = require("..");

const Stock = {};
const COMMENT_PAGE_OFFSET = 15;

// Calculate price, previous price, stock difference, stock difference percentage in SELECT statement
Stock.select_calculated = `TRUNCATE((@preprice:=COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1,1),0)),2) as preprice,
                           TRUNCATE((@price:=COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1),0)),2) as price,
                           TRUNCATE(COALESCE((@diff:=@price-@preprice)),3) as stock_difference,
                           TRUNCATE(COALESCE((@price-@preprice)/@preprice*100,0),3) as stock_difference_percentage`;

Stock.fetch = (userid=null,query=null,limit=16) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT S.*,` + Stock.select_calculated + 
              ((userid) ? ", SS.userid saved " : "")
              + ` FROM stock S ` +
              ((userid) ? `LEFT JOIN saved_stocks SS
                           ON S.id = SS.stockid AND SS.userid = `+userid : "") +
              ((query) ? ` WHERE S.name LIKE ? OR S.symbol LIKE ? OR S.about LIKE ? ` : ``)
             + ` ORDER BY S.id LIMIT `+limit,['%'+query+'%','%'+query+'%','%'+query+'%'], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.allSymbols = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT id, symbol FROM stock`, (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.insertStockData = (d) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO stock_data (open,high,low,close,stockid,date) VALUES(?,?,?,?,?,?)`,
      [d.open, d.high, d.low, d.close, d.stockid, d.date], (err, res) => {
        if (err) { return resolve(err); }
        return resolve("OK");
      });
  });
};


Stock.fetchBySymbol = (symbol,userid) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT S.*,
                ` + Stock.select_calculated + `,
                COALESCE(SD.open,0) open, COALESCE(SD.close,0) close, COALESCE(SD.high,0) high, COALESCE(SD.low,0) low`+
                ((userid) ? ", SS.userid saved " : "") 
                +` FROM stock S `+
                ((userid) ? ` LEFT JOIN saved_stocks SS
                ON S.id = SS.stockid AND SS.userid = `+userid : "") +
               ` LEFT JOIN stock_data SD
               ON S.id = SD.stockid
               WHERE S.symbol = ?
               ORDER BY SD.date DESC LIMIT 1`, [symbol], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.stockData = (stockid,range) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *
               FROM ((SELECT SD.open, SD.high, SD.low, SD.close,
                        SP.prediction, SP.stockid stockid, SP.date
                      FROM stock_data SD
                      RIGHT JOIN stock_prediction SP
                      ON SD.stockid = SP.stockid AND SD.date = SP.date)
              UNION
                    (SELECT SD.open, SD.high, SD.low, SD.close,
                      SP.prediction, SD.stockid stockid, SD.date
                    FROM stock_data SD
                    LEFT JOIN stock_prediction SP
                    ON SD.stockid = SP.stockid AND SD.date = SP.date)) t
              WHERE stockid = ? AND ` +
              ((range == 365) ? `date BETWEEN (CURDATE() - INTERVAL 1 YEAR) AND CURDATE()
                                    AND date IN (
                                      SELECT MIN(date)
                                      FROM stock_data
                                      WHERE date BETWEEN (CURDATE() - INTERVAL 1 YEAR) AND CURDATE()
                                      GROUP BY YEAR(date), MONTH(date)
                                          UNION ALL
                                      SELECT MAX(date)
                                      FROM stock_data
                                      WHERE date BETWEEN (CURDATE() - INTERVAL 1 YEAR) AND CURDATE()
                                      GROUP BY YEAR(date), MONTH(date)
              )` : `datediff(CURRENT_DATE(), date) < `+ range)
              + ` ORDER BY date DESC`, [stockid], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { const empty = []; return resolve(empty); }
      return resolve(res);
    });
  });
};

Stock.fetchSuggestion = (ignoresymbol,userid=null) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT S.*,` + Stock.select_calculated +
              ((userid) ? ", SS.userid saved " : "") 
              +` FROM stock S `+
              ((userid) ? ` LEFT JOIN saved_stocks SS
              ON S.id = SS.stockid AND SS.userid = `+userid : "") +
              ` WHERE symbol != ? ORDER BY RAND() LIMIT 4`, [ignoresymbol], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.searchSuggestion = (query) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *,COALESCE((SELECT close FROM stock_data WHERE stockid = T.id ORDER BY date DESC LIMIT 1),0) as price
               FROM
                (SELECT * FROM stock WHERE name LIKE ? OR symbol LIKE ?
                UNION
                 SELECT * FROM stock WHERE about LIKE ?) t
              LIMIT 6`, ['%'+query+'%','%'+query+'%','%'+query+'%'], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.addComment = (userId, content, stockId) => {
  return new Promise((resolve,reject) => {
    sql.query(`INSERT INTO comment (userId, content, stockid) VALUES(?,?,?)`,[userId, content, stockId], (err, res) => {
      if (err) { return reject(err); } 
      return resolve();
   });
  });
}

Stock.fetchComments = (stockid, page) => {
  return new Promise((resolve,reject) => {
    sql.query(`SELECT C.id, C.content, C.date, U.name, U.id as userid
                FROM comment C
                JOIN user U
                ON C.userid = U.id
                WHERE stockid=? ORDER BY C.id DESC LIMIT ?,?`,[stockid, (page-1)*COMMENT_PAGE_OFFSET, COMMENT_PAGE_OFFSET], (err, res) => {
      if (err) { return reject(err);} 
      if (res.length == 0) { return reject(); }
      return resolve(res);
   });
  });
}

Stock.countComments = (stockid) => {
  return new Promise((resolve,reject) => {
    sql.query(`SELECT id FROM comment WHERE stockid=?`,[stockid], (err, res) => {
      if (err) { return reject(err);} 
      return resolve(res.length);
   });
  });
}

Stock.deleteComment = (commentid, userid) => {
  return new Promise((resolve,reject) => {
    sql.query(`DELETE FROM comment WHERE id=? AND userid=?`, [commentid, userid], (err, res) =>{
      if (err) { return reject(err); } 
      if(res.affectedRows == 0) { return reject("Action couldn't complete"); }
      return resolve(res);
   });
  });
}

Stock.allCategories = () => {
  return new Promise((resolve,reject) => {
    sql.query(`SELECT * FROM stock_category`, (err, res) => {
      if (err) { return reject(err);} 
      if (res.length == 0) { return reject(); }
      return resolve(res);
   });
  });
}

Stock.mySaved = (userid) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *,` + Stock.select_calculated + `, 1 as saved
                FROM saved_stocks SS
                JOIN stock S
                ON SS.stockid = S.id
                WHERE userid = ?
                ORDER BY SS.order ASC`,[userid], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.reorder = (order,stockid,userid) => {
  return new Promise((resolve, reject) => {
    sql.query(`UPDATE saved_stocks SET \`order\`=? WHERE stockid=? AND userid=?`,[order,stockid,userid], (err, res) => {
      if (err) { return reject(err); }
      return resolve("OK");
    });
  });
};

Stock.removeFromSaved = (stockid,userid) => {
  return new Promise((resolve, reject) => {
    sql.query(`DELETE FROM saved_stocks WHERE stockid = ? and userid = ?`,[stockid,userid], (err, res) => {
      if (err) { return reject(err); }
      return resolve("OK");
    });
  });
};

Stock.addSaved = (stockid,userid) => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO saved_stocks (stockid,userid) VALUES(?,?)`,[stockid,userid], (err, res) => {
      if (err) { return reject(err); }
      return resolve("OK");
    });
  });
};

module.exports = Stock;

