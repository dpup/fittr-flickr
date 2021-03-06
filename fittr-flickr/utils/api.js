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
 * API.
 * Utilities for making API requests to Flickr.
 */

var api = {
  API_KEY: '92f14cd6624fc2f44d1f59f119ece00a',
  
  RequestType: {
    GET_EXIF: 'flickr.photos.getExif',
    GET_SIZES: 'flickr.photos.getSizes',
    LOOKUP_USER: 'flickr.urls.lookupUser',
    GET_USER_TAGS: 'flickr.tags.getListUserPopular',
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
    api.makeApiRequest(api.RequestType.GET_SIZES, {photo_id: id}, function(data){
      if (data.status == 200 && data.content.stat == 'ok') {
        callback(data.content.sizes.size);
      } else {
        console.log('Can not get image sizes');
        console.log(data);
        callback(null);
      }
    });
  },
  
  getUserTags: function(user, callback) {
    api.makeApiRequest(api.RequestType.GET_USER_TAGS,
        {user_id: user, count: 500, force: 1, nocache: 1}, function(data){
      if (data.status == 200 && data.content.stat == 'ok') {
        var rawTags = data.content.who.tags.tag;
        rawTags.sort(function(a, b) {
          return Number(a.count) < Number(b.count) ? 1 :
                 Number(a.count) > Number(b.count) ? -1 :
                 a._content > b._content ? 1 :
                 a._content < b._content ? -1 : 0;
        });
        var tags = [];
        for (var i = 0; i < rawTags.length; i++) {
          tags.push(rawTags[i]._content);
        }
        callback(tags);
      } else {
        console.log('Can not get tag list');
        console.log(data);
        callback(null);
      }
    });    
  }
};
