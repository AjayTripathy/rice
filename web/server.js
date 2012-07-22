var express = require('express');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/rice');

var patientInfo = db.collection('patientInfo');



var app =  express.createServer();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/emergencyRead', function(req, res){
     var manufacturerId = req.body.manufacturerId;
     var authToken = req.body.authToken;
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
    var userId = req.user; 
    var data = req.data;
    var password = req.password;
    if (isWebsiteAuthenticated(userId, password)){
      patientInfo.updateById(userId, data);
      res.send({'status' : 'ok'});
    }
    else{
      res.send({'status' : 'permission denied'});
    }
});

app.get('/getTagInfoForWriting' , function (req, res){
    var userName = req.userName;
    var password = req.password;
    var manufacturerId = req.manufacturerId;
    if (isWebsiteAuthenticated(userId, password)){
      patientInfo.findOne({'userName' : userName} , function(err , doc){
        if (err){
          throw err;
        }
        else{
          var token = generateAuthToken(manufacturerId);
          doc.authToken = token;
          res.send({'status' : ok , 'data' : doc}); 
        }
      });
    }
    else{
      res.send({'status' : 'permission denied' , 'data' : null});
    }
});

app.post('/finishedWriting' , function(req, res){
  var manufacturerId = req.manufacturerId;
  var authToken = req.authToken;
});

var isValidToken = function(manufacturerId, authToken){
    return true;
}

var isWebsiteAuthenticated = function(userId, password){
  return true;
}

var generateAuthToken = function(userId){
  return 1;
}


app.listen(8080);

