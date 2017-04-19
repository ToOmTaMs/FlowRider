<?php
// request_uri for fblogin
$fbAppId=$_GET['fbAppId'];
$fbScope=$_GET['fbScope'];

// $oauthcb="http://pr1-9net.local/widget/oauthcb.php";
$oauthcb="http://".$_SERVER["HTTP_HOST"]."/widget/oauthcb.php";

$url ="https://www.facebook.com/dialog/oauth".'?client_id='.$fbAppId.'&redirect_uri='.$oauthcb
		 .'&response_type=token&display=popup&scope='.$fbScope;
header('location: '.$url);
exit;
?>
FBlogin in appberry.co