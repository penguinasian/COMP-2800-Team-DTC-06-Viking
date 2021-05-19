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

            // addMarkers(locations, 'parkade')
        })
}