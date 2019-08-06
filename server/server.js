var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();


app.use(cors())
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

console.log(__dirname + '/data/doctima');
let db = new sqlite3.Database(__dirname + '/data/doctima', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/client/public/index.html');
});

app.post('/update', function(request, response) {
  var data=request.body.data;
  var column=request.body.column;
  db.run("UPDATE curriculum SET " + column + " = ? WHERE uuid = ?", data, 1), (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  };

  console.log("UPDATE curriculum SET " + column + " = '"+data + "' LIMIT 1");
  response.status(200).send("Updated sucessfully");
});

app.get('/curriculum', function(request, response) {
  
  db.each('SELECT * FROM curriculum', function(err, row) {
    response.send( JSON.parse('{' +
    '"signature": ' + row.signature + 
    ', "profileImage": ' + row.profileImage  +
    ', "data": {' +
    '"Personal_Data":' + row.Personal_Data +
    ',"About_Me": ' + row.About_Me +
    ',"Skills": ' + row.Skills +
    ',"Online": ' + row.Online +
    ',"Employment": ' + row.Employment +
    ',"Training": ' + row.Training +
    ',"Studies": ' + row.Studies +
    ',"Education": ' + row.Education + 
    '} }' )
    /*
    ,"signature": ' + row.signature + 
    ', "profileImage": ' + row.profileImage 
    */
    );
  });
});

 
var listener = app.listen(process.env.PORT || 4000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

