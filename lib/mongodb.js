'use strict';

var mongodb = require('mongodb');

module.exports = function(app, mongodb) {

  var MongoClient = mongodb.MongoClient;
  var URL_CONNECTION = 'mongodb://localhost:27017/gallery';
  var collectionName = 'pictures';

  // Initialize connection once
  MongoClient.connect(URL_CONNECTION, function(err, db) {
    if(err) {
      //throw err;
      console.log(err);
      return;
    } 

    // Store a picture in the db
    var uploadPicture = function(req, res) {
      var form = req.body;
      console.log(form.title, form.description, form.email, form.web);

      // MongoDB insertion
      // TODO: Handle the picture dataURL storagement
      var collection = db.collection(collectionName);
      collection.insert(form, {w:1}, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Correctly insrted ', result);
      });

      res.json(form);
    };


    /** POST requests handlers **/
    app.post('/uploadPicture', uploadPicture);

  });
};
