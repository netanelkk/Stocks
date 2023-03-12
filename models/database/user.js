const sql = require("..");

const User = {};

User.register = async (data) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO user (name,facebookid,picture) VALUES (?,?,?)",
            [data.name, data.id, data.id+".jpg"], (err, res) => {
                User.tokenDetails(data.id).then(result => {
                    return resolve(result);
                });
            });
    });
};

User.tokenDetails = (facebookid) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id,facebookid FROM user WHERE facebookid=?", [facebookid], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

User.details = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id,name,picture,registerdate FROM user WHERE id=?", [id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

User.authToken = (facebookid, id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM user WHERE facebookid = ? AND id = ?`, [facebookid, id], (err, res) => {
            if (err) { return reject(err); }
            if (res.length == 0) { return reject(); }
            return resolve(res);
        });
    });
};

User.deleteAccount = (userid) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM user WHERE id=?", [userid], (err, res) => {
            if (err) { return reject(err); }
            return resolve();
        });
    });
}

module.exports = User;

