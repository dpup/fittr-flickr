/**
 * Simple implementation of an expring, bounded cache.
 */

function Cache() {
  var keys = this.keys_ = [];
  var data = this.data_ = {};
  
  setInterval(function() {
    console.log('Cache size ' + keys.length);
    while (keys.length > Cache.MAX_SIZE) {
      var key = keys.shift();
      console.log('Size exceeded, removing ' + key + ' from cache');
      delete data[key];
    }
    var maxAge = Date.now() - Cache.MAX_LIFETIME;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (data[key].created < maxAge) {
        console.log('Age exceeded, removing ' + key + ' from cache');
        keys.splice(i, 1);
        delete data[key];
        i--;
      }
    }
  }, 60 * 1000);
}

Cache.MAX_SIZE = 25;
Cache.MAX_LIFETIME = 20 * 60 * 1000;

Cache.prototype.put = function(type, params, response) {
  var hc = this.getHc_(type, params);
  if (!this.data_[hc]) this.keys_.push(hc);
  this.data_[hc] = {
    value: response,
    created: Date.now()
  };
};

Cache.prototype.get = function(type, params) {
  var key = this.getHc_(type, params);
  var obj = this.data_[key];
  if (obj) {
    for (var i = 0; i < this.keys_.length; i++) {
      if (this.keys_[i] == key) {
        this.keys_.splice(i, 1);
        break;
      }
    }
    this.keys_.push(key);
    return obj.value;
  }
  return null;
};

Cache.prototype.getHc_ = function(type, params) {
  return type + '__' + JSON.stringify(params);
};
