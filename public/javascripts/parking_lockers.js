/* Constants */
const mapIcons = {
  "locker_high": "./images/locker_high.png",
  "locker_medium": "./images/locker_medium.png",
  "locker_low": "./images/locker_low.png",
  "locker_full": "./images/locker_full.png",
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

const zoomLevel = 12;
const initMapLat = 49.260909127728326;
const initMapLng = -123.08353272449504;


// firebase.auth().onAuthStateChanged(function (user) {
//   if  (!user) {
//       window.location.href="https://viking-eaee3.web.app/login.html";
//   } 
// });


/* This part of code is partially copied from https://codepen.io/mtbroomell/pen/yNwwdv and modified based on this situation: */
function increaseValue() {
    var value = parseInt(document.getElementById('duration').value, 10);
    value = isNaN(value) ? 0 : value;
    value > 52 ? value = 52 : '';
    value++;
    document.getElementById('duration').value = value;
  }
  
function decreaseValue() {
    var value = parseInt(document.getElementById('duration').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 3 ? value = 3 : '';
    value--;
    document.getElementById('duration').value = value;
}


/* Initialize map*/
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoomLevel,
      center: new google.maps.LatLng(initMapLat, initMapLng)
  });
}

/* read data from firestore reservation table to generate a list of all reserved boxes in the specified period */
function getReservationData() {
  $(document).ready(function(){
    
    let start = document.getElementById("start_date").value;
    let weeks = parseFloat(document.getElementById("duration").value);
    let today = new Date();
    let req_begins = new Date(start);
    let req_ends = new Date(start);

    if (start && (req_begins >= today) && (weeks >= 2 && weeks <= 53) && Number.isInteger(weeks)) {
      let req_days = weeks * 7;
      req_ends.setDate(req_ends.getDate() + req_days);
      console.log(req_begins);
      console.log(req_ends);
    
      db.collection("reservation")
        .get()
        .then(function (query) {
            let fullBoxes = [];
    
            /* creates an array of all reserved spots with intersection to the chosen date range */
            let count = 0;
            query.forEach(function (doc) {
              let record = [];
              let boxID = doc.data().BOX_ID;
              let lockerID = doc.data().LOCKER_ID;
              let resBegin = doc.data().RES_BEGIN;
              let numOfWeeks = doc.data().RES_DURATION_WEEKS;
              let numOfDays = numOfWeeks * 7;
              let begin = new Date(resBegin);
              let end = new Date(resBegin);
              end.setDate(end.getDate() + numOfDays + 1); //it can be reserved again 24 hours later
                  
              
              if (!(begin > req_ends) && !(end < req_begins)) {
                count++;
                record.push(lockerID, boxID);
                fullBoxes.push(record);
              }    
            })
          updateMap(fullBoxes, req_begins, req_ends, weeks);
      })
    }
  });
}





/* read data from Firestore and update map*/
function updateMap(fullBoxes, req_begins, req_ends, weeks) {
  db.collection("lockers")
      .get()
      .then(function (query) {
          let locations = [];
          // console.log(fullBoxes);
          query.forEach(function (doc) {
            let lockerID = doc.data().id;
            let lockerBoxes = [];
            let numOfBoxes = doc.data().total;

            // To create a full array of nested [lockerID,boxeID] arrays of each locker in one big array:
            // [[1,1], [1,2], [1,3], [1,4], [1,5]], or [[2,1], [2,2], [2,3], [2,4], [2,5]],or [[3,1], [3,2], [3,3], [3,4], [3,5], [4,1], [4,2], [4,3], [4,4], [4,5], [5,1], [5,2], [5,3], [5,4], [5,5], [6,1], [6,2], [6,3], [6,4], [6,5]];
            for (let i = 1; i <= numOfBoxes; i++) {
              lockerBoxes.push([lockerID, i]);
            }

            // generating an array of empty slots in that locker in the chosen period/range by splicing the full array with reserved array
            for (let i = 0; i < fullBoxes.length; i ++) {
              var j = 0;
              while (lockerBoxes[j]) {
                if ((lockerBoxes[j][0] == fullBoxes[i][0]) && (lockerBoxes[j][1] == fullBoxes[i][1])) {
                  lockerBoxes.splice(j, 1);
                }
                else {
                  j++;
                }
              }
            }

            // lockerBoxes variable is now the array of free slots in the requested period by user:
            // e.g. lockerBoxes = [[1,1], [1,3]]
              
            // available is the number of empty boxes in each locker (inside forEach loop)
              let available = lockerBoxes.length;
              let availablity = available / numOfBoxes;
              console.log(lockerID, lockerBoxes);

              let boxIdArray = [];
              for (let index = 0; index < available; index++) {
                boxIdArray.push(lockerBoxes[index][1]);
              }
              let boxIdString = boxIdArray.join();
              console.log("joined: " + boxIdString);


              if (availablity >= 0.6) {
                 availablity = "locker_high"
              } else if (availablity >= 0.3) {
                  availablity = "locker_medium"
              } else if ( availablity > 0) {
                  availablity = "locker_low"
              } else {
                  availablity = "locker_full"
              }

              
              let infoContent = `<h4>${doc.data().name}</h4>
              <b>Address: </b> <br> ${doc.data().address} <br> 
              <br><h5 class=${availablity}>Parking Slots: ${available} / ${numOfBoxes} </h5>
              <a href="parking_reservation.html?array=${doc.data().address}|${req_begins}|${req_ends}|${available}|${numOfBoxes}|${weeks}|${lockerID}|${boxIdString}">
              <p class="reservation">Reservation</p></a>
              `;
              // address, check-in, check-out, available, total_slots, weeks, locker_id, box_idString
              let locker = [infoContent, doc.data().latitude, doc.data().longitude, available, numOfBoxes, availablity];
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
          icon: mapIcons[locations[i][5]]
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

/*Get currnet zoom Level and center of the map*/
function getCurrentMap() {
  let zoom = map.getZoom();
  let centerObject = map.getCenter();
  console.log(zoom);
  console.log(centerObject.lat());
  console.log(centerObject.lng());
}
