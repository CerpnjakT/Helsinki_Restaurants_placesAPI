
let map;
let infowindow;
var data = {restaurants:[]}

async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  infowindow = new google.maps.InfoWindow();
  //change lat and lng values to center of search
  var itis = {lat:60.222884, lng:25.085509};
  map = new Map(document.getElementById("map"), {
    center: itis,
    zoom: 13,
  });
  


  var request = {
    location: itis,
    radius: '100', //search radius
    query: 'restaurant' //word selector
  };

  const service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

//https://developers.google.com/maps/documentation/places/web-service/place-data-fields
function callback(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
    for (var i = 0; i < results.length; i++) {
      var place = results[i];

      var requestDetails = {
        placeId: place.place_id,
        fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
      };
      
      //service.getDetails(requestDetails, detailsCallback);
      
        pushData(place);
        createMarker(place);
        
      
    }
    /*if(pagination.hasNextPage){
        getNextPage = () => {
            pagination.nextPage();
            console.log('has next page!');
          };
          */
    var json = JSON.stringify(data)
    console.log(json)
  }
}

function pushData(place){
    data.restaurants.push({name:place.name, 
        price_level: place.price_level,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
    })
}



function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
  
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
  
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name || "");
      infowindow.open(map);
    });
  }

initMap();