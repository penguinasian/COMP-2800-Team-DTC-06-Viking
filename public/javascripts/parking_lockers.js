
// This code is partially copied from https://codepen.io/mtbroomell/pen/yNwwdv and modified based on this situation:
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

//needs to be changed to lockers images
const mapIcons = {
  "locker_high": "./images/parkade_high.png",
  "locker_medium": "./images/parkade_medium.png",
  "locker_low": "./images/parkade_low.png",
  "locker_full": "./images/parkade_full.png",
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

function getNumberOfBoxes() {
  let numberOfLockers;
  db.collection("lockers")
  .get()
  .then(function (query2) {
    numberOfLockers = query2.size;
    console.log("First func: " + numberOfLockers);
  })
  for (let i = 0; i < numberOfLockers; i++) {
    numberOfBoxes.push(0);
  }
  console.log("numOfLockers = " + numberOfLockers);
}

//testing the reservation database
function getReservationData() {
  
  db.collection("reservation")
    .get()
    .then(function (query) {
        let fullBoxes = [];
        let req_begin = new Date('2021-05-28');
        let req_end = new Date('2021-08-28');

        let count = 0;
        query.forEach(function (doc) {
          let record = []
          let boxID = doc.data().BOX_ID;
          let lockerID = doc.data().LOCKER_ID;
          let resBegin = doc.data().RES_BEGIN;
          let numOfWeeks = doc.data().RES_DURATION_WEEKS;
          let numOfDays = numOfWeeks * 7;
          let begin = new Date(resBegin);
          let end = new Date(resBegin);
          end.setDate(end.getDate() + numOfDays);
              
              
          if (!(begin > req_end) && !(end < req_begin)) {
            count++;
            record.push(lockerID, boxID);
            fullBoxes.push(record);
          }    
        })
      
      // console.log(count);
      // console.log(fullBoxes);
      
      // //hard coded: needs to be changed later
      // let totalLockersBoxes = [0,0,0,0,0,0];
      // let lockersBoxes = [[1,1], [1,2], [1,3], [1,4], [1,5], [2,1], [2,2], [2,3], [2,4], [2,5], [3,1], [3,2], [3,3], [3,4], [3,5], [4,1], [4,2], [4,3], [4,4], [4,5], [5,1], [5,2], [5,3], [5,4], [5,5], [6,1], [6,2], [6,3], [6,4], [6,5]];
      // let availableLockersBoxes = lockersBoxes;
      // let test = [1,2];
      
      // for (let i = 0; i < fullBoxes.length; i ++) {
      //   var j = 0;
      //   while (availableLockersBoxes[j]) {
      //     if ((availableLockersBoxes[j][0] == fullBoxes[i][0]) && (availableLockersBoxes[j][1] == fullBoxes[i][1])) {
      //       availableLockersBoxes.splice(j, 1);
      //     }
      //     else {
            
      //       j ++;
      //     }
      //   }
      // }
      // console.log(availableLockersBoxes);

      //calculating the number of avalable boxes in each locker:
      // for(let i = 0; i < availableLockersBoxes.length; i++) {
      //   totalLockersBoxes[availableLockersBoxes[i][0]-1] += 1;
      // }
      // console.log(totalLockersBoxes);
      updateMap(fullBoxes);
  })
}


/* read data from Firestore and update map*/
function updateMap(fullBoxes) {
  db.collection("lockers")
      .get()
      .then(function (query) {
          let locations = [];
          // console.log(fullBoxes);
          query.forEach(function (doc) {
            let lockerID = doc.data().id;
            let lockerBoxes = [];
            let numOfBoxes = doc.data().total;

            for (let i = 1; i <= numOfBoxes; i++) {
              lockerBoxes.push([lockerID, i]);
            }

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

              let available = lockerBoxes.length;
              let availablity = available / numOfBoxes;
              console.log(lockerID, availablity, lockerBoxes);

              if (availablity >= 0.6) {
                 availablity = "locker_high"
              } else if (availablity >= 0.3) {
                  availablity = "locker_medium"
              } else if ( availablity > 0) {
                  availablity = "locker_low"
              } else {
                  availablity = "locker_full"
              }

              let infoContent = `<h4>${doc.data().name}</h4><b>Address: </b> <br> ${doc.data().address} <br> <br><h5 class=${availablity}>Parking Slots: ${available} / ${numOfBoxes} </h5>`;
              let locker = [infoContent, doc.data().latitude, doc.data().longitude, available, numOfBoxes, availablity];
              locations.push(locker)
           })

          addMarkers(locations, 'locker')
      })
}

/* add Markers and infoWindows*/
function addMarkers(locations, type) {
  for (let i = 0; i < locations.length; i++) {

      const latLng = new google.maps.LatLng(locations[i][1], locations[i][2]);
      let mapIcon
      // let availablity =  locations[i][3] / locations[i][4]
      // if (availablity >= 0.6) {
      //     mapIcon = mapIcons["parkade_high"]
      // } else if (availablity >= 0.3) {
      //     mapIcon = mapIcons["parkade_medium"]
      // } else if ( availablity > 0) {
      //     mapIcon = mapIcons["parkade_low"]
      // } else {
      //     mapIcon = mapIcons["parkade_full"]
      // }

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

getReservationData();
// updateMap();