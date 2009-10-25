/**
 * API.
 * Utilities for making API requests to Flickr.
 */

var api = {
  API_KEY: '92f14cd6624fc2f44d1f59f119ece00a',
  
  RequestType: {
    GET_EXIF: 'flickr.photos.getExif',
    GET_SIZES: 'flickr.photos.getSizes',
    LOOKUP_USER: 'flickr.urls.lookupUser'
  },
  
  makeApiRequest: function(requestType, data, callback){
    var port = chrome.extension.connect({
      name: requestType + '_' + new Date().getTime()
    });
    port.onMessage.addListener(callback);
    port.postMessage(data);
  },
  
  getUserForUrl: function(url, callback){
    api.makeApiRequest(api.RequestType.LOOKUP_USER, {url: url}, function(data){
      if (data.status == 200 && data.content.stat == 'ok') {
        var id = data.content.user.id;
        callback(id);
      }
      else {
        console.log('Can not get user id');
        console.log(data);
        callback(null);
      }
    });
  },
  
  getImageSizes: function(id, callback){
    api.makeApiRequest(api.RequestType.GET_SIZES, { photo_id: id}, function(data){
      if (data.status == 200 && data.content.stat == 'ok') {
        callback(data.content.sizes.size);
      } else {
        console.log('Can not get image sizes');
        console.log(data);
        callback(null);
      }
    });
  }
};
