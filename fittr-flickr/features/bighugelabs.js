/**
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
