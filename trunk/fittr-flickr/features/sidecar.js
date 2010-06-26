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
 * Side Car
 * Shows Fittr Flickr build information in the sidecar
 */


(function () {
  var sidecar = getEl('sidecar');
  if (sidecar) {
    var div = createEl('div', 'sidecar fittr-sidecar');
    div.id = 'fittr-sidebar';
    sidecar.insertBefore(div, getEl('photo-sidebar-tags').nextSibling);

    
    var h4 = createEl('h4');
    h4.appendChild(createText('Fittr Things'));
    h4.appendChild(createText(' '));

    var small = createEl('small');
    small.appendChild(createText('('));

    var h4a = createEl('a', '');
    h4a.href = 'http://code.google.com/p/fittr/';
    h4a.appendChild(createText('v' + fittr.VERSION));
    small.appendChild(h4a);
    small.appendChild(createText(')'))
    h4.appendChild(small);

    div.appendChild(h4);


    // Add flic.kr URL
    var id = page.getPhotoId();
    if (id) {
      var url = 'http://flic.kr/p/' + base58Encode(id);

      var shortUrl = createEl('p');
      shortUrl.appendChild(createText('Canonical URL: '));
      var shortA = createEl('a');
      shortA.href = url;
      shortA.title = 'Right-click to copy short URL';
      shortA.appendChild(createText(url));
      shortUrl.appendChild(shortA);
      div.appendChild(shortUrl);
    }


    // View on black URL.
    var onBlack = createEl('p');
    onBlack.appendChild(createText('BigHugeLabs: '));
    var onBlackA = createEl('a');
    onBlackA.href = 'http://bighugelabs.com/onblack.php?size=large&url=' + 
        encodeURIComponent(location.href);
    onBlackA.appendChild(createText('View on Black'));
    onBlack.appendChild(onBlackA);
    div.appendChild(onBlack);


    function base58Encode(num) {
      var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
      var enc = '';
      var div = num;
      while (num >= 58) {
        div = num / 58;
        var mod = num - (58 * Math.floor(div));
        enc = String(alphabet.substr(mod, 1) + enc);
        num = Math.floor(div);
      }
      return div ? ('' + alphabet.substr(div, 1) + enc) : enc;
    }

  }
})();
