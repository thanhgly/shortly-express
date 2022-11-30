const parseCookies = (req, res, next) => {
  //access cookies from req
  if (req.headers.cookie === undefined) {
    req.cookies = {};
  } else {
    var cookies = req.headers.cookie;
    //'shortlyid=18ea4fb6ab3178092ce936c591ddbb90c99c9f66; otherCookie=2a990382005bcc8b968f2b18f8f7ea490e990e78; anotherCookie=8a864482005bcc8b968f2b18f8f7ea490e577b20'
    cookies = cookies.split('; ');
    var newCookie = {};
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split('=');
      newCookie[cookie[0]] = cookie[1];
    }
    req.cookies = newCookie;
  }

  next();
  //parse them into an object
  //re-assign req.cookies to object
};

module.exports = parseCookies;