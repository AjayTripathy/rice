var express = require('express');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/rice');

var patientInfo = db.collection('patientInfo');



var app =  express.createServer();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.get('/emergencyRead', function(req, res){
     var manufacturerId = req.query.manufacturerId;
     var authToken = req.query.authToken;
     if ( isValidToken(manufacturerId, authToken) ) {
        patientInfo.findById(userId , function (err, doc) {
            if (err) {
              res.send({'status' : err , data : null});
              throw err;
            }
            res.send({'status' : 'ok' , data : doc});
        });
     }
     else {
        res.send({'status' : 'permission denied' , data : null});
     }
});

app.post('/addInfo' , function(req, res){
    var userId = req.body.user; 
    var data = req.body.data;
    var password = req.body.password;
    if (isWebsiteAuthenticated(userName, password)){
      patientInfo.update({'userName' : userName}, data);
      res.send({'status' : 'ok'});
    }
    else{
      res.send({'status' : 'permission denied'});
    }
});

app.get('/getTagInfo' , function (req, res){
    var userName = req.query.userName;
    var password = req.query.password;
    var manufacturerId = req.query.manufacturerId;
    if (isWebsiteAuthenticated(userName, password)){
      patientInfo.findOne({'userName' : userName} , function(err , doc){
        if (err){
          throw err;
        }
        else{
          var token = generateAuthToken(manufacturerId);
          doc.authToken = token;
          res.send({'status' : 'ok' , 'data' : doc}); 
        }
      });
    }
    else{
      res.send({'status' : 'permission denied' , 'data' : null});
    }
});

app.get('/testGet' , function(req, res){
  console.log('hi');
  res.send({'status' : 'ok'});
})

app.post('/signup' , function(req, res){
  var data = req.body;
  patientInfo.insert(data);
});

var isValidToken = function(manufacturerId, authToken){
    return true;
}

var isWebsiteAuthenticated = function(userName, password){
  return true;
}

var generateAuthToken = function(manufacturerId){
  return 1;
}


app.listen(8080);

