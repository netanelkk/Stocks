const sql = require("..");

const Article = {};

Article.all = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT *
               FROM article
               ORDER BY date DESC LIMIT 6`, (err, res) => {
      if (err) { return reject(err); }
      if (res.length == 0) { return reject(); }
      return resolve(res);
    });
  });
};

module.exports = Article;

