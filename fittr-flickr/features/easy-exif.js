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
 * Easy Exif
 * Adds a link that allows you to view the EXIF information for a phone inline
 * without navigating to a separate page.  Shows a limited subset for brevity.
 */
 
var exif = (function() {
  
  var EXIF_TAG_WHITELIST = {
    FileSize: 1,
    FileType: 1,
    ImageWidth: 1,
    ImageHeight: 1,
    EncodingProcess: 1,
    BitsPerSample: 1,
    ColorComponents: 1,
    XResolution: 1,
    YResolution: 1,
    ResolutionUnit: 1,
    Model: 1,    
    Lens: 1,
    MeteringMode: 1,
    Flash: 1,
    ExposureMode: 1,
    WhiteBalance: 1,
    SceneCaptureType: 1,
    DeviceModel: 1,
    CreatorTool: 1 ,
    
    ExposureProgram: 1,
    DateTimeOriginal: 1,
    ColorTransform: 1,

    ExposureTime: 1,
    FNumber: 1,
    ISO: 1,
    ExposureCompensation: 1,
    FocalLength: 1
  };
  
  var link;
  var exifData = {};
  if (page.getPhotoId()) {
    link = addPhotoLink('+ ', 'Show/hide additional exif data fields');
    if (!link) return;
    link.id = 'fittr-exif-link';
    link.addEventListener('click', toggleExifDisplay);
    getExifEl();
  }
  
  var showing = false;
  function toggleExifDisplay(e) {
    var el = getExifEl();
    var linkEl = getEl('fittr-exif-link');
    if (showing) {
      linkEl.innerHTML = '+ ';
      el.style.display = 'none';
    } else {
      linkEl.innerHTML = '&ndash; ';
      el.style.display = '';
    }
    showing = !showing;
  }
  
  function getExifField(section, tag) {
    if (exifData[section] && exifData[section][tag]) return exifData[section][tag];
    else return {label: '', value: ''};
  }
  
  function getExifEl() {
    var el = getEl('fittr-exif-display');
    if (!el) {
      el = createEl('div');
      el.id = 'fittr-exif-display';
      el.innerHTML = '<i>Loading</i>';
      el.style.display = 'none';
      link.parentNode.parentNode.insertBefore(el, link.parentNode.nextSibling);

      api.makeApiRequest(api.RequestType.GET_EXIF, {photo_id: page.getPhotoId()}, function(data) {
        el.innerHTML = '';
        var cameraInfo;
        if (data.status == 200 && data.content.stat == 'ok') {
          for (var i = 0; i < data.content.photo.exif.length; i++) {
            var item = data.content.photo.exif[i];
            var value = item.clean ? item.clean._content : item.raw._content;
            
            // Convert data into the structure we want to use.
            if (!exifData[item.tagspace]) exifData[item.tagspace] = {};
            exifData[item.tagspace][item.tag] = {
              label: item.label,
              value: value
            };
          }
          
          // Create the big exif table.
          var table = createEl('table', 'fittr-exif-table');
          el.appendChild(table);
          
          for (var section in exifData) {
            var sectionId = 'fittr-exif-section-' + section;
            var tr = createEl('tr');
            tr.addEventListener('click', function(e) {
              var id = e.target.className;
              var rows = query('tr.' + id);
              for (var i = 0, n = rows.length; i < n; i++) {
                rows[i].style.display = rows[i].style.display == '' ? 'none' : '';
              }
            });
            tr.className = 'fittr-exif-section';
            var td1 = createEl('td');
            td1.className = sectionId;
            td1.appendChild(createText('+  ' + section));
            tr.appendChild(td1);
            var td2 = createEl('td');
            td2.className = sectionId;
            td2.appendChild(createText(''));
            tr.appendChild(td2);
            table.appendChild(tr);
            
            for (var tag in exifData[section]) {
              var label = exifData[section][tag].label;
              var value = exifData[section][tag].value || '';
              var tr = createEl('tr');
              tr.className = 'fittr-exif-row ' + sectionId;
              tr.style.display = 'none';
              var td1 = createEl('td');
              td1.appendChild(createText(label + ' (' + tag + ')'));
              tr.appendChild(td1);
              var td2 = createEl('td');
              // Bit of a hack to make sure the long Digest fields don't cause the whole page
              // to get super wide.  If other fields can be this long without any breaking spaces
              // then we should instead insert <wbr> tags.
              td2.appendChild(createText(value.replace(/([^\s]),([^\s])/g, '$1, $2')));
              tr.appendChild(td2);
              table.appendChild(tr);
            }
          }
          
          // Get the camera info string.
          var exposure = getExifField('ExifIFD', 'ExposureTime');
          var match = exposure.value.match(/\(([0-9]+\/[0-9]+)\)/);
          if (match) exposure = match[1];
          else exposure = exposure.value;
            
          var fnumber = getExifField('ExifIFD', 'FNumber').value;
          var iso = getExifField('ExifIFD', 'ISO').value;
          var focalLength = getExifField('ExifIFD', 'FocalLength').value;
      
          if (exposure && fnumber && iso && focalLength) {
            cameraInfo = exposure + 's . ' + 
                  fnumber + ' . ' +
                  'ISO ' + iso + ' . ' +
                  focalLength;
          }
          
        } else {
          var error = createEl('i');
          if (data.status == 200 && data.content.stat == 'fail') {
            error.appendChild(createText('Error loading EXIF : ' + data.content.message));
          } else {
            error.appendChild(createText('Error loading EXIF, status: ' + data.status));
          }
          el.appendChild(error);
        }  
        
        // Add the camera info, which is always there.
        if (!cameraInfo) cameraInfo = 'No camera info';
        var txtEl = addPhotoLink(cameraInfo, 'Show/hide additional exif data fields');
        txtEl.className = 'flickr-exif-info';
        txtEl.addEventListener('click', toggleExifDisplay);
        setTimeout(function() { txtEl.style.opacity = 1; }, 0);
      });
    }
    return el;
  }
  
  return {
    toggle: toggleExifDisplay
  };
})();
