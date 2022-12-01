const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //access parsed cookie on
  if (req.cookies === {} ) {
    var session = undefined;
  } else {
    var session = req.cookies.shortlyid;
  }


  //check to see if session exissts
  models.Sessions.get({hash: session})
    .then((session) => {
      //if session doesn't exists
      if (session === undefined) {
        //create a session in the database
        models.Sessions.create()
          .then(() => {
            return models.Sessions.getAll();
          })
          .then((result) => {
            var hashValue = result[result.length - 1].hash;
            req.session = {hash: hashValue };
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

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

