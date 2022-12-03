const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));



app.get('/',
  (req, res) => {
    Auth.createSession(req, res, () => {
      res.render('index');
    });
<<<<<<< HEAD
=======
    // res.render('index');
>>>>>>> b0c41fdc406e7bca060936bddf7ad40be31e9b69
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.post('/signup', (req, res) => {
  //check if user exists first
  models.Users.get({ username: req.body.username })
    .then((username) => {
      if (username !== undefined) {
        res.redirect('/signup');
      } else {
        //add new user
        models.Users.create(req.body)
<<<<<<< HEAD
          .then((user) => {
            if (req.session === undefined) {
              Auth.createSession(req, res, () => {
                Auth.assignSession(req, res, () => {
                  res.redirect('/');
                });
              });
            } else {
              Auth.assignSession(req, res, () => {
                res.redirect('/');
              });
            }
=======
          .then(() => {
            //add the user into the request,
            Auth.createSession(req, res, () => {
              //assign user ID to session;
              res.redirect('/');
            });
>>>>>>> b0c41fdc406e7bca060936bddf7ad40be31e9b69
          });
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.post('/login', (req, res) => {
  //check if username exists
  //compare password
  models.Users.get({ username: req.body.username })
    .then((userData) => {
      if (userData !== undefined) {
        return models.Users.compare(req.body.password, userData.password, userData.salt);
      }
    })
    .then((isValid) => {
      if (isValid) {
        if (req.session === undefined) {
          Auth.createSession(req, res, () => {
            Auth.assignSession(req, res, () => {
              res.redirect('/');
            });
          });
        } else {
          Auth.assignSession(req, res, () => {
            res.redirect('/');
          });
        }
      } else {
        res.redirect('/login');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/logout', (req, res) => {
  Auth.deleteSession(req, res, () => {
    res.redirect('/');
  });
});
/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
