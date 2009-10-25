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
    var maxCreated = Date.now() - Cache.MAX_LIFETIME;
    while (keys.length > 0 && data[keys[0]].created < maxCreated) {
      var key = keys.shift();
      console.log('Age exceeded, removing ' + key + ' from cache');
      delete data[key];      
    }
  }, 60 * 1000);
}

Cache.MAX_SIZE = 25;
Cache.MAX_LIFETIME = 20 * 60 * 1000; // 20-mins

Cache.prototype.put = function(type, params, response) {
  var hc = this.getHc_(type, params);
  if (!this.data_[hc]) this.keys_.push(hc);
  this.data_[hc] = {
    value: response,
    created: Date.now()
  };
};

Cache.prototype.get = function(type, params) {
  var obj = this.data_[this.getHc_(type, params)];
  return obj ? obj.value : null;
};

Cache.prototype.getHc_ = function(type, params) {
  return type + '__' + JSON.stringify(params);
};
