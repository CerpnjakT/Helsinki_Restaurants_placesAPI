// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

let markers=[];
let searchCentroid = null;
let radiusCircle = null;
let hits = document.getElementById("hits")
let placeIDs = [];
let placeData = {places:[
        {name: 'place name', 
        price_level: 'price level: 0-no data, 1-4 rating',
        rating: 'user rating 1-5',
        user_ratings_total: 'number of user ratings'
    }
]}
const kontula = {lat:60.235772, lng:25.083419};
    let searchRadius = document.getElementById("searchRadius")
    let searchKeyword = document.getElementById("searchKeyword")
let json;

function initMap() {
    // Create the map.
    
    const map = new google.maps.Map(document.getElementById("map"), {
      center: kontula,
      zoom: 17,
      mapId: '4b1facfe8d607fe9',
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to set the center coordinate of your search!",
        position: kontula,
    });

    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new marker.
        const svgCenter = {
            path: "M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z",
            fillColor: "orange",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 0.06,
            anchor: new google.maps.Point(300,300),
          };
        if(searchCentroid){
            radiusCircle.setMap(null)
            searchCentroid.setMap(null)}
        radiusCircle = new google.maps.Circle({
            strokeColor: "orange",
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: "orange",
            fillOpacity: 0.15,
            clickable:false,
            map,
            center: mapsMouseEvent.latLng,
            radius: searchRadius.value*1,
          });
        searchCentroid = new google.maps.Marker({
            map,
            icon: svgCenter,
            position: mapsMouseEvent.latLng,
          });
        
    });


    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");
    const searchButton = document.getElementById("search");
    
  
    moreButton.onclick = function () {
      moreButton.disabled = true;
      if (getNextPage) {
        getNextPage();
      }
    };
  
    // Perform a nearby search.
    searchButton.onclick = function (){
        let center;
        if(searchCentroid){center = searchCentroid.position}
        else{center=kontula}
        service.nearbySearch(
            { location: center, radius: searchRadius.value, type: searchKeyword.value },
            (results, status, pagination) => {
              if (status !== "OK" || !results) return;
              
        
              addPlaces(results, map);
              moreButton.disabled = !pagination || !pagination.hasNextPage;
              if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                  // Note: nextPage will call the same handler function as the initial call
                  pagination.nextPage();
                };
              }
            }
          );
    }
    
  }


  function addPlaces(places, map) {
    const placesList = document.getElementById("places");
    //setMapOnAll(null);

    for (const place of places) {
      if (!placeIDs.includes(place.place_id) && place.geometry && place.geometry.location) {
        placeIDs.push(place.place_id)
        pushData(place)

        const image = {
          url: place.icon,
          fillColor: "#0000ff",
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        const svgMarker = {
            path: "M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z",
            fillColor: "blue",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 0.06,
            anchor: new google.maps.Point(300,600),
          };
    

        let marker = new google.maps.Marker({
          map,
          icon: svgMarker,
          title: place.name,
          position: place.geometry.location,
        });
        markers.push(marker);

        const li = document.createElement("li");
  
        li.textContent = place.name;
        placesList.appendChild(li);
        li.addEventListener("click", () => {
          map.setCenter(place.geometry.location);
        });
      }
    }
    hits.innerHTML = markers.length;
    
  }
  
function requestDetails(){
    /*
    counter=0;
    for(const id of placeIDs){
        setTimeout(sendRequest(id),100)
        counter++;
    }
    */
    
       

    
    onDownload(placeData);
    
}

function sendRequest(id){
    var request = {
        placeId: id,
        //fields: ['name'],
        fields: ['name', 'price_level', 'rating', 'reviews', 'user_ratings_total']
      };
      
      detService = new google.maps.places.PlacesService(map);
      detService.getDetails(request, detCallback);
      
      function detCallback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          pushData(place);
        }
      }
}

function pushData(place){

    let priceLevel;
    let rating;
    let reviews;
    let userRatings;

    if(place.price_level== undefined){priceLevel= 0}
    else{priceLevel=place.price_level}
    if(place.rating== undefined){rating= 0}
    else{rating=place.rating}
    if(place.reviews== undefined){reviews= 'no data'}
    else{reviews=place.reviews}
    if(place.user_ratings_total== undefined){userRatings= 0}
    else{userRatings=place.user_ratings_total}

    placeData.places.push({
        name: place.name.toString(), 
        price_level: parseInt(priceLevel),
        rating: parseInt(rating),
        user_ratings_total: parseInt(userRatings)
    })
}

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function onDownload(data){
      download(JSON.stringify(data),searchKeyword.value + ".json", "text/plain");
      console.log(data)
      console.log(JSON.stringify(data))
  }

  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function clearList() {
    setMapOnAll(null);
    markers = [];
    let places = document.getElementById("places")
    places.innerHTML= "";
  }


  window.initMap = initMap;