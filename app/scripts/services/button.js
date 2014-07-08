'use strict';

angular.module('meanWhiteboardApp')
  .factory('buttonFactory', function () {

    /** Private objects and functions **/
    var buttonsMap = {},
        nextButtonId = 0,
        numberOfButtons = 0;

    var getNextButtonId = function() {
      return nextButtonId++;
    };

    var Button = function(id, name, caption, img) {
      this.name = name || ('button' + id);
      this.caption = caption || ('button' + id);
      this.img = img || '';
    };

    /** Public methods **/
    var addNewButton = function(name, caption, img) {
      
      // params
      var id = getNextButtonId();
      name = name || ('button' + id);
      caption = caption || ('button' + id);
      img = img || '';

      // create a new button and add it to the map
      var button = new Button(id, name, caption, img);
      buttonsMap[id] = button;
      numberOfButtons++;

    };

    var getButtons = function() {
      return buttonsMap;
    };

    var getNumberOfButtons = function() {
      return numberOfButtons;
    };

    addNewButton('brush');
    addNewButton('eyedropper');
    addNewButton('eraserBrush');

    // Public API here
    return {
      addNewButton: addNewButton,
      getButtons: getButtons,
      getNumberOfButtons: getNumberOfButtons
    };

  });
