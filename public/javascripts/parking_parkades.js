const mapIcons = {
    "parkade": "./images/parkade.png",
    "locker": "./images/locker.png",
    "full": "./images/full.png"
}

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
function updateMap() {
    db.collection("parkades")
        .get()
        .then(function (query) {
            let locations = []
            query.forEach(function (doc) {
                let infoContent = `<h4>${doc.data().name}</h4> <br> ${doc.data().address} <br> <br><h5>Parking Slots: ${doc.data().available} / ${doc.data().total} </h5>`;
                let parkade = [infoContent, doc.data().latitude, doc.data().longitude, doc.data().available, doc.data().total];
                locations.push(parkade)
            })

            addMarkers(locations, 'parkade')
        })
}

/* add Markers and infoWindows*/
function addMarkers(locations, type) {
    for (let i = 0; i < locations.length; i++) {

        const latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
        let mapIcon
        if (locations[i][3] == 0) {
            mapIcon = mapIcons["full"]
        } else {
            mapIcon = mapIcons[type]
        }

        let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: mapIcon
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


updateMap()