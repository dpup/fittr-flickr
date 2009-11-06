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
 * Light-Box
 * Allows you to quickly view the large version of a photo without having to switch pages.
 */

var lightbox = (function() {
  var imageInfo;
  var overImage = false;
  var backgroundClassName;
  var photoId = page.getPhotoId();
  if (photoId) {
    var thePhoto = query('.photoImgDiv img')[0];
    var dragProxy = getEl('photo-drag-proxy');
    var magnifyEl = createMagnify();
    
    api.getImageSizes(photoId, function(sizes) {
      if (!sizes) return;
      var mediumInfo;
      for (var i = 0; i < sizes.length; i++) {
        if (sizes[i].label == 'Large' || sizes[i].label == 'Original') {
          imageInfo = sizes[i];
          break;
        }
        if (sizes[i].label == 'Medium') mediumInfo = sizes[i];
      }
      thePhoto.style.cursor = 'pointer';
      dragProxy.style.cursor = 'pointer';
      if (!imageInfo) imageInfo = mediumInfo;
      if (overImage) showMaxButton();
    });

    thePhoto.addEventListener('mouseover', mouseOver);
    dragProxy.addEventListener('mouseover', mouseOver);
    thePhoto.addEventListener('mouseout', mouseOut);
    dragProxy.addEventListener('mouseout', mouseOut);
    
    magnifyEl.addEventListener('mouseout', function(e) {
      if (!(e.relatedTarget == thePhoto || e.relatedTarget == dragProxy)) {
        hideMaxButton();
        overImage = false;
      }
    });
    
    thePhoto.addEventListener('click', openLightBox);
    dragProxy.addEventListener('click', openLightBox);
    magnifyEl.addEventListener('click', openLightBox);
    
    prefs.get('lightbox-class', function(value) {
      backgroundClassName = value || 'fittr-lightbox-bg';
    });
  }
  
  function mouseOver(e) {
    if (imageInfo) showMaxButton();
    overImage = true;
  }
  
  function mouseOut(e) {
    if (e.relatedTarget != magnifyEl) {
      hideMaxButton();
      overImage = false;
    }
  }
  
  function openLightBox() {
    if (imageInfo) {
      showLightBox(imageInfo.source, imageInfo.height, imageInfo.width);
    } else {
      console.log('Image info not loaded.  TODO: handle more gracefully');
    }
  }
  
  function closeLightBox() {}
  
  var activeLightBox = false;
  function showLightBox(src, h, w) {
    h = Number(h);
    w = Number(w);
    
    if (activeLightBox) {
      closeLightBox();
      return;
    }

    closeLightBox = function() {
      document.body.removeChild(div);
      document.body.removeChild(bg);
      document.body.removeChild(ctrl);
      closeLightBox = function() {};
      activeLightBox = false;
    };

    var sH = document.body.clientHeight;
    var sW = document.body.clientWidth;
    var maxH = sH - 20;
    var maxW = sW - 70;
    if (h > maxH) {
      var dh = h / maxH;
      h = maxH;
      w = w / dh;
    }
    if (w > maxW) {
      var dw = w / maxW;
      w = maxW;
      h = h / dw;
    }
    
    var y = Math.round(sH / 2 - h / 2);
    var x = Math.round(sW / 2 - w / 2);
    
    var div = createEl('div', 'fittr-lightbox');
    div.tabIndex = '0';
    
    div.style.width = w + 'px';
    div.style.height = h + 'px';
    div.style.top = y + 'px';
    div.style.left = x + 'px';
    div.style.backgroundImage = 'url(' + chrome.extension.getURL('img/boxes.png') + ')';
    
    document.body.appendChild(div);

    div.focus();
    activeLightBox = true;

    var bg = createEl('div', backgroundClassName);
    bg.addEventListener('click', closeLightBox);
    document.body.appendChild(bg);
    
    var img = createEl('img');
    img.src = src;
    img.height = h;
    img.width = w;
    img.addEventListener('click', closeLightBox);
    div.appendChild(img);

    var ctrl = createEl('div', 'fittr-lightbox-cpanel');
    
    var dark = createEl('div', 'fittr-lightbox-control fittr-lightbox-black');
    dark.title = 'Dark';
    dark.lightBoxClass = 'fittr-lightbox-bg-dark';
    
    var grey = createEl('div', 'fittr-lightbox-control fittr-lightbox-grey');
    grey.title = 'Mid grey';
    grey.lightBoxClass = '';
    
    var white = createEl('div', 'fittr-lightbox-control fittr-lightbox-white');
    white.title = 'White';
    white.lightBoxClass = 'fittr-lightbox-bg-white';
    
    ctrl.addEventListener('click', function(e) {
      var extraClass = e.target.lightBoxClass;
      if (extraClass != undefined) {
        bg.className = 'fittr-lightbox-bg ' + extraClass;
      }
      // Saving the class rather than state is clunky but meh.
      backgroundClassName = bg.className;
      prefs.set('lightbox-class', backgroundClassName, function() {});
    });
    
    ctrl.appendChild(dark);
    ctrl.appendChild(grey);
    ctrl.appendChild(white);
    
    document.body.appendChild(ctrl);
    
    ctrl.style.top = (y + h - ctrl.offsetHeight) + 'px';
    ctrl.style.left = (x + w + 10 ) + 'px';
  }
  
  function showMaxButton() {
    magnifyEl.style.display = 'block';
  }
  
  function hideMaxButton() {
    magnifyEl.style.display = 'none'; 
  }
  
  function createMagnify() {
    var img = createEl('img');
    img.src = chrome.extension.getURL('img/magnify.png');
    img.width = '19';
    img.height = '19';
    img.className = 'fittr-magnify-icon';
    img.title = 'Clicking the image when this icon is showing will open ' +
                'a large copy in a light-box';
    img.style.left = (thePhoto.offsetWidth - 19) + 'px';
    img.style.top = (thePhoto.offsetHeight - 19) + 'px';
    thePhoto.parentNode.style.position = 'relative';
    thePhoto.parentNode.appendChild(img);
    return img;  
  }
  
  // Return the public lightbox object.
  return {
    open: openLightBox,
    show: showLightBox,
    close: function(){
      closeLightBox();
    }
  };
})();
