/**
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
      
      var a1 = createEl('a');
      a1.href = shortUrl;
      a1.className = 'Plain';
      a1.appendChild(createText('Short URL'));
      li.appendChild(a1);
      
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
