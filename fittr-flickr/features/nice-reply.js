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
  var inp = getEl('message') || query('form textarea')[0];
  
  // Go through all the comment blocks.
  var comments = query('div.comment-block');
  for (var i = 0; i < comments.length; i++) {
    var img = comments[i].querySelector('div.Who img');
    var whoLink = comments[i].querySelector('h4 a');
    if (!img || !whoLink) continue;
    
    var who = whoLink.textContent.split(' ')[0];
    var insertAfter = comments[i].querySelector('small a[class=Plain]');
    
    createReplyLink(who, img.src, insertAfter);
  }
  
  // Look for group posts and replies.
  var rows = query('#DiscussTopic tr');
  for (var i = 0; i < rows.length; i++) {
    var img = rows[i].querySelector('td.Who img');
    var whoLinks = rows[i].querySelectorAll('td.Said h4 a');
    if (!img || whoLinks.length == 0) continue;
    
    var who;
    for (var j = 0; j < whoLinks.length; j++) {
      if (whoLinks[j].textContent != '') {
        who = whoLinks[j].textContent.split(' ')[0];
        break;
      }
    }
    
    var insertAfter = rows[i].querySelector('td.Said small a[class=Plain]');
    
    createReplyLink(who, img.src, insertAfter);
  }
  
  function createReplyLink(who, img, el) {
    var link = createEl('a');
    link.href = '#message';
    link.className = 'Plain';  
    link.setAttribute('img', img);
    link.setAttribute('who', who);
    link.appendChild(createText('reply'));
  
    // Find the small links and insert the reply.
    var parent = el.parentNode;
    var sibling = el.nextSibling;
    parent.insertBefore(createText(' | '), sibling);
    parent.insertBefore(link, sibling);
    parent.insertBefore(createText(' '), sibling);
  
    // When user clicks on reply link add nice HTML to the input box.
    link.addEventListener('click', function(e) {
      var selection = '';
      if (window.getSelection().rangeCount) {
        var tmpDiv = document.createElement();
        tmpDiv.appendChild(window.getSelection().getRangeAt(0).cloneContents());
        selection = tmpDiv.innerHTML;
      }      

      var prefix = inp.value ? '\n' : '';
      var imageHtml = '<img src="' + e.target.getAttribute('img') +
          '" width="16" height="16"> &nbsp;';
      var nameHtml = '<b>' + e.target.getAttribute('who') + '</b>';

      var content;
      if (selection) {
        content = prefix + '<blockquote>' + imageHtml + nameHtml + ' said:\n<i>' +
            selection + '</i></blockquote> ';
      } else {
        content = prefix + imageHtml + nameHtml + ': ';
      }

      inp.value = inp.value + content; 
      inp.focus();
      inp.selectionStart = inp.value.length;
    });  
  }
})();
