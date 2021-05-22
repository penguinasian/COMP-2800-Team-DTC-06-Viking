const mapIcons = {
    "parkade_high": "./images/parkade_high.png",
    "parkade_medium": "./images/parkade_medium.png",
    "parkade_low": "./images/parkade_low.png",
    "parkade_full": "./images/parkade_full.png",
    "parkade": "./images/parkade.png",
    "locker": "./images/locker.png"
}

/* 
Availablity level
high [0.6, 1.0]
medium [0.3, 0.6)
low (0, 0.3)
full = 0
*/

const full = 0;
const lowAvailablity = 0.3;
const highAvailablity = 0.6;

/* Initialize map*/
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(49.26656454900745, -123.10665831323317)
    });
}

/* read data from Firestore and update map*/

function readParkades() {
    db.collection("parkades")
        .get()
        .then(function (query) {
            let locations = []
            query.forEach(function (doc) {
                let availablity = doc.data().available / doc.data().total

                if (availablity >= 0.6) {
                    availablity = "high"
                } else if (availablity >= 0.3) {
                    availablity = "medium"
                } else if (availablity > 0) {
                    availablity = "low"
                } else {
                    availablity = "full"
                }

                let infoContent = `<h4>${doc.data().name}</h4><b>Address: </b> <br> ${doc.data().address} <br> <br><h5 class=${availablity}>Parking Slots: ${doc.data().available} / ${doc.data().total} </h5>`;
                let parkade = [infoContent, doc.data().latitude, doc.data().longitude, 'parkade', doc.data().available, doc.data().total];
                locations.push(parkade)
            })

            addMarkers(locations)
        })
}

/* read data from Firestore and update map*/
function readLockers() {
    db.collection("lockers")
        .get()
        .then(function (query) {
            let locations = []
            query.forEach(function (doc) {
                let availablity = 5 / doc.data().total

                if (availablity >= 0.6) {
                    availablity = "locker"
                } else if (availablity >= 0.3) {
                    availablity = "locker"
                } else if (availablity > 0) {
                    availablity = "locker"
                } else {
                    availablity = "locker"
                }

                // let infoContent =
                //     `<h4>${doc.data().name}</h4>
                //     <b>Address: </b> <br> ${doc.data().address} <br> 
                //     <br><h5 class=${availablity}>Locker Slots: 5 / ${doc.data().total} </h5>
                //     <a href="parking_reservation.html?name=${doc.data().name}"><p class="reservation">Reservation</p></a>
                //     `;
                let infoContent =
                    `<h4>${doc.data().name}</h4>
                    <b>Address: </b> <br> ${doc.data().address} <br> 
                    `;
                // lockerId, startDate, numberOfweeks, (array!) 
                let locker = [infoContent, doc.data().latitude, doc.data().longitude, availablity, doc.data().total];
                locations.push(locker)
            })

            addMarkers(locations)
        })
}



/* add Markers and infoWindows*/
function addMarkers(locations) {
    for (let i = 0; i < locations.length; i++) {

        const latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);

        let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: mapIcons[locations[i][3]]
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                let infowindow = new google.maps.InfoWindow({
                    content: locations[i][0]
                });

                infowindow.open(map, marker);
            }
        })(marker, i));

    }
}

readParkades()
readLockers()