/**
 * Easy Exif
 * Adds a link that allows you to view the EXIF information for a phone inline
 * without navigating to a separate page.  Shows a limited subset for brevity.
 */
 
var exif = (function() {
  
  var EXIF_TAG_WHITELIST = {
    FileSize: 1,
    MIMEType: 1,
    Model: 1,
    ExposureTime: 1,
    FNumber: 1,
    ISO: 1,
    ExposureCompensation: 1,
    FocalLength: 1,
    Lens: 1,
    
  };
  
  var link;
  if (page.getPhotoId()) {
    link = addPhotoLink('+ EXIF', 'Show selected EXIF information inline.');
    if (!link) return;
    link.id = 'xxxExifLinkEl';
    link.style.cssFloat = 'left';
    link.addEventListener('click', toggleExifDisplay);
  }
  
  var showing = false;
  function toggleExifDisplay(e) {
    var el = getExifEl();
    var linkEl = getEl('xxxExifLinkEl');
    if (showing) {
      linkEl.innerHTML = '+ EXIF';
      el.style.height = '0';
    } else {
      linkEl.innerHTML = '&ndash; EXIF';
      el.style.height = el.scrollHeight + 'px';
    }
    showing = !showing;
  }
  
  function getExifEl() {
    var el = getEl('xxxExifDisplayEl');
    if (!el) {
      el = createEl('div');
      el.id = 'xxxExifDisplayEl';
      el.innerHTML = '<i>Loading</i>';
      link.parentNode.parentNode.insertBefore(el, link.parentNode.nextSibling);

      api.makeApiRequest(api.RequestType.GET_EXIF, {photo_id: page.getPhotoId()}, function(data) {
        if (data.status == 200 && data.content.stat == 'ok') {
          var html = '<table class="xxxExifTable">';
          var seen = {};
          for (var i = 0; i < data.content.photo.exif.length; i++) {
            var item = data.content.photo.exif[i];
            if (item.tag in EXIF_TAG_WHITELIST && !(item.tag in seen)) {
              seen[item.tag] = 1;
              var value = item.clean ? item.clean._content : item.raw._content;
              html += '<tr><td>' + item.label + '</td><td>' + value + '</td></tr>';
            }
          }
          html += '</table>';
          el.innerHTML = html;
        } else if (data.status == 200 && data.content.stat == 'fail') {
          el.innerHTML = '<i>Error loading EXIF : ' + data.content.message + '</i>';
        } else {
          el.innerHTML = '<i>Error loading EXIF.</i>';
        }
        el.style.height = el.scrollHeight + 'px';
      });
    }
    return el;
  }
  
  return {
    toggle: toggleExifDisplay
  };
})();
