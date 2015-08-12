// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app"
    },
    "shim": {
        "drag": ["draggabilly", "classie"],
    }
});

require(["modernizr", "jquery", "app/editor"],function (Modernizr, $, Editor) {
	Editor.load($('#editor-frame')[0]);
});
