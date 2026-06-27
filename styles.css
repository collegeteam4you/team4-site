const chatbox = document.getElementById('fb-customer-chat');
if (chatbox) {
  chatbox.setAttribute('page_id', '61571797572892');
  chatbox.setAttribute('attribution', 'biz_inbox');
}

window.fbAsyncInit = function () {
  FB.init({
    xfbml: true,
    version: 'v19.0',
  });
};

(function loadFacebookSdk(documentRef, scriptTag, id) {
  const firstScript = documentRef.getElementsByTagName(scriptTag)[0];
  if (documentRef.getElementById(id)) return;
  const script = documentRef.createElement(scriptTag);
  script.id = id;
  script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
  firstScript.parentNode.insertBefore(script, firstScript);
})(document, 'script', 'facebook-jssdk');
