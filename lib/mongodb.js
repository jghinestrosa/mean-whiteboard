'use strict';

var mongodb = require('mongodb');

module.exports = function(app, mongodb) {

  var MongoClient = mongodb.MongoClient;
  var URL_CONNECTION = 'mongodb://localhost:27017/gallery';
  var collectionName = 'pictures';
  var db;

  // Initialize connection once
  MongoClient.connect(URL_CONNECTION, function(err, database) {
    if(err) {
      //throw err;
      console.log(err);
      return;
    } 

    // Closure for the handlers functions
    db = database;

  });

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
      console.log('Correctly inserted ', result);
    });

    res.json(form);
  };

  var getGalleryPictures = function(req, res) {
    // MongoDB pictures query
    var collection = db.collection(collectionName);
    collection.find().toArray(function(err, pictures) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(pictures);
    });
  };

  /** Requests handlers **/
  app.post('/bd/uploadPicture', uploadPicture);
  app.get('/bd/galleryPictures', getGalleryPictures);
};
