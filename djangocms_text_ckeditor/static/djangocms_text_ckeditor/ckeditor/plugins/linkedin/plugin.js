/* eslint-disable */

var LinkedIn = (function($) {
  var searchUrl = '/api/v1/politicians/';
  var directoryUrl = '/directory/';

  function startLookup(editor, name) {
    this.editor = editor;
    this.name = name;

    this._nameNotFound = function() {
      alert('Name not found: ' + this.name);
    };

    this._insertLink = function(html) {
      this.editor.insertHtml(html);
    };

    this._linkify = function(href) {
      return '<a href="' + href + '">' + this.name + '</a>';
    };

    this._parseNameSearch = function(json) {
      if (json.count === 0 || json.count > 1) {
        this._nameNotFound();
      } else {
        var link = this._linkify(json.results[0].url);
        this._insertLink(link);
      }
    };

    this._findName = function() {
      $.getJSON(searchUrl, { search: this.name }, this._parseNameSearch.bind(this));
    };

    this._findName();
  }

  return {
    startLookup: startLookup
  };
})(django.jQuery);

CKEDITOR.plugins.add('linkedin', {
  icons: 'linkedin',

  init: function(editor) {
    editor.addCommand('getDirectoryLink', {
      exec: function(editor) {
        LinkedIn.startLookup(
          editor,
          editor.getSelection().getSelectedText()
        );
      }
    });

    editor.ui.addButton('LinkedIn', {
      label: 'Insert directory link',
      command: 'getDirectoryLink'
    });

    editor.setKeystroke(CKEDITOR.CTRL + 75 , 'getDirectoryLink');
  }
});
