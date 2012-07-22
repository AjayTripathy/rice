var express = require('express');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/rice');

var patientInfo = db.collection('patientInfo');

var nodemailer = require('nodemailer');
var rest = require('restler');


var app =  express.createServer();

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.post('/emergencyRead', function(req, res){
     var manufacturerId = req.body.manufacturerId;
     var authToken = req.body.authToken;
     var place = req.body.place;
     //var myNumber = req.query.myNumber; 
     var myNumber = "15102322453"
     console.log(manufacturerId);
     if ( isValidToken(manufacturerId, authToken) ) {
        patientInfo.findOne({'manufacturerId' : manufacturerId} , function (err, doc) {
            if (err) {
              res.send({'status' : err , data : null});
              throw err;
            }
            res.send({'status' : 'ok' , data : doc});
            var contacts = doc.contacts;
            if (contacts){
              for (var i = 0 , ii = contacts.length ; i < ii ; i = i + 1){
                  contactInfo = contacts[i];
                  var phoneNumber = contactInfo.phoneNumber;
                  var name = contactInfo.name;
                  if (! place){
                    var message = doc.username + " has been injured. You are their emergency contact. They are being taken care of, and you will be contacted with more details as they become available";
                  }
                  else{
                    var message = doc.username + " has been injured at " + place + ".You are their emergency contact. They are being taken care of, and you will be contacted with more details.";
                  }
                  sendSms(message, phoneNumber)
              }
            }
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

app.post('/getTagInfo' , function (req, res){
    var username = req.body.username;
    var password = req.body.password;
    var manufacturerId = req.body.manufacturerId;
    console.log(1 , manufacturerId);
    if (isWebsiteAuthenticated(username, password)){
      patientInfo.findOne({'username' : username} , function(err , doc){
        if (err){
          throw err;
        }
        else{
          var token = generateAuthToken(manufacturerId);
          doc.authToken = token;
          doc.manufacturerId = manufacturerId;
          var id = doc['_id'].toString();
          patientInfo.updateById(id , doc , function (err, doc2){
            if (err){
              throw err;
            }
          });
          res.send({'status' : 'ok' , 'data' : doc}); 
        }
      });
    }
    else{
      res.send({'status' : 'permission denied' , 'data' : null});
    }
});

app.post('/testGet' , function(req, res){
  console.log('hi');
  var userName = req.body.userName;
  var password = req.body.password;
  var manufacturerId = req.body.manufacturerId;
  res.send({'status' : 'ok', 'data' : { "userName": userName , "password": password , "bloodType": "A+", "authToken" : 1 }} );
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

var sendSms = function (message, to){
  var gvmaxUrl = 'https://www.gvmax.com/api/send';
  var params = {'pin': '82af7ad1f0814408a49b35ac43e0c3a0' , 'number': to , 'text': message};
  if (to !== undefined && to !== null){
    rest.post(gvmaxUrl, {'data': params}).on('complete' , function(data){
      console.log(data)
    }); 
  }   
}

app.listen(8080);

