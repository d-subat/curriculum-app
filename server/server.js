const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors')
const crypto = require('crypto')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FaceBookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
app.use(helmet());


app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

app.use(function (req, res, next) {
  if (req.headers.origin) {
    var allowedOrigins = ['http://localhost:4000','http://localhost:3000'];
    
    var origin = req.headers.origin;
    console.log(req.headers.origin,allowedOrigins.indexOf(origin))
    if(allowedOrigins.indexOf(origin) > -1){
         res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,X-PINGOTHER,Content-Type,Authorization,Access-Control-Allow-Credentials')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
    res.header('Access-Control-Allow-Credentials', 'true')
    


    if (req.method === 'OPTIONS') return res.send(200)
  }
  next()
})

let db = new sqlite3.Database(__dirname + '/data/doctima', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});


const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(session({
  name: 'session',
  store: new SQLiteStore({
    dir: __dirname + '/data/',
    db: 'doctima',
    table: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  keys: ['key1', 'key2'],
  cookie: {
    secure: false, // => true needs https
    httpOnly: true,

    domain: 'localhost',
    path: '/',
    expires: expiryDate
  }
}));

app.use(passport.initialize());
app.use(passport.session());

function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new FaceBookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      facebookId: profile.id
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_APP_ID'],
    clientSecret: process.env['GOOGLE_APP_SECRET'],
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    db.get('SELECT salt FROM users WHERE username = ?', username, function (err, row) {
      console.log(username, password, row,
        crypto.randomBytes(Math.ceil(16 / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, 16))
      if (err) {
        console.error(err.stack);

      }

      if (!row) return done(null, false);
      var hash = hashPassword(password, row.salt);
      

      db.get('SELECT username, uuid FROM users WHERE username = ? AND userpass = ?', username, hash, function (err, row) {

        console.log("---", row)
        if (err) {
          console.error(err.stack);
        }

        if (!row) return done(null, false);
        return done(null, row);
      });
    });
  }));

passport.serializeUser(function (user, done) {
  console.log("---2", user.uuid)
  return done(null, user.uuid); //this is the 'user' property saved in req.session.passport.user
});

passport.deserializeUser(function (id, done) {
  db.get('SELECT uuid, username FROM users WHERE uuid = ?', id, function (err, row) {
    console.log("---1", row)
    if (!row) return done(null, false);
    return done(null, row);
  });
});

const isAuthenticated = (req, res, next) => {
  console.log(req.session, req.isAuthenticated())
  if (req.isAuthenticated())
    return next();
  else
    return res.status(401).json({
      error: 'User not authenticated'
    })
}

/*
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/client/build/index.html');
});
*/


/* AUTH Calls */
/*
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' ,sucessRedirect: 'http://localhost:3000/'}),
  function(req, res) {
    console.log("redirecta")
    
    res.redirect('http://web.de/');
    
});
*/
  app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("called" + req.user.username)
    
    res.status(200).send('http://localhost:3000/' );
  });

app.get('/auth/loginFailure', function (req, res) {
  res.status(401).json({
    message: 'Login Failed',
    success: false
  });
});

app.get('/auth/loginSuccess', isAuthenticated, function (req, res) {
  res.status(200).json({
    message: 'Welcome!',
    user: req.session.passport.user,
    success: true
  });
})


app.get('/login/facebook',
  passport.authenticate('facebook'));

app.post('/login/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/');
  });

app.get('/login/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

app.get('/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {

    console.log("Successful authentication");
    // res.redirect('/');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://localhost:3000/');
  });


app.post('/register', function (req, res, next) {

  username = req.body.username
  usermail = req.body.usermail
  salt = crypto.randomBytes(Math.ceil(16 / 2)).toString('hex')
  console.log(salt)

  saltedPW = hashPassword(req.body.password, salt);

  db.get('SELECT usermail FROM users WHERE usermail= ?', usermail, function (err, row) {
    if (row) {
      //user exists
      console.log("user already exists", row)
    } else {
      //no user with specified email, go create one
      const sqlUser = "INSERT INTO users (usermail, username, userpass, salt) VALUES ('" +
        usermail + "','" + username + "','" + saltedPW + "','" + salt + "')"
      let newUserId = "";
      db.run(sqlUser, function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows inserted ${this.lastID}`);
        newUserId = this.lastID

        console.log(newUserId);
        const sqlUserCurriculum = `INSERT INTO curriculum 
        (userId, "Persönliche Daten","Über mich",Kompetenzen,Online,"Tätigkeiten",Weiterbildung,Studium,Schulbildung,signature,profileImage) 
        VALUES  (
        ` + newUserId + `,
        '{"name":"` + username + `","profession":"","street":"","zip":"","city":"","phone":"","mobile":"","birthplace":"","birthdate":"","marital":""}',
        '""','{"Programming":"","Tools":"","Lanugages":""}',
        '{  "Portfolio": "",  "Github": "",  "Homepage": ""}',
        '{"1":{"Company":"","Date":"","Job_Title":"","Description":""}}','{"1": {"Title": "",        "Date": ""}}',
        '{"1":{"Name":"","Subject":"","Date":""}}',
        '{"1":{"Name":"","Date":""}}',
        '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEV1xVVk0FMfKhsrAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAINSURBVGje7ZhNjsMgDIWLsmDJEXKUXGykcDSOwhGyZBHBqNNMAsH4FTJqOxLeVXxq/YMfdm+3bt3KJoNmz0UIngXGEILlv4D/CnUHgikD0w+w8L/A/YZ8AOVI1QYY3gXGie08rLyPZS9/fSx6qXbAlAvxMMsHUQxjPy+EIQ6ADmM4gACiLMSpIsDwURbinGoAMhFzBDg+T3SmRAz4FiBOJJlKmQC6AVAJYPhMk6mEwJQASwMwJ4BrAJJzqlqXAZECvh5Iq03U+wWAPAH6DYA6AeYTgfEE2A50gAP+xa3+hPb/BBm8LuYveHH+4Fm8/jTD1x8OGBC4PuTAOQpOYnDYwwCcJ+FECodeODbLGkA3zfYCrQ9RIlzjhgJ3HLglDXwQT2xqexiueVuE++bA+7jfurV9a94qrsHmvl7Z/e9uruAPCHTerduTljbkV36hffnT1nY6aRCiZ2xy/YkVxiVKQUxiPukwar/QcY9aorFtTC8E4GKxWigBi5XGUYCJtMpR6uMieCVFVB8640nAHXrqaQXUx9NUlMiCWJ7nzUzrIKAywPCzf1YtCEwZsFQCcwY4bpokNB0BIgd8HTDkQKgDJAFovlanakFgJABbBUwEsFQBMwE4vlanaiFAUICvAahaJdWCgCQBXQEoEjAVwEgCtgNvAK5XE14YeCfhtcetB5sXtj9UOSzm3bp1O+wbE5YAzXs28A8AAAAASUVORK5CYII="',
        '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEV1xVVk0FMfKhsrAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAINSURBVGje7ZhNjsMgDIWLsmDJEXKUXGykcDSOwhGyZBHBqNNMAsH4FTJqOxLeVXxq/YMfdm+3bt3KJoNmz0UIngXGEILlv4D/CnUHgikD0w+w8L/A/YZ8AOVI1QYY3gXGie08rLyPZS9/fSx6qXbAlAvxMMsHUQxjPy+EIQ6ADmM4gACiLMSpIsDwURbinGoAMhFzBDg+T3SmRAz4FiBOJJlKmQC6AVAJYPhMk6mEwJQASwMwJ4BrAJJzqlqXAZECvh5Iq03U+wWAPAH6DYA6AeYTgfEE2A50gAP+xa3+hPb/BBm8LuYveHH+4Fm8/jTD1x8OGBC4PuTAOQpOYnDYwwCcJ+FECodeODbLGkA3zfYCrQ9RIlzjhgJ3HLglDXwQT2xqexiueVuE++bA+7jfurV9a94qrsHmvl7Z/e9uruAPCHTerduTljbkV36hffnT1nY6aRCiZ2xy/YkVxiVKQUxiPukwar/QcY9aorFtTC8E4GKxWigBi5XGUYCJtMpR6uMieCVFVB8640nAHXrqaQXUx9NUlMiCWJ7nzUzrIKAywPCzf1YtCEwZsFQCcwY4bpokNB0BIgd8HTDkQKgDJAFovlanakFgJABbBUwEsFQBMwE4vlanaiFAUICvAahaJdWCgCQBXQEoEjAVwEgCtgNvAK5XE14YeCfhtcetB5sXtj9UOSzm3bp1O+wbE5YAzXs28A8AAAAASUVORK5CYII="'  )`


        db.run(sqlUserCurriculum, function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Rows inserted ${this.changes}`);
        });
      });
    }
  });



  next();
});





app.post('/api/update', isAuthenticated, function (request, response) {

  
  var data = request.body.data;
  var column = request.body.column;
  console.log("UPDATE curriculum SET '" + column + "' = '" + data + "' WHERE userId = ?", request.session.passport.user);
  db.run("UPDATE curriculum SET '" + column + "' = '" + data + "' WHERE userId = ?", data,request.session.passport.user), (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("UPDATE curriculum SET '" + column + "' = '" + data + "' LIMIT 1");
    }
  };
  response.status(200).send("Updated sucessfully");
});


app.get('/api/curriculum', isAuthenticated, function (request, response) {

console.log("new request", request.session.passport.user)
  db.get('SELECT * FROM curriculum WHERE userId = ?', request.session.passport.user, function (err, row) {
    if (row) {

      response.send(JSON.parse('{' +
        '"signature": ' + row.signature +
        ', "profileImage": ' + row.profileImage +
        ', "data": {' +
        '"Persönliche Daten":' + row["Persönliche Daten"] +
        ',"Über mich": ' + row["Über mich"] +
        ',"Kompetenzen": ' + row["Kompetenzen"] +
        ',"Online": ' + row["Online"] +
        ',"Tätigkeiten": ' + row["Tätigkeiten"] +
        ',"Weiterbildung": ' + row["Weiterbildung"] +
        ',"Studium": ' + row["Studium"] +
        ',"Schulbildung": ' + row["Schulbildung"] +
        '} }'));
    }
    /*
    else {
      //send empty json, if user exists, but has no data
      const personal = '{"name":"","profession":"","street":"","zip":"","city":"","phone":"","mobile":"","birthplace":"","birthdate":"","marital":"ledig"}';
      const about=  '""';
      const skills = '{"Programming":"","Tools":"","Lanugages":""}';
      const online ='{  "Portfolio": "",  "Github": "",  "Homepage": ""}';
      const employment = '{"1":{"Company":"","Date":"","Job_Title":"","Description":""}}';
      const training= '{"1": {"Title": "",        "Date": ""}}';
      const studies = '{"1":{"Name":"","Subject":"","Date":""}}';
      const education = '{"1":{"Name":"","Date":""}}';
      const profileImage = '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEV1xVVk0FMfKhsrAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAINSURBVGje7ZhNjsMgDIWLsmDJEXKUXGykcDSOwhGyZBHBqNNMAsH4FTJqOxLeVXxq/YMfdm+3bt3KJoNmz0UIngXGEILlv4D/CnUHgikD0w+w8L/A/YZ8AOVI1QYY3gXGie08rLyPZS9/fSx6qXbAlAvxMMsHUQxjPy+EIQ6ADmM4gACiLMSpIsDwURbinGoAMhFzBDg+T3SmRAz4FiBOJJlKmQC6AVAJYPhMk6mEwJQASwMwJ4BrAJJzqlqXAZECvh5Iq03U+wWAPAH6DYA6AeYTgfEE2A50gAP+xa3+hPb/BBm8LuYveHH+4Fm8/jTD1x8OGBC4PuTAOQpOYnDYwwCcJ+FECodeODbLGkA3zfYCrQ9RIlzjhgJ3HLglDXwQT2xqexiueVuE++bA+7jfurV9a94qrsHmvl7Z/e9uruAPCHTerduTljbkV36hffnT1nY6aRCiZ2xy/YkVxiVKQUxiPukwar/QcY9aorFtTC8E4GKxWigBi5XGUYCJtMpR6uMieCVFVB8640nAHXrqaQXUx9NUlMiCWJ7nzUzrIKAywPCzf1YtCEwZsFQCcwY4bpokNB0BIgd8HTDkQKgDJAFovlanakFgJABbBUwEsFQBMwE4vlanaiFAUICvAahaJdWCgCQBXQEoEjAVwEgCtgNvAK5XE14YeCfhtcetB5sXtj9UOSzm3bp1O+wbE5YAzXs28A8AAAAASUVORK5CYII="';
      const signature = '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEV1xVVk0FMfKhsrAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAINSURBVGje7ZhNjsMgDIWLsmDJEXKUXGykcDSOwhGyZBHBqNNMAsH4FTJqOxLeVXxq/YMfdm+3bt3KJoNmz0UIngXGEILlv4D/CnUHgikD0w+w8L/A/YZ8AOVI1QYY3gXGie08rLyPZS9/fSx6qXbAlAvxMMsHUQxjPy+EIQ6ADmM4gACiLMSpIsDwURbinGoAMhFzBDg+T3SmRAz4FiBOJJlKmQC6AVAJYPhMk6mEwJQASwMwJ4BrAJJzqlqXAZECvh5Iq03U+wWAPAH6DYA6AeYTgfEE2A50gAP+xa3+hPb/BBm8LuYveHH+4Fm8/jTD1x8OGBC4PuTAOQpOYnDYwwCcJ+FECodeODbLGkA3zfYCrQ9RIlzjhgJ3HLglDXwQT2xqexiueVuE++bA+7jfurV9a94qrsHmvl7Z/e9uruAPCHTerduTljbkV36hffnT1nY6aRCiZ2xy/YkVxiVKQUxiPukwar/QcY9aorFtTC8E4GKxWigBi5XGUYCJtMpR6uMieCVFVB8640nAHXrqaQXUx9NUlMiCWJ7nzUzrIKAywPCzf1YtCEwZsFQCcwY4bpokNB0BIgd8HTDkQKgDJAFovlanakFgJABbBUwEsFQBMwE4vlanaiFAUICvAahaJdWCgCQBXQEoEjAVwEgCtgNvAK5XE14YeCfhtcetB5sXtj9UOSzm3bp1O+wbE5YAzXs28A8AAAAASUVORK5CYII="'  ;
      
          response.send(JSON.parse('{' +
          '"signature": ' +  signature +
          ', "profileImage": ' +  profileImage +
          ', "data": {' +
          '"Persönliche Daten":' + personal+
          ',"Über mich": ' + about +
          ',"Kompetenzen": ' + skills +
          ',"Online": ' + online +
          ',"Tätigkeiten": ' + employment +
          ',"Weiterbildung": ' + training +
          ',"Studium": ' + studies +
          ',"Schulbildung": ' + education +
          '} }')
      );
    }
    */


  });
});


app.get('/api/users', isAuthenticated, function (request, response) {
  const params = request.usermail || "0x2012@gmail.com";
  db.all('SELECT * FROM users WHERE usermail= ? ', params, (err, rows) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return;
    }
    response.json({
      "data": rows
    })
  });

});

var listener = app.listen(process.env.PORT || 4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});