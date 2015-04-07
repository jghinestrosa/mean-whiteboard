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

    collection.find().count(function(err, count) {
      // Create the document id
      form._id = count + 1;

      collection.insert(form, {w:1}, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Correctly inserted ', result);
      });

      res.json(form);
    });
  };

  // Get all gallery pictures stored in the database
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

  // Get one gallery picture stored in the database
  var getGalleryPicture = function(req, res) {
    var pictureId = parseInt(req.params.id, 10);
    var collection = db.collection(collectionName);
    //collection.find({_id: pictureId}).toArray(function(err, picture) {
    collection.findOne({_id: pictureId}, function(err, picture) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(picture);
    });
  };

  /** Requests handlers **/
  app.post('/bd/uploadPicture', uploadPicture);
  app.get('/bd/galleryPictures', getGalleryPictures);
  app.get('/bd/galleryPictures/:id', getGalleryPicture);
};
