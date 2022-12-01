const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //access parsed cookie on
  if (req.cookies === undefined) {
    req.cookies = {};
  }

  var session = req.cookies.shortlyid;


  //check to see if session exissts
  models.Sessions.get({hash: session})
    .then((session) => {
      //if session doesn't exists
      if (session === undefined) {
        //create a session in the database
        //pass in options to asssign the user id
        var username = req.body.username;
        models.Users.get({username: username})
          .then((result) => {
            if (result === undefined) {
              return model.Sessions.create();
            } else {
              return model.Sesssions.create(result.id);
            }
          })
          .then(() => {
            return models.Sessions.getAll();
          })
          .then((result) => {
            var newSession = result[result.length - 1];
            console.log(newSession);
            req.session = newSession;
            res.cookie('shortlyid', newSession.hash);
            // if (req.body === undefined) {
            //   return {id: null};
            // } else {
            //   var username = req.body.username;
            //   return models.Users.get({username: username});
            // }
            next();
          });
          // .then((result) => {
          //   console.log('RESULT FROM USERNAME QUERY', result);
          //   if (result === undefined) {
          //     next();
          //   } else {
          //     req.session.userId = result.id;
          //     next();
          //   }
          // });
      } else {
        //if session does exist
        req.session = session;
        // console.log('example', req.session);
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

// example TextRow {-_-_-_-__|  /\_/\
//   id: 1,_-_-_-_-_-_-_-_-_~|_( ^ .^)
//   hash: 'ab72b4488d040d982529a9e7acd19c8392ca4ac4a1f60d5b1a654c3963e94bbb',
//   userId: 1,
//   user: TextRow { id: 1, username: 'BillZito', password: null, salt: null }
// }