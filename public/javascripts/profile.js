let bookmarksArray = [];
let reservationsArray = [];
let routesList = [];
const lockersList = new Set();
let lockerArray = [];
let bookmarkIndex = 0;
let bookmarkCount, userName;
let firstUpdate = false;
let userID;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // Get the user's bookmarks and reservations and display them on the page
        console.log(user);
        userName = user.name;
        db.collection("users").doc(user.uid)
            .get()
            .then(function (doc) {
                document.getElementById("profile-title").innerText = titleCase(doc.data().name) + "'s Profile";
                bookmarksArray = doc.data().bookmarks;
                userID = doc.data().USER_ID;
                console.log(bookmarksArray);
                bookmarkCount = bookmarksArray.length;
                console.log(bookmarkCount);
                if (bookmarkCount != 0) {
                    fetchRoutes();
                } else {
                    setBMLoadText();
                }
                fetchReservations();
            });
    } else {
        // No user is signed in.
        window.location.href="https://viking-eaee3.web.app/login.html";
    }
});

//Cycle through bookmarks when the left arrow is clicked

document.getElementById("bookmarks-prev").addEventListener('click', function() {
    if (bookmarkCount > 1) {
        decrementBookmarkIndex(1);
        setCurrentBookmark();
    }
});

//Cycle through bookmarks when the right arrow is clicked
    
document.getElementById("bookmarks-next").addEventListener('click', function() {
    if (bookmarkCount > 1) {
        incrementBookmarkIndex(1);
        setCurrentBookmark(); 
    }
    });

//Log user out when logout button is clicked

document.getElementById("logout-button").addEventListener('click', function() {
    logOut();
});

//Set bookmarks text to tell user they have no bookmarks

function setBMLoadText() {
    document.getElementById("bookmarks-spinner").style.visibility = "hidden";
    document.getElementById("bookmarks-spinner").style.height = 0;
    if (bookmarkCount == 0) {
        document.getElementById("bookmarks-route-title").innerHTML = "Sorry, you have no bookmarked routes";
    }
}


/*Gets the popular routes information from the server, then checks if the user
bookmarked them and updates the bookmarks carousel accordingly*/

function fetchRoutes() {
    let allRoutes = db.collection("popular_routes");
    bookmarksArray.forEach((bookmark) => {
        allRoutes.where("ROUTE_ID", "==", bookmark).get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                routesList.push(doc.data());
                if (!firstUpdate) {
                    firstUpdate = true;
                    setBMLoadText();
                    setCurrentBookmark();
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }); 
}

      
//Sets the route information for the current bookmark to the page based on
//the route in the bookmark index, as well as links it to the correct details 
//page when clicked      
      
function setCurrentBookmark() {
    document.getElementById("bookmarks-route-title").innerHTML = routesList[bookmarkIndex].ROUTE_NAME;
    document.getElementById("bookmarks-route-difficulty").innerHTML = routesList[bookmarkIndex].ROUTE_DIFFICULTY;
    document.getElementById("bookmarks-route-length").innerHTML = routesList[bookmarkIndex].ROUTE_LENGTH + " km";
    document.getElementById("bookmarks-route-duration").innerHTML = routesList[bookmarkIndex].ROUTE_DURATION + " hrs";
    document.getElementById("bookmarks-container").style.backgroundImage = "url('" + routesList[bookmarkIndex].ROUTE_STATIC_IMG + "')";
    document.getElementById("route-link").href = "./routes_detail_page.html?name=" + routesList[bookmarkIndex].ROUTE_NAME;
    document.getElementById("route-link").target = "_blank";
}
      
//Increases the current bookmark index

function incrementBookmarkIndex(increment) {
    if ((bookmarkIndex + increment) == bookmarkCount) {
        bookmarkIndex = 0;
    } else {
        bookmarkIndex++;
    }
}

//Decreases the current bookmark index      
      
function decrementBookmarkIndex(decrement) {
    if ((bookmarkIndex - decrement) == -1) {
        bookmarkIndex = bookmarkCount - 1;
    } else {
        bookmarkIndex--;
    }
}

//fetch user reservations from the reservation collection

function fetchReservations() {
    let allReservations = db.collection("reservation").where("USER_ID", "==", parseInt(userID, 10));
        allReservations.get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                reservationsArray.push(doc.data());
            });
            if (reservationsArray.length != 0) {
                getLockerID();
            } else {
                changeResLoadText();
                document.getElementById("reservations-div").insertAdjacentHTML("beforeend", '<p style="font-size: 5vw; margin-top: 5vh; text-align: center;">Sorry, you currently have no reservations</p>');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    } 

//Adds unique locker ids from reservations to an array

function getLockerID() {
    for (var i = 0; i < reservationsArray.length; i++) {
        lockersList.add(reservationsArray[i].LOCKER_ID);
    }
    fetchLockerLocation();
}

function changeResLoadText() {
    document.getElementById("reservation-loading-message").innerHTML = "Your Reservations";
    document.getElementById("reservation-spinner").style.height = 0;
    document.getElementById("reservation-spinner").style.visibility = "hidden";
}

//Gets locker info from set of unique locker id

function fetchLockerLocation() {
    const lockerValues = lockersList.values();
    let nextValue = lockerValues.next().value;
    console.log(nextValue, lockerValues);
    fetchLockerHelper(nextValue, lockerValues);
}

//Iterative function that gets locker information for each locker from a reservation      
      
function fetchLockerHelper(lockerListValue, allValues) {
    db.collection("lockers").where("id", "==", parseInt(lockerListValue, 10)).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                lockerArray.push(doc.data());
            });
            let nextValue;
            try {
                nextValue = allValues.next().value;
            } catch {
                nextValue = false;
            } finally {
                if (nextValue) {
                    fetchLockerHelper(nextValue, allValues);
                } else {
                    changeResLoadText();
                    updateUserReservation();
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

//Gets locker address from locker info

function getLockerAddress(lockerID) {
    for (var i = 0; i < lockerArray.length; i++) {
        if (lockerArray[i].id == lockerID) {
            return lockerArray[i].address;
        }
    }
}

//Adds a reservation as a table to the html based on parameters

function createReservationHistory(resID, resAddress, resBox, resDate, resDuration) {
    document.getElementById("reservations-div").insertAdjacentHTML("beforeend", '<table class="tg"><thead><tr><th class="titles">Locker Address</th><th class="values" id="raddress'+ resID +'">'+ resAddress +'</th></tr><tr><td class="titles">Box #</td><td class="values" id="rbox'+ resID +'">'+ resBox +'</td></tr><tr><td class="titles">Start Date</td><td class="values" id="rdate'+ resID +'">'+ resDate +'</td></tr><tr><td class="titles">Duration</td><td class="values" id="rduration'+ resID +'">'+ resDuration +' Weeks</td></tr></thead></table>');
}

//Combines reservation information and passes it to a function to output as html

function updateUserReservation() {
    for (var i = 0; i < reservationsArray.length; i++) {
        createReservationHistory(i, getLockerAddress(reservationsArray[i].LOCKER_ID), reservationsArray[i].BOX_ID, reservationsArray[i].RES_BEGIN, reservationsArray[i].RES_DURATION_WEEKS);
    }
}

//taken from https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

 //Log out function for firebase     
 
function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
}