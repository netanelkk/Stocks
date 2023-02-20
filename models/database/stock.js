const sql = require("..");

const Stock = {};

Stock.fetchMain = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *,
                 COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1,1),0) as preprice,
                 COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1),0) as price
              FROM stock S
              ORDER BY id DESC LIMIT 8`, (err, res) => {
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

Stock.fetchBySymbol = (symbol) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *,
                COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1,1),0) as preprice 
                FROM stock S
                WHERE S.symbol = ?`, [symbol], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.stockData = (stockid) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT SD.open, SD.high, SD.low, SD.close,
                COALESCE(SP.open,0) predopen, COALESCE(SP.high,0) predhigh, 
                  COALESCE(SP.low,0) predlow, COALESCE(SP.close,0) predclose, 
                SD.stockid, SD.date
		           FROM stock_data SD
		           LEFT JOIN stock_prediction SP
		           ON SD.stockid = SP.stockid AND SD.date = SP.date
		           WHERE SD.stockid = ?
		           AND datediff(CURRENT_DATE(), SD.date) < 30 
		           ORDER BY SD.date DESC`, [stockid], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

Stock.fetchSuggestion = (ignoresymbol) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *,
                 COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1,1),0) as preprice,
                 COALESCE((SELECT close FROM stock_data WHERE stockid = S.id ORDER BY date DESC LIMIT 1),0) as price
              FROM stock S
              WHERE symbol != ? ORDER BY RAND() LIMIT 4`, [ignoresymbol], (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

module.exports = Stock;

