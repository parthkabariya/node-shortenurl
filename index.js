'use strict';
const sqllite3 = require('sqlite3').verbose();
const db = new sqllite3.Database('node-shortenurl.db');
const urlLib = require('url');
const {
  v4: uuidv4,
} = require('uuid');

/**
 * Middleware for express js.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.middleWare = function(req, res, next) {
  if (req.url.includes('sp/')) {
    getOriginalUrl(`${req.protocol}://${req.headers.host}${req.originalUrl}`)
        .then((result) => {
          console.log('result', result);
          if (result && result != '' && result != 'undefined') {
            res.redirect(result);
          } else {
            next();
          }
        }).catch((err) => {
          next();
        });
  } else {
    next();
  }
};

/**
 * Getting All Urls from Sqlite DB.
 * @return {Object} Promise
 */
module.exports.getAllUrls = () => {
  return new Promise((resolve, reject) => {
    db.all('select * from urls', [], function(err, rows) {
      if (err) {
        reject('No records founds or '+err);
      }
      resolve(rows);
    });
  });
};

/**
 * Createing New Short Url in Sqlite DB.
 * @param {String} baseurl //Base url.
 * @param {String} originalurl //Original url.
 * @return {Object} Promise
 */
module.exports.create = (baseurl, originalurl) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM urls limit 1', (err, rows) => {
      if (err) {
        db.run(`CREATE TABLE urls (
                    id BINARY(16) default (UUID_TO_BIN(UUID())),
                    shorturl text, 
                    originalurl text,
                    created_at timestamp default CURRENT_TIMESTAMP
                    )`,
        (err) => {
          if (err) {
            reject('Could not create Table: ' + err);
          } else {
            try {
              const newurl = createNew(baseurl, originalurl);
              resolve({'success': true, 'shortUrl': newurl});
            } catch (e) {
              reject('Invalid Base Url OR '+e);
            }
          }
        });
      } else {
        try {
          const newurl = createNew(baseurl, originalurl);
          resolve({'success': true, 'shortUrl': newurl});
        } catch (e) {
          reject('Invalid Base Url OR '+e);
        }
      }
    });
  });
};

/**
 * Createing New Short Url in Sqlite DB.
 * @param {String} baseurl //Base url.
 * @param {String} originalurl //Original url.
 * @return {String} newurl
 */
function createNew(baseurl, originalurl) {
  const newurl = new urlLib.URL(
      'sp/'+(new Date()).getTime().toString(36), baseurl,
  );
  const sql = 'insert into urls (id, shorturl, originalurl) values (?, ?, ?)';
  const stmt = db.prepare(sql);
  stmt.run([uuidv4(), newurl.href, originalurl]);
  stmt.finalize();
  return newurl;
}

/**
 * Getting Original Url from Sqlite DB
 * @param {String} shorturl
 * @return {Object} Promise
 */
module.exports.getOriginal = (shorturl) => {
  return getOriginalUrl(shorturl);
};

/**
 * Getting Original Url from Sqlite DB
 * @param {String} shorturl
 * @return {Object} Promise
 */
function getOriginalUrl(shorturl) {
  return new Promise((resolve, reject) => {
    const sql = 'select * from urls where shorturl = ?';
    db.get(sql, [shorturl], function(err, row) {
      if (err) {
        reject(err);
      } else {
        if (row && row.originalurl) {
          resolve(row.originalurl);
        } else {
          reject('No such url exist!');
        }
      }
    });
  });
}

/**
 * Delete Short Url from Sqlite DB
 * @param {String} shorturl
 * @return {Object} Promise
 */
module.exports.deleteByShortUrl = (shorturl) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM urls WHERE shorturl = ?`, shorturl, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({'success': true});
      }
    });
  });
};

/**
 * Delete All Short Url from Sqlite DB
 * @param {String} shorturl
 * @return {Object} Promise
 */
module.exports.deleteAllUrls = () => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM urls WHERE 1`, [], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({'success': true});
      }
    });
  });
};

