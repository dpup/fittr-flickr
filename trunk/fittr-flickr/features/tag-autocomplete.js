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
 * Tag Autocomplete
 * Adds autocomplete functionality to the tag input box.
 */

(function() {
  var formEl = getEl('tagadderform');
  var addTagEl = getEl('addtagbox');
  
  // No tagging form so exit early.
  if (!formEl || !addTagEl) return;

  var tagList;
  addTagEl.addEventListener('focus', function(e){
    if (!tagList) {
      api.getUserForUrl(location.href, function(id){
        if (id) {
          api.getUserTags(id, function(tags){
            console.log('tags loaded');
            tagList = tags;
            if (document.activeElement == addTagEl) {
              runAutoComplete();
            }
          });
        }
      });
    }    
  });
  
  addTagEl.addEventListener('keyup', function(e) {
    if (tagList && e.keyCode != 8 && e.keyCode != 13) runAutoComplete();
  });
  
  function runAutoComplete() {
    var rawInput = addTagEl.value;
    var start = addTagEl.selectionStart;
    
    // Keep it simple for now and don't autocomplete if the user is editing the middle of a tag.
    if (rawInput.length == 0 || start != rawInput.length) return;
    var tags = splitInput(rawInput);
    var currentTag = tags[tags.length - 1];

    if (currentTag.length == 0) return;

    for (var i = 0; i < tagList.length; i++) {
      var candidate = tagList[i];
      if (candidate.substr(0, currentTag.length) == currentTag) {
        addTagEl.value = rawInput + candidate.substr(currentTag.length);
        addTagEl.selectionStart = start;
        addTagEl.selectionEnd = addTagEl.value.length;
        break;
      }      
    }
  }
  
  function splitInput(text) {
    var characters = String(text).split('');
    var parts = [], cache = [];
    for (var i = 0, inLiteral = false; i < characters.length; i++) {
      var c = characters[i];
      if (c == '"') {  // Quote indicates we're in a literal and should ignore whitespace.
        if (cache.length > 0) {
          parts.push(cache.join(''));
          cache.length = 0;
        }
        inLiteral = !inLiteral;
  
      } else if (!inLiteral && c == ' ') { // Hit whitespace without being in a literal.
        if (cache.length > 0) {
          parts.push(cache.join(''));
          cache.length = 0;
        }
      } else {
        cache.push(c);
      }
    }
    parts.push(cache.join(''));
  
    return parts;
  }

})();
