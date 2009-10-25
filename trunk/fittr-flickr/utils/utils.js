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
 * Utils
 * Common utilities used by the other scripts.
 */

function addPhotoLink(caption, title, opt_url) {
  var linkArea = getLinkArea();
  if (!linkArea) return;
  
  var link = createEl(opt_url ? 'a' : 'span');
  link.appendChild(createText(caption));
  if (opt_url) {
    link.href = opt_url;
    link.className = 'Plain';
  } else {
    link.className = 'xxxFakeLink';
  }
  link.id = 'photolink_' + title.replace(/[^a-z0-9]/i, '');
  link.title = title;
  linkArea.appendChild(link);
  return link;
}

function getPhotoLink(title) {
  return getEl('photolink_' + title.replace(/[^a-z0-9]/i, ''));
}

function addPhotoLinkText(text) {
  var linkArea = getLinkArea();
  if (!linkArea) return;
  
  var link = createEl('span');
  link.appendChild(createText(text));
  linkArea.appendChild(link); 
}

function getLinkArea() {
  var linkArea = getEl('xxxLinkArea');
  if (!linkArea) {
    var photo = query('div.photoImgDiv')[0];
    if (!photo) return;
    linkArea = createEl('div');
    linkArea.id = 'xxxLinkArea';
    var s = linkArea.style;
    s.position = 'relative';
    s.textAlign = 'right';
    s.fontSize = '80%';
    s.padding = '2px';
    s.color = '#999';
    s.zIndex = 1000;
    photo.parentNode.insertBefore(linkArea, photo.nextSibling);
  }
  return linkArea;
}
