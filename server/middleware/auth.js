const models = require('../models');
const parseCookies = require('./cookieParser.js');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //access parsed cookie on
  parseCookies(req, res, () => {
    if (req.cookies === undefined) {
      var session = {};
    } else {
      var session = req.cookies.shortlyid;
    }
    models.Sessions.get({ hash: session })
      .then((session) => {
        //if session doesn't exists
        if (session === undefined) {
          //create a session in the database
          models.Sessions.create()
            .then((header) => {
              return models.Sessions.getAll();
            })
            .then((result) => {
              var hashValue = result[result.length - 1].hash;
              console.log('NEW SESSION', result[result.length - 1]);
              res.cookie('shortlyid', hashValue);
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
      console.log('USER', user);
      console.log('REQ', req.session.hash, '    header', req.headers, ' cookie   ', req.cookie);
      return models.Sessions.update({hash: req.session.hash, userId: null}, { hash: req.session.hash, userId: user.id });
    })
    .then((result) => {
      console.log('result', result);
      next();
    });

};