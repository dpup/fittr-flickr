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
 * Nice Reply
 * Adds a reply link that pastes the HTML for a users avatar into the comment
 * box allowing for easily directed replies.
 */

(function() {
  // Global elements.
  var inp = getEl('message');
  
  // Go through all the comment blocks.
  var comments = query('div.comment-block');
  for (var i = 0; i < comments.length; i++) {
    var img = comments[i].querySelector('div.Who img').src;
    var whoLink = comments[i].querySelector('h4 a');
    if (!whoLink) continue;
    
    var who = whoLink.textContent.split(' ')[0];
  
    // Create the reply link.
    var link = createEl('a');
    link.href = '#message';
    link.className = 'Plain';  
    link.img = img;
    link.who = who;
    link.appendChild(createText('reply'));
  
    // Find the small links and insert the reply.
    var el = comments[i].querySelector('small a[class=Plain]').parentNode;
    el.insertBefore(createText(' | '), el.lastChild);
    el.insertBefore(link, el.lastChild);
    el.insertBefore(createText(' '), el.lastChild);
  
    // When user clicks on reply link add nice HTML to the input box.
    link.addEventListener('click', function(e) {
      var prefix = inp.value ? '\n' : '';
      inp.value = inp.value + prefix + '<img src="' + e.target.img +
          '" width="16" height="16"> &nbsp; <b>' + e.target.who + '</b>: '; 
      inp.focus();
      inp.selectionStart = inp.value.length;
    });  
  }
})();
