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
