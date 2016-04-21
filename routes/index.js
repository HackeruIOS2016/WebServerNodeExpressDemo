var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var pg = require('pg');

var createDb = "CREATE TABLE notes(id INT, title TEXT, note TEXT);"
createDb += "INSERT INTO notes VALUES(1, 'First Note', 'Call mom!');"
createDb += "INSERT INTO notes VALUES(2, '2nd Note', 'Eat pitot...');"
createDb += "INSERT INTO notes VALUES(3, '3rd Note', 'Watch marko!');"
createDb += "INSERT INTO notes VALUES(4, '4th Note', 'Call daddy :)!');"



router.get('/api/createdb', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(createDb, function(err, result) {
      done();
      if (err){ console.error(err); response.send("Error " + err); }
      else
       { response.render('index', {title: result} ); }
    });
  });
})



router.get('/api/addnote', function (request, response) {
	res.render('addnote');
})





router.post('/api/addnote', function (request, response) {
	var title = request.body.title;
	var note = request.body.note;
	var id = request.body.id;

	console.log(title);
	console.log(note);
	console.log(id);

	if (!title || !note ||!id) {response.end('bad request'); return}

    var ins = "INSERT INTO notes VALUES('" + id + "','" +title +"','" + note +"');" 
    console.log(ins);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query(ins, function(err, result) {
        done();
        if (err){ console.error(err); response.send("Error " + err); }
        else
         {response.json(result);}
      });
    });
})




router.get('/api/notes', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM notes', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else{ 
      		var json = {};
      		json.notes = result.rows;
      		response.json(json);
        }
    });
  });
})


module.exports = router;
