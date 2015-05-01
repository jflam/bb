/* This express server is used to broker AJAX requests to the MLB GameDay API
 * server. The GameDay API server does not accept CORS requests, so it's not 
 * possible to directly make requests from a SPA app to the GameDay API server. 
 * This is why this broker is needed.
 *
 * TODO: in the future, do some intelligent caching using Redis or some other
 * NOSQL database to avoid having to hit the GameDay API server */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var gameday = require('gameday-helper');
var app = express();

app.set('port', (process.env.PORT || 3000));

/* Define a static route to /public, where all static resources are served. */
app.use('/', express.static(path.join(__dirname, 'public')));

/* These functions wrap the gameday-helper functions and merely serve to 
 * act as a broker between the MLB Gameday API web server and the SPA app */

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

            /* The odd thing about the gameday-helper is that it returns a
             * string here (typeof(data) === 'string') instead of a JSON object.
             * I need to parse first it before sending it to the client as JSON. */

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.parse(data));
        })
        .catch(function(error) {console.log(error); });
});

app.listen(app.get('port'), function() {
    console.log('MLB API broker server started: http://localhost:' + app.get('port') + '/');
});
