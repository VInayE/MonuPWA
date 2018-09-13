export {initializeGoogleMaps,initializeDetailsGoogleMaps,initializeContactUSGoogleMaps}

function initializeContactUSGoogleMaps () {
   var myOptions = {
     zoom:12,
     center:new google.maps.LatLng(28.6278172,77.21895940000002),
     disableDefaultUI: true,
     gestureHandling: 'none',
     mapTypeControl: false,
     clickableIcons: false,
     zoomControl: false,
     mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById('pwa-monument-map'), myOptions);
    var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(28.6278172,77.21895940000002)});
    var infowindow = new google.maps.InfoWindow({content:'<strong>Archaeological survey of india</strong><br>janpath <br>110011 Delhi<br>'});
    google.maps.event.addListener(marker, 'click', function(){infowindow.open(map,marker);})
    infowindow.open(map,marker)
}
function initializeGoogleMaps (list) {
  var map
  var myLatlng = new google.maps.LatLngBounds()
  var mapOptions = {
     zoom: 4,
     disableDefaultUI: true,
     gestureHandling: 'none',
     mapTypeControl: false,
     clickableIcons: false,
     zoomControl: false,
     mapTypeId: 'hybrid'
  }
  map = new google.maps.Map(document.getElementById("pwa-monument-map"), mapOptions)
  map.setTilt(45)
  let markers =[]
  for(let i=0; i< list.length; i++){
    let list_data = []
    list_data[0] = list[i].shortTitle
    list_data[1] = list[i].locationInfo.latitude
    list_data[2] = list[i].locationInfo.longitude
    markers.push(list_data)
  }
  var infoWindowContent = []
  for (let i=0;i<list.length; i++){
    let caption = list[i].caption ? list[i].caption : ''
    let infoData =['<div class="info_content text-center">' +
					`<img src="${list[i].imageUrl}"  height="90" width="100">`+
					'<div class="">'+
						`<h3 style="font-size:13px;">${list[i].shortTitle}</h3>`+
						`<a class="" target="_self" style="color:#333;" href="/pwa/monuments/details?monumentId=${list[i].monumentId}&monumentName=${list[i].shortTitle}">`+
						`${caption}<p class="mt10">Read More ...</p></a>`+
					'</div>' +
				  '</div>']
    infoWindowContent.push(infoData)
  }
 var infoWindow = new google.maps.InfoWindow({maxWidth: 200 }), marker, i;
  for(let i = 0; i < markers.length; i++ ) {
    var position = new google.maps.LatLng(markers[i][1], markers[i][2])
    myLatlng.extend(position)
    marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: 'https://maps.google.co.in/mapfiles/kml/shapes/placemark_circle_highlight.png',
      title: markers[i][0]
    });
    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
      infoWindow.setContent(infoWindowContent[i][0]);
      infoWindow.open(map, marker);
     }
    })(marker, i));
    // Automatically center the map fitting all markers on the screen
    map.fitBounds(myLatlng);
  	}
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
			this.setZoom(4);
			google.maps.event.removeListener(boundsListener);

		});
}
function initializeDetailsGoogleMaps (latitude,longitude,shortTitle,address) {
  var map
  var myLatlng = new google.maps.LatLngBounds()
  var mapOptions = {
     zoom: 6,
     disableDefaultUI: true,
     gestureHandling: 'none',
     mapTypeControl: false,
     clickableIcons: false,
     zoomControl: false,
     mapTypeId: 'roadmap'
  }
  map = new google.maps.Map(document.getElementById("pwa-monument-map"), mapOptions)
  map.setTilt(45)
  var markers = []
    let list_data = []
    list_data[0] = shortTitle
    list_data[1] = latitude
    list_data[2] = longitude
    markers.push(list_data)
  var infoWindowContent = []
 
   // let caption = nearbyMonument[i].caption ? nearbyMonument[i].caption : ''
    let infoData =['<div class="info_content text-center">' +
					'<div class="">'+
						`<h3 style="font-size:13px;">${shortTitle}</h3>`+
						`<a class="" target="_blank" style="color:#333;" href="https://www.google.com/maps/?q=${latitude},${longitude}">`+
						`${address}<p class="mt10">Get Directions ...</p></a>`+
					'</div>' +
				  '</div>']
    infoWindowContent.push(infoData)

  var infoWindow = new google.maps.InfoWindow({maxWidth: 200 }), marker, i;
  for(let i = 0; i < markers.length; i++ ) {
    var position = new google.maps.LatLng(markers[i][1], markers[i][2])
    myLatlng.extend(position)
    marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: 'https://maps.google.co.in/mapfiles/kml/shapes/placemark_circle_highlight.png',
      title: markers[i][0]
    });
    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
     return function() {
      infoWindow.setContent(infoWindowContent[i][0]);
      infoWindow.open(map, marker);
     }
    })(marker, i));
    // Automatically center the map fitting all markers on the screen
    map.fitBounds(myLatlng);
  	}
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
			this.setZoom(12);
			google.maps.event.removeListener(boundsListener);
		});
}
