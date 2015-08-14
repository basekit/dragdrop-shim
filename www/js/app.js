// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../App"
    },
    "shim": {
        "drag": ["draggabilly", "classie"],
    }
});

require(["modernizr", "jquery", "app/Editor"],function (Modernizr, $, Editor) {

	var $editorIframe = $('#editor-frame'),
		editorURL = 'frame.html';

	$(document).ready(function () {
		$editorIframe
			.attr('src', editorURL)
			.one('load', function () {
				Editor.load($editorIframe[0]);
			});	
	});
});
