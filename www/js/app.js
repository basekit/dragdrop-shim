// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,

var $editorIframe = $('#editor-frame'),
    editorURL = 'frame.html';

$(document).ready(function () {
    $editorIframe
        .attr('src', editorURL)
        .one('load', function () {
            Editor.load($editorIframe[0]);
        });
});
