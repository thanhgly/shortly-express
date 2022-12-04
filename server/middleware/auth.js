const models = require('../models');
const parseCookies = require('./cookieParser.js');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //access parsed cookie on
  parseCookies(req, res, () => {
    // console.log('are you undefined', req.cookies, 'qweqw', req.session);
    // console.log('REQUEST', req);
    // if (req.cookies === undefined) {
    //   var session = {};
    // } else {
    //   var session = req.cookies.shortlyid;
    // }

    // if (req.cookies === undefined) {
    //   req.cookies = {};
    // }

    var session = req.cookies.shortlyid;

    models.Sessions.get({ hash: session })
      .then((session) => {
        //if session doesn't exists
        if (session === undefined) {
          //create a session in the database
          models.Sessions.create()
            .then((header) => {
              return models.Sessions.get({ id: header.insertId });
            })
            .then((result) => {
              req.session = result;
              res.cookie('shortlyid', req.session.hash);
              next();
            });
        } else {
          //if session does exist
          req.session = session;
          next();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });


  //check to see if session exissts

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.assignSession = (req, res, next) => {
  //assign current session to user

  models.Users.get({ username: req.body.username })
    .then((user) => {
      return models.Sessions.update({ hash: req.session.hash }, { hash: req.session.hash, userId: user.id });
    })
    .then((result) => {
      next();
    });
};

module.exports.deleteSession = (req, res, next) => {
  res.clearCookie('shortlyid');
  parseCookies(req, res, () => {
    var session = req.cookies.shortlyid;
    models.Sessions.delete({ hash: session })
      .then(() => {
        res.cookie('shortlyid', '');
        next();
      });
  });
};

module.exports.verifySession = (req, res, next) => {


  parseCookies(req, res, () => {
    var session = req.cookies.shortlyid;
    models.Sessions.get({ hash: session })
      .then((session) => {
        if (session === undefined) {
          next(false);
        } else {
          next(models.Sessions.isLoggedIn(session));
        }
      })
      .catch((err) => {
        console.log(err);
        next(false);
      });
  });
};

module.exports.parseCookies = parseCookies;

