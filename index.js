var express = require('express');

var http = require('http');

var app = express();

var fs = require('fs');

var nStore = require('nstore');



app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));


app.set("view options", { layout: false });

app.set('views', __dirname + '/');

app.use("/data", express.static(__dirname + '/data'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', function(request, response) {
    //response.send('Hello World 2!');
    response.render('index.html');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
