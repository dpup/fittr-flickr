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
    var shortUrl = 'http://flic.kr/p/' + base58Encode(id);
    
    var title = document.title.split(' on Flickr - Photo Sharing!')[0];
    var tweet = '"' + title + '" - ' + shortUrl;
    var twitterUrl = 'http://twitter.com/?status=' + encodeURIComponent(tweet);
    
    var el = getEl('li_geo_block');
    if (el) {
      var li = createEl('li');
      li.className = 'Stats';
      
      var input = createEl('input', 'fitter-shorturl-input');
      input.type = 'text';
      input.setAttribute('spellcheck', 'false');
      input.value = shortUrl;
      input.title = 'Click to select, then use Ctrl-C to copy';
      input.addEventListener('click', function(e) {
        e.target.select();
      });
      li.appendChild(input);
      li.appendChild(createText(' ('));
      
      var a2 = createEl('a');
      a2.href = twitterUrl;
      a2.className = 'Plain';
      a2.target = '_blank';
      a2.appendChild(createText('tweet'));
      
      li.appendChild(a2);
      li.appendChild(createText(')'));
      
      el.parentNode.insertBefore(li, el.parentNode.firstChild);
    }
  }
})();
