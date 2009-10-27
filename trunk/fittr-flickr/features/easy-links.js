/**
 * Copyright 2009 Daniel Pupius (http://code.google.com/p/fittr/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
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
          el.className = 'fittr-disabled-link';
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
