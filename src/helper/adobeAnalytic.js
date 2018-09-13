export const adobeAnalyticsPageView = (pagename, LOB,platform, pagetype, primarycategory, subcategory1, subcategory2, subcategory3) => {
  let pageViewObj = {
    page: {
      pageInfo: {
        pageName: pagename,
        lob: LOB,
        sessionID: getSessionID('sessionID') !== '' ? getSessionID : '',
        platform: platform
      },
      category: {
        pageType: pagetype,
        primaryCategory: primarycategory,
        subCategory1: subcategory1,
        subCategory2: subcategory2,
        subCategory3: subcategory3
      }
    }
  }
  if(typeof yt_adobe!="undefined" && typeof _satellite!="undefined"){
	  yt_adobe.addDigitalData(pageViewObj)
  }else{
	  if(typeof yt_adobe!="undefined" && typeof _satellite=="undefined"){
		  yt_adobe.addHeaderScript('true');
		  yt_adobe.addDigitalData(pageViewObj);
		  yt_adobe.addFooterScript();
	  }
  }
   if(typeof yt_adobe!="undefined"){
        yt_adobe.track('virtualPageView', pageViewObj);
   }
}

function getSessionID (key) {
  var regex, matches
  regex = new RegExp('[; ]' + key + '=([^\\s;]*)')
  matches = (' ' + document.cookie).match(regex)
  if (key && matches) {
    return unescape(matches[1])
  }
  return ''
}
