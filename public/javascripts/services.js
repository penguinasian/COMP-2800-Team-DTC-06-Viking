
/* checkbox selectors */
const checkBoxAirPump = document.querySelector('input[id="airPumpCheck"]');
const checkBoxServiceShop = document.querySelector('input[id="serviceShopCheck"]');
const checkBoxBikeRental = document.querySelector('input[id="BikeRentalsCheck"]');

/* paths of the imgs for markers */
const mapIcons = { 
    "airpump" : "./images/airpump.png",
    "repair" : "./images/repair.png",
    "rental" : "./images/rental.png"
};


/*Write a new document containing the data of the dish on Firestore 
  Type writeServices() on the chrome console */
function writeServices() {
    let servicesRef = db.collection("services");
    servicesRef.add({ 
        address: "3002 Granville St, Vancouver, BC V6H 3J8",
        latitude: 49.25929525514697,
        longitude: -123.13718188510096,
        name: "Meinhardt Fine Foods",
        type: "airpump",
        note: "Mon-Sun 9a.m.-6p.m"
    });
    console.log('updated');
}

/* Initialize map*/
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(49.26656454900745, -123.10665831323317),
    });
}


/* update zoom lever and center location of the map*/
function updateMapCenter() {
    let zoom = map.getZoom();
    let centerObject = map.getCenter();
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoom,
        center: new google.maps.LatLng(centerObject.lat(), centerObject.lng()),
    });
}


/* render the latest geodata from Firestore*/
function updateMap() {
    db.collection("services")
        .get()
        .then(function (query) {
            let locations = [];
            query.forEach(function (doc) {
                console.log(doc.data().address, doc.data().name, doc.data().latitude, doc.data().longitude);
                let location = [`<h4>${doc.data().name}</h4><b>Addres: </b> <br> ${doc.data().address} <br><br> ${doc.data().note}`, doc.data().latitude, doc.data().longitude, doc.data().type];
                locations.push(location);
                // console.log(location)
            });

            updateMapCenter();

            if (document.querySelector('input[id="airPumpCheck"]').checked) {
                addMarkers(locations, 'airpump');
            } if (document.querySelector('input[id="serviceShopCheck"]').checked) {
                addMarkers(locations, 'repair'); 
            } if (document.querySelector('input[id="BikeRentalsCheck"]').checked) {
                addMarkers(locations, 'rental');
            }
        });
}


/*Add makers on the map
  type = airpump, repair, rental
*/ 
function addMarkers(locations, type) {   
    for (let i = 0; i < locations.length; i++) {
        if (type == locations[i][3]) {
            const latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
            let marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: mapIcons[type]
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    let infowindow = new google.maps.InfoWindow({
                        content: locations[i][0]
                    });
    
                    infowindow.open(map, marker);

                    google.maps.event.addListener(map, "click", function(event) {
                        infowindow.close();
                    });
                };
            })(marker, i));
        }
    }
}


/* update the map when a checkbox is changed */
checkBoxAirPump.addEventListener( 'change', function() {
    updateMap();
});

checkBoxServiceShop.addEventListener( 'change', function() {
    updateMap();
});

checkBoxBikeRental.addEventListener( 'change', function() {
    updateMap();
});



/* initial render geodata from Firestore */
updateMap();

