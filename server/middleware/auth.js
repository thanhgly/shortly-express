const models = require('../models');
const parseCookies = require('./cookieParser.js');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //access parsed cookie on
<<<<<<< HEAD
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
=======
  if (req.cookies === undefined) {
    req.cookies = {};
  }
>>>>>>> b0c41fdc406e7bca060936bddf7ad40be31e9b69

  var session = req.cookies.shortlyid;


  //check to see if session exissts
<<<<<<< HEAD
=======
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
>>>>>>> b0c41fdc406e7bca060936bddf7ad40be31e9b69

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

<<<<<<< HEAD
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
  })
};
=======
// example TextRow {-_-_-_-__|  /\_/\
//   id: 1,_-_-_-_-_-_-_-_-_~|_( ^ .^)
//   hash: 'ab72b4488d040d982529a9e7acd19c8392ca4ac4a1f60d5b1a654c3963e94bbb',
//   userId: 1,
//   user: TextRow { id: 1, username: 'BillZito', password: null, salt: null }
// }
>>>>>>> b0c41fdc406e7bca060936bddf7ad40be31e9b69
