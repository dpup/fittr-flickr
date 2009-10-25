/**
 * Page Utils
 * Utilities for accessing elements in Flickr pages.
 */

var page = {

  getPhotoId: function() {
    var m = re.PHOTO_PAGE.exec(location.href);
    return m && Number(m[1]);
  },

  getPhotoUrl: function() {
    var photo = query('div.photoImgDiv img')[0];
    return photo ? photo.src : null;
  },

  getPageType: function() {
    var url = location.href;
    if (re.STREAM.test(url)) return 'stream';
    if (re.HOME_PAGE.test(url)) return 'home';
    if (page.getPhotoUrl()) return 'photo';
    return 'unknown';
  },

  getContext: function() {
    return page.isInPool() ? 'pool' :
           page.isInSet() ? 'set' :
           'stream';
  },

  isInPhotoStream: function() {
    return location.href.indexOf('in/photostream') != -1;
  },
  
  isInPool: function() {
    return location.href.indexOf('in/pool-') != -1;
  },
  
  isInSet: function() {
    return location.href.indexOf('in/set-') != -1;
  }
};
