/**
 * Keyboard
 * Adds keyboard access to common tasks. Use '?' to get a list of shortcuts.
 */

(function() {
  
  var SHORTCUTS = {
    common: {
      '_title': 'Common Shortcuts',
      '?': {title: 'Show this help dialog', fn: showHelp},
      'H': {title: 'Go to the home page', fn: goHome},
      '/': {title: 'Focus the search box', fn: focusSearch},
      'ESC': {title: 'Blur active element / dismiss dialog'}
    },
    photo: {
      '_title': 'Photo Page',
      '.': {title: 'Go to the next photo', fn: goNext},
      ',': {title: 'Go to the previous photo', fn: goPrevious},
      'U': {title: 'Go up to the photostream/pool/set', fn: goUp},
      'S': {title: 'Star (Add to favorites)', fn: star},
      'X': {title: 'Toggle EXIF preview', fn: exif.toggle},
      'L': {title: 'Open photo in Lightbox', fn: lightbox.open}
    }
  };
  
  
  function showHelp() {
    var div = createEl('div');
    div.className = 'xxxDialog';
    div.tabIndex = '0';
    document.body.appendChild(div);
    div.addEventListener('blur', function(e) {
      document.body.removeChild(div);
    });
    div.focus();
    
    var bg = createEl('div');
    bg.className = 'xxxDialogBg';
    div.appendChild(bg);
    
    var content = createEl('div');
    content.className = 'xxxDialogContent';
    div.appendChild(content);
    
    var title = createEl('div');
    title.className = 'xxxTitle';
    title.appendChild(createText('Keyboard Shortcut Help'));
    content.appendChild(title);
    
    var closeInfo = createEl('div');
    closeInfo.className = 'xxxClose';
    closeInfo.appendChild(createText('ESC to close'));
    title.appendChild(closeInfo);
    
    for (var section in SHORTCUTS) {
      var el = createEl('div');
      el.className = 'xxxSection';
      var header = createEl('div');
      header.className = 'xxxHeader';
      header.appendChild(createText(SHORTCUTS[section]._title));
      el.appendChild(header);
      for (var key in SHORTCUTS[section]) {
        if (key.substr(0, 1) == '_') continue;
        var line = createEl('div');
        line.className = 'xxxKey';
        var bold = createEl('b');
        bold.appendChild(createText(key));
        line.appendChild(bold);
        line.appendChild(createText(' : '));
        line.appendChild(createText(SHORTCUTS[section][key].title));
        el.appendChild(line);
      }
      content.appendChild(el);
    }
  }
  
  function focusSearch(e) {
    getEl('header_search_q').focus();
    window.scrollTop = 0;
    e.preventDefault();
  }

  function getNavControls() {
    var els = query('.nextprev_contextThumbsDiv');
    for (var i = 0; i < els.length; i++) {
      var idPrefix = 'nextprev_div_' + page.getContext();
      if (els[i].id.indexOf(idPrefix) != -1) {
        return els[i].getElementsByTagName('a');
      }
    }
    return null;
  }
  
  function goNext() {
    var links = getNavControls();
    if (links && links[1].href) {
      location = links[1].href;
    } else {
      console.log('Can\'t find next link');
    }
  }
  
  function goPrevious() {
    var links = getNavControls();
    if (links && links[0].href) {
      location = links[0].href;
    } else {
      console.log('Can\'t find previous link')
    }  
  }
  
  function goHome() {
    location = 'http://www.flickr.com';
  }
  
  function goUp() {
    var el = query('.contextTitleOpen a')[0];
    if (el) {
      location = el.href;
    } else {
      console.log('Can\'t find context link');
    }
  }
  
  function star() {
    var el = getEl('photo_gne_button_add_to_faves');
    if (el) {
      clickElement(el);
    }
  }
  
  window.addEventListener('keypress', function(e) {
    // Ignore key events from inputs and textareas.
    switch (e.target.tagName) {
      case 'INPUT':
      case 'TEXTAREA':
        return;
    }  

    var pageType = page.getPageType();
    var key = String.fromCharCode(e.charCode).toUpperCase();
    
    if (pageType in SHORTCUTS && key in SHORTCUTS[pageType]) {
      SHORTCUTS[pageType][key].fn(e);
    } else if (key in SHORTCUTS.common) {
      SHORTCUTS.common[key].fn(e);
    }
  });
  
  window.addEventListener('keydown', function(e) {
    // Special key codes.
    switch (e.keyCode) {
      case 27:
        document.activeElement.blur();
        lightbox.close();
        break;
    }
  });
    
})();
