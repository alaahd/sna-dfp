function detectDevice () {
	
	if (!GetCookie('snaapp')) {
		var checkDevice = function () {
	    	
	        var ua = window.navigator.userAgent.toLowerCase();
	       
	        return {
	            isIphone: ua.match(/(iphone|ipod)/),
	            isIpad: ua.match(/ipad/),
	            isAndroidOverV2: (function () {
	            	
	            	if( ua.match(/android/) && ua.match(/mobile/) )
	            		{	
	            			return true;
	            		}
	            })(ua),
	            isAndroidTablet: ua.match(/android|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/),
	            isNokia: ua.match(/nokia|lumia/),
	            isBlackberry: ua.match(/blackberry/)
	        };
	        
	    };
	    window.device = new checkDevice();
	    
		var mobileObject = {
		        IPHONE: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بأجهزة آيفون",
		            URL: "https://itunes.apple.com/us/app/sky-news-arabia/id521080981?mt=8"
		        },
		        IPAD: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بأجهزة آيباد",
		            URL: "https://itunes.apple.com/us/app/sky-news-arabia-for-ipad/id521655253?mt=8"
		        },
		        ANDROID: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بهواتف أندريود",
		            URL: "https://play.google.com/store/apps/details?id=com.grapplemobile.skynewsarabia&feature=search_result#?t=W251bGwsMSwyLDEsImNvbS5ncmFwcGxlbW9iaWxlLnNreW5ld3NhcmFiaWEiXQ.."
		        },
		        ANDROIDTABLET: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بأجهزة أندريود اللوحية ",
		            URL: "https://play.google.com/store/apps/details?id=com.skynewsarabia.skynewsarabia&feature=search_result#?t=W251bGwsMSwxLDEsImNvbS5za3luZXdzYXJhYmlhLnNreW5ld3NhcmFiaWEiXQ.."
		        },
		        NOKIA: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بهواتف نوكيا",
		            URL: "http://store.ovi.com/content/274433?clickSource=search&pos=1"
		        },
		        BLACKBERRY: {
		            PROMPT: "هل تود الحصول على تطبيق سكاي نيوز عربية الخاص بهواتف بلاكبيري",
		            URL: "http://appworld.blackberry.com/webstore/content/108720/?lang=en"
		        }
		    };
		
		    
		    
		if (window.device.isAndroidOverV2) { // ANDROID > 2
			var answer = confirm(mobileObject.ANDROID.PROMPT);
			if (answer) {
				window.location.href = mobileObject.ANDROID.URL
			}
		} else if (window.device.isAndroidTablet) { // ANDROID TABLET
			var answer = confirm(mobileObject.ANDROIDTABLET.PROMPT);
			if (answer) {
				window.location.href = mobileObject.ANDROIDTABLET.URL
			}
		} else if (window.device.isIphone) { // IPHONE
			var answer = confirm(mobileObject.IPHONE.PROMPT);
			if (answer) {
				window.location.href = mobileObject.IPHONE.URL
			}
		} else if (window.device.isIpad) { // IPAD
			var answer = confirm(mobileObject.IPAD.PROMPT);
			if (answer) {
				window.location.href = mobileObject.IPAD.URL
			}
		}  else if (window.device.isNokia) { // NOKIA
			var answer = confirm(mobileObject.NOKIA.PROMPT);
			if (answer) {
				window.location.href = mobileObject.NOKIA.URL
			}
		} else if (window.device.isBlackberry) { // BLACKBERRY
			var answer = confirm(mobileObject.BLACKBERRY.PROMPT);
			if (answer) {
				window.location.href = mobileObject.BLACKBERRY.URL
			}
		}
		document.cookie = "snaapp =" + true;
	}
}

// Detect User Agent
detectDevice();

// Reading cookie value
function getCookieVal (offset) {
	  var endstr = document.cookie.indexOf (";", offset);
	  if (endstr == -1)
	    endstr = document.cookie.length;
	  return unescape(document.cookie.substring(offset, endstr));
	}

function GetCookie (name) {
	  var arg = name + "=";
	  var alen = arg.length;
	  var clen = document.cookie.length;
	  var i = 0;
	  
	  while (i < clen) {
	    var j = i + alen;
	    if (document.cookie.substring(i, j) == arg)
	      return getCookieVal (j);
	    i = document.cookie.indexOf(" ", i) + 1;
	    if (i == 0) break;
	  }
	  return null;
}