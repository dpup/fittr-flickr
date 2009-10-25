/**
 *  Easy Links
 *  Adds a direct links to the various photo sizes.
 */

(function() {
  var ALL_SIZES = ['Square', 'Thumbnail', 'Small', 'Medium', 'Large', 'Original'];
  
  var photoUrl = page.getPhotoUrl();
  var photoId = page.getPhotoId();
  if (photoId && photoUrl) {
    addPhotoLink('\u25FB', 'Square', getTmpUrl('s')).style.fontSize = '115%';
    addPhotoLinkText(' ');
    addPhotoLink('T', 'Thumbnail', getTmpUrl('t'));
    addPhotoLinkText(' ');
    addPhotoLink('S', 'Small', getTmpUrl('m'));
    addPhotoLinkText(' ');
    addPhotoLink('M', 'Medium', photoUrl);
    addPhotoLinkText(' ');
    addPhotoLink('L', 'Large', getTmpUrl('b'));
    addPhotoLinkText(' ');
    addPhotoLink('O', 'Original', getTmpUrl('o'));
    addPhotoLinkText(' '); 
    
    // Make an API request to try and get more accurate link URLs.
    api.getImageSizes(photoId, function(sizes) {
      if (!sizes) return;
      var urls = {};
      for (var i = 0; i < sizes.length; i++) {
        urls[sizes[i].label] = sizes[i].source;
      }
      for (var i = 0; i < ALL_SIZES.length; i++) {
        var size = ALL_SIZES[i];
        var el = getPhotoLink(size);
        if (urls[size]) {
          el.href = urls[size];
        } else {
          el.href = '#';
          el.title = size + ' image not available';
          el.className = 'xxxDisabledLink';
        }
      }
    });
  }
  
  // Get a temporary best guess URL while we try and look up the real links
  // asynchronously.
  function getTmpUrl(suffix) {
    return photoUrl.replace('.jpg', '_' + suffix + '.jpg');
  }
})();
