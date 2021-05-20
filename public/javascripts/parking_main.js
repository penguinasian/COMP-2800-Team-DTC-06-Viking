const mapIcons = {
    "parkade_high": "./images/parkade_high.png",
    "parkade_medium": "./images/parkade_medium.png",
    "parkade_low": "./images/parkade_low.png",
    "parkade_full": "./images/parkade_full.png",
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
                    availablity = "parkade_high"
                } else if (availablity >= 0.3) {
                    availablity = "parkade_medium"
                } else if (availablity > 0) {
                    availablity = "parkade_low"
                } else {
                    availablity = "parkade_full"
                }

                let infoContent = `<h4>${doc.data().name}</h4><b>Address: </b> <br> ${doc.data().address} <br> <br><h5 class=${availablity}>Parking Slots: ${doc.data().available} / ${doc.data().total} </h5>`;
                let parkade = [infoContent, doc.data().latitude, doc.data().longitude, availablity, doc.data().available, doc.data().total];
                locations.push(parkade)
            })

            addMarkers(locations, 'parkade')
        })
}

