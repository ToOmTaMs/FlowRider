<?php
// oauth callback
?>
<html>
<body>
<script>
function receiveMessage(event)
{
	console.log(event);
  event.source.postMessage(window.location.href,
                           event.origin);
}
window.addEventListener("message", receiveMessage, false);
    // window.opener.oauthCallback(window.location.href);
    // window.close();
</script>
Oauthcb in appberry.co
</body>
</html>