/* eslint-disable */

var LinkedIn = (function($) {
  var searchUrl = '/admin/officials/politician/';
  var directoryUrl = '/directory/';

  function startLookup(editor, name) {
    this.editor = editor;
    this.name = name;

    this._nameNotFound = function(name) {
      alert('Name not found: ' + name);
    };

    this._insertLink = function(html) {
      this.editor.insertHtml(html);
    };

    this._linkify = function(text, href) {
      return '<a href="http://www.texastribune.org' + href + '">' + text + '</a>';
    };

    this._getSlugFor = function(href) {
      var self = this;

      $.get(href, function(html) {
        var resultHtml = $('<div>' + html + '</div>');
        var slug = resultHtml.find('#id_slug').val();

        self.editor.focus();

        var link = self._linkify(self.name, directoryUrl + slug + '/');
        var selectedText = self.editor
          .getSelection()
          .getSelectedText();

        self._insertLink(link);
      }, 'html');
    };

    this._parseNameSearch = function(html) {
      var result_html = $('<div>' + html + '</div>');
      var results = result_html.find('#result_list > tbody a');

      if (results.length) {
        this._getSlugFor(results[0].getAttribute('href'));
      } else {
        this._nameNotFound(this.name);
      }
    };

    this._findName = function() {
      $.get(searchUrl, { q: this.name }, this._parseNameSearch.bind(this), 'html');
    };

    this._findName();

    return this;
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
