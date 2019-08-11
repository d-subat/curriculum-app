const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors')
const crypto = require('crypto')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const sqlite3 = require('sqlite3').verbose();
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
app.use(helmet());
app.use(passport.initialize());
app.use(cors())
app.options('*', cors())
app.use(express.json({  limit: '50mb'}));
app.use(express.urlencoded({  limit: '50mb',extended:true}));

let db = new sqlite3.Database(__dirname + '/data/doctima', (err) => {
  if (err) {
    console.error(err.message);
  } else {
  console.log('Connected to the database.');}
});


const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  store: new SQLiteStore(), //{dir:__dirname + '/data/' , db:'doctima', table:'sessions'}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  keys: ['key1', 'key2'],
  cookie: { 
            secure: false,  // => true needs https
            httpOnly: true,
            
            domain: 'localhost',
            path: '/',
            expires: expiryDate
          }
  })
);

function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new LocalStrategy(
  {
      usernameField: 'username',
      passwordField: 'password'
  },
  function(username, password, done) {
      db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
        console.log(username, password, row,
        crypto.randomBytes(Math.ceil(16/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,16) )
        if(err) {
          console.error( err.stack);
          
      }

        if (!row) return done(null, false);
        var hash = hashPassword(password, row.salt);
        console.log("---",hash)
    
        db.get('SELECT username, uuid FROM users WHERE username = ? AND userpass = ?', username, hash, function(err, row) {
          console.log("---",row)
     
          if(err) {
            console.error( err.stack);
          }
   
          if (!row) return done(null, false);
          return done(null, row);
        });
      });
    }));

passport.serializeUser(function(user, done) {
  console.log(user)
 
  return done(null, user.uuid); //this is the 'user' property saved in req.session.passport.user
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});


/*
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/client/build/index.html');
});
*/


/* API Calls */
app.post('/login', function(req, res, next) {
  console.log('/login');
  next();
}, passport.authenticate('local', {
  successRedirect : '/',
  failureRedirect : '/json/login/failure'
}));

app.post('/json/logout', function(req, res) {
  console.log('/json/logout');
  req.logout();
  return res.send(200);
});

app.post('/register', function(req, res, next) {
  
  username = req.body.username
  usermail = req.body.usermail
  salt = crypto.randomBytes(Math.ceil(16/2)).toString('hex')
  console.log(salt)

  saltedPW = hashPassword(req.body.password,salt) ;
  
  db.get('SELECT usermail FROM users WHERE usermail= ?', usermail, function(err, row) {
    if (row) {
      //user exists
      console.log("user already exists",row)
    } else {
      //no user with specified email, go create one
      console.log ("INSERT INTO users (usermail, username, userpass, salt) VALUES ('" + 
      usermail+"','"+  username+"','"+  saltedPW+"','"+ salt + "')" )
      
    }
  });
/*
    db.run("UPDATE users SET '" + column + "' = ? WHERE uuid = ?", data, 1), (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("UPDATE curriculum SET '" + column + "' = '" + data + "' LIMIT 1"); }
    };  
    */
  next();
});


app.get('/json/login/success', function(req, res) {
    console.log('/login/success');
    res.status(200).json({user: req.session.passport.user});
});

app.get('/json/login/failure', function(req, res) {
  console.log('/login/failure');
  return res.send(401);
});


app.post('/api/update', function (request, response) {
  var data = request.body.data;
  var column = request.body.column;
  db.run("UPDATE curriculum SET '" + column + "' = ? WHERE uuid = ?", data, 1), (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("UPDATE curriculum SET '" + column + "' = '" + data + "' LIMIT 1"); }
  };  
  response.status(200).send("Updated sucessfully");
});


app.get('/api/curriculum', function (request, response) {

  db.each('SELECT * FROM curriculum', function (err, row) {
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
        '} }')
    );
  });
});


app.get('/api/users', function  (request, response) {
  const params = request.usermail || "0x2012@gmail.com";
  db.all('SELECT * FROM users WHERE usermail= ? ', params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    response.json({
        "data":rows
    })
  });

});

var listener = app.listen(process.env.PORT || 4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});