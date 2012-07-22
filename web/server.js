var express = require('express');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/rice');

var patientInfo = db.collection('patientInfo');



var app =  express.createServer();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/auth', function(req, res){
     var userId = req.body.user;
     var authToken = req.body.authToken;
     if ( isValid(userId, authToken) ) {
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

app.get('/getTagInfo' , function (req, res){
    var userName = req.userName;
    var password = req.password;
    if (isWebsiteAuthenticated(userId, password)){
      patientInfo.findOne({'userName' : userName} , function(err , doc){
        if (err){
          throw err;
        }
        else{
          var token = generateAuthToken;
          res.send({'status' : ok , 'data' : doc}); 
        }
      });
    }
    else{
      res.send({'status' : 'permission denied' , 'data' : null});
    }
});



var isValid = function(userId, authToken){
    return true;
}

var isWebsiteAuthenticated = function(userId, password){
  return true;
}

var generateAuthToken = function(userId){
  return 1;
}


app.listen(8080);

