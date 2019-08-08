var express = require('express');
var app = express();
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();


app.use(cors())
app.options('*', cors())
app.use(express.json({  limit: '50mb'}));
app.use(express.urlencoded({  limit: '50mb'}));


let db = new sqlite3.Database(__dirname + '/data/doctima', (err) => {
  if (err) {
    console.error(err.message);
  } else {
  console.log('Connected to the database.');}
});


app.get('/', function (request, response) {
  response.sendFile(__dirname + '/client/build/index.html');
});

app.post('/update', function (request, response) {
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

app.get('/curriculum', function (request, response) {

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


var listener = app.listen(process.env.PORT || 4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});