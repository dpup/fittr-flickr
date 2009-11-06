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
 * Prefs.
 * Utilities for getting and setting prefs that are saved in localStorage by the
 * background page.
 */

var prefs = {
  get: function(name, callback) {
    var port = chrome.extension.connect({
      name: 'getPref_' + new Date().getTime()
    });
    port.onMessage.addListener(callback);
    port.postMessage({name: name});
  },
  
  set: function(name, value, callback) {
    var port = chrome.extension.connect({
      name: 'setPref_' + new Date().getTime()
    });
    port.onMessage.addListener(callback);
    port.postMessage({name: name, value: value});
  }
};
