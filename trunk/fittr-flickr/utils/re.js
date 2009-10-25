/**
 * RE
 * Regular expressions used for common matching tasks.
 */

var re = {
  PHOTO_URL: /https?:\/\/farm\d+\.static\.flickr\.com\/[^\/]+\/(\d+)_[0-9a-z]+(_[mstbo])?\.[a-z]{3}/i,
  PHOTO_PAGE: /^https?:\/\/[^\/]*\bflickr\.com\/photos\/[^\/]+\/(\d+)/i,
  STREAM: /^https?:\/\/[^\/]*\bflickr\.com\/photos\/([^\/]+)\/?$/i,
  PROFILE: /^https?:\/\/[^\/]*\bflickr\.com\/people\/([^\/]+)\/?$/i,
  HOME_PAGE: /^https?:\/\/[^\/]*\bflickr\.com\/?$/i
};
