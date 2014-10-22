'use strict';

module.exports = function(app, mongodb) {

  // Store a picture in the db
  var uploadPicture = function(req, res) {
    var form = req.body;
    console.log(form.title, form.description, form.email, form.web);

    // TODO: Write the form in a MongoDB database

    res.json(form);
  };

  // POST requests handlers
  app.post('/uploadPicture', uploadPicture);
};
