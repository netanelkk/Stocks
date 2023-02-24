const sql = require("..");

const User = {};

User.register = async (data) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO user (email,name,googleid,picture) VALUES (?,?,?,?)", 
                    [data.email,data.name,data.sub,data.picture], (err, res) => {
            User.tokenDetails(data.sub).then(result => {
                return resolve(result);
            });
        });
    });
};

User.tokenDetails = (googleid) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id,googleid,email FROM user WHERE googleid=?",[googleid], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

User.details = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM user WHERE id=?",[id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

User.authToken = (googleid, email) => {
    return new Promise((resolve,reject) => {
      sql.query(`SELECT * FROM user WHERE googleid = ? AND email = ?`, [googleid, email], (err, res) =>{
        if (err) { return reject(err);} 
        if (res.length == 0) { return reject(); }
        return resolve(res);
     });
    });
  };

  
module.exports = User;

