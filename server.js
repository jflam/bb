var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var gameday = require('gameday-helper');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/scoreboard/:year/:month/:day', function(req, res) {
    var dateString = req.params.year + '-' + req.params.month + '-' + req.params.day;
    var date = new Date(dateString);
    gameday.masterScoreboard(date)
        .then(function(data) { 
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        })
        .catch(function(error) { console.log(error); });
});

app.get('/boxscore/:gid', function(req, res) {
    gameday.boxscore(req.params.gid)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.parse(data));
        })
        .catch(function(error) {console.log(error); });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
