/**
 * Nice Reply
 * Adds a reply link that pastes the HTML for a users avatar into the comment
 * box allowing for easily directed replies.
 */

(function() {
  // Global elements.
  var inp = getEl('message');
  
  // Go through all the comment blocks.
  var comments = query('div.comment-block');
  for (var i = 0; i < comments.length; i++) {
    var img = comments[i].querySelector('div.Who img').src;
    var whoLink = comments[i].querySelector('h4 a');
    if (!whoLink) continue;
    
    var who = whoLink.textContent.split(' ')[0];
  
    // Create the reply link.
    var link = createEl('a');
    link.href = '#message';
    link.className = 'Plain';  
    link.img = img;
    link.who = who;
    link.appendChild(createText('reply'));
  
    // Find the small links and insert the reply.
    var el = comments[i].querySelector('small a[class=Plain]').parentNode;
    el.insertBefore(createText(' | '), el.lastChild);
    el.insertBefore(link, el.lastChild);
    el.insertBefore(createText(' '), el.lastChild);
  
    // When user clicks on reply link add nice HTML to the input box.
    link.addEventListener('click', function(e) {
      var prefix = inp.value ? '\n' : '';
      inp.value = inp.value + prefix + '<img src="' + e.target.img +
          '" width="16" height="16"> &nbsp; <b>' + e.target.who + '</b>: '; 
      inp.focus();
      inp.selectionStart = inp.value.length;
    });  
  }
})();
