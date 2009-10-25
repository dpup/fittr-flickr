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
 * Big Huge Labs
 * Links for Big Huge Labs pages.
 */

(function() {
  
  // Add a View On Black link to the right bar.
  var el = getEl('li_geo_block');
  if (el) {
    var li = createEl('li');
    li.className = 'Stats';
    li.style.marginBottom = '1em';
    var a1 = createEl('a');
    a1.href = 'http://bighugelabs.com/onblack.php?size=large&url=' + 
        encodeURIComponent(location.href);
    a1.className = 'Plain';
    a1.appendChild(createText('View on Black'));
    li.appendChild(a1);
    el.parentNode.insertBefore(li, el.parentNode.firstChild);
  }
  
  // Add a link the the Scout page on a users photostream page.
  el = query('.LinksNew')[0];
  if (el) {
    var profileLink = el.querySelector('span.LinksNew > A');
    if (profileLink && profileLink.parentNode.className == 'LinksNew') {
      var span = createEl('span');
      span.appendChild(profileLink);
      el.appendChild(span);      
    }
    
    var m = re.STREAM.exec(location.href) || re.PROFILE.exec(location.href);
    if (m && m[1]) {
      var span = createEl('span');
      var a = createEl('a');
      a.appendChild(createText('Scout'));
      span.appendChild(a);
      el.appendChild(span);
      
      api.getUserForUrl(location.href, function(id) {
        if (id) a.href = 'http://bighugelabs.com/scout.php?username=' + id;
      });
    }
  }

})();
