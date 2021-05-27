const mapIcons = {
    "locker": "./images/locker.png",
    "parkade_full": "./images/parkade_full.png",
    "parkade_high": "./images/parkade_high.png",
    "parkade_low": "./images/parkade_low.png",
    "parkade_medium": "./images/parkade_medium.png"

};

/* Availablity level
high [0.6, 1.0]
medium [0.3, 0.6)
low (0, 0.3)
full = 0 */

const full = 0;
const lowAvailablity = 0.3;
const highAvailablity = 0.6;

/* Initialize map*/
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(49.26656454900745, -123.10665831323317),
        zoom: 13
    });
}

/* read data from Firestore and update map*/
function updateMap() {
    db.collection("parkades")
        .get()
        .then(function (query) {
            let locations = [];
            query.forEach(function (doc) {
                let availablity = doc.data().available / doc.data().total;

                if (availablity >= highAvailablity) {
                   availablity = "parkade_high";
                } else if (availablity >= lowAvailablity) {
                    availablity = "parkade_medium";
                } else if ( availablity > full) {
                    availablity = "parkade_low";
                } else {
                    availablity = "parkade_full";
                }

                let infoContent = `<h4>${doc.data().name}</h4><b>Address: </b> <br> ${doc.data().address} <br> <br><h5 class=${availablity}>Parking Slots: ${doc.data().available} / ${doc.data().total} </h5>`;
                let parkade = [infoContent, doc.data().latitude, doc.data().longitude, doc.data().available, doc.data().total, availablity];
                locations.push(parkade);
            });

            addMarkers(locations);
        });
}

/* add Markers and infoWindows*/
function addMarkers(locations) {
    let i = 0;
    for (i = 0; i < locations.length; i++) {

        const latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);

        let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: mapIcons[locations[i][5]]
        });
        google.maps.event.addListener(marker, "click", (function (marker, i) {
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



/* update map with markers*/
updateMap();