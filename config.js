// copy this file into ./config.js and change your BASE_URL
          
// var BASE_URL= "http://192.168.1.224:82/fderm_stock_mm";
// var BASE_URL= "http://203.147.39.167:82/fderm_stock_mm";
// var BASE_URL= "http://203.147.39.167:82/fderm_stock_mm_test";
            
//var n = window.location.pathname.indexOf("/", 2);         	
//window.location.pathname.substring(1, window.location.pathname.indexOf("/", 2));
//alert(window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2)));


//var BASE_URL = "http://"+window.location.host+window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var BASE_URL = "http://"+window.location.host+"/";
var BASE_WEB = window.location.pathname.substring(1, window.location.pathname.indexOf("/", 2)) ;
//alert(BASE_WEB);
//var BASE_CENTER = "fderm_center_ps/"; 
var BASE_CENTER = BASE_WEB+"/";
var BASE_API = BASE_CENTER+"api/v1/index.php/"; 
//alert(BASE_API);
//var IMAGE_FOLDER = BASE_URL+BASE_CENTER+"images/exclusive_member/";
var IMAGE_FOLDER = BASE_URL+BASE_CENTER+"images/exclusive_member/";
var IMAGE_NO_PIC = BASE_URL+BASE_CENTER+"images/exclusive_member/no-pic.jpg";