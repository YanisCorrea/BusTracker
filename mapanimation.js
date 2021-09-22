// accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoieWFuaXMtY29ycmVhIiwiYSI6ImNrdHZvYzR0NzA5eHMydmxlbWtqZ214MTQifQ.rLNTeIASUGCUUKe01dCzTw';


const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-71.091542,42.358862],
        zoom: 12,
    });

//Bus object array
const buses = [];

//Move buses
async function run(){    
	var locations = await getBusLocations();
	 

// Map buses
for (let i = 0; i < locations.length; i++) { 
		
    if (buses.length < locations.length) {
       busname = new mapboxgl.Marker()
       busname.setLngLat([locations[i].attributes.longitude, locations[i].attributes.latitude])
       .addTo(map)
       buses.push(busname);
    }

    // move buses
    if  (buses.length === locations.length) {
        busname = buses[i];
        busname.setLngLat([locations[i].attributes.longitude, locations[i].attributes.latitude])
    }
}
setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

run();