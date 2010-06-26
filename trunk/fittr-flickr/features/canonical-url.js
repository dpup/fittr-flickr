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
 * Canonical URL 
 * Adds a link to the short http://flic.kr URL for a photo and a shortcut to
 * tweeting a link.
 */

(function() {

  // TODO : Delete after new photo page is fully rolled out.
  
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

  var id = page.getPhotoId();
  if (id) {
    var el = getEl('li_geo_block');
    if (el) {
      var li = createEl('li');
      li.className = 'Stats';
      
      var input = createEl('input', 'fitter-shorturl-input');
      input.type = 'text';
      input.setAttribute('spellcheck', 'false');
      input.value = 'http://flic.kr/p/' + base58Encode(id);
      input.title = 'Click to copy short URL to the clipboard';
      input.addEventListener('click', function(e) {
        input.select();
        document.execCommand('Copy');
        input.blur();
      });
      li.appendChild(input);
      
      el.parentNode.insertBefore(li, el.parentNode.firstChild);
    }
  }
})();
