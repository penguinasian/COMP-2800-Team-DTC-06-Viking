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
        // Do something for the user here. 
        console.log(user);
        userName = user.name;
        db.collection("users").doc(user.uid)
            .get()
            .then(function (doc) {
                document.getElementById("profile-title").innerText = doc.data().name + "'s Profile";
                bookmarksArray = doc.data().bookmarks;
                userID = doc.data().user_id;
                console.log(bookmarksArray);
                bookmarkCount = bookmarksArray.length;
                console.log(bookmarkCount);
                fetchRoutes();
            })
    } else {
        // No user is signed in.
        window.location.href="https://viking-eaee3.web.app/login.html";
    }
});

document.getElementById("bookmarks-prev").addEventListener('click', function() {
    decrementBookmarkIndex(1);
    console.log(bookmarkIndex);
    setCurrentBookmark();
});
    
document.getElementById("bookmarks-next").addEventListener('click', function() {
   incrementBookmarkIndex(1);
   console.log(bookmarkIndex);
   setCurrentBookmark();
    });

function fetchRoutes() {
    let allRoutes = db.collection("popular_routes");
    bookmarksArray.forEach((bookmark) => {
        allRoutes.where("ROUTE_ID", "==", bookmark).get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                routesList.push(doc.data());
                if (!firstUpdate) {
                    firstUpdate = true;
                    document.getElementById("bookmarks-spinner").style.visibility = "hidden";
                    document.getElementById("bookmarks-spinner").style.height = 0;
                    setCurrentBookmark();
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }); 
}

function setCurrentBookmark() {
    document.getElementById("bookmarks-route-title").innerHTML = routesList[bookmarkIndex].ROUTE_NAME;
    document.getElementById("bookmarks-route-difficulty").innerHTML = routesList[bookmarkIndex].ROUTE_DIFFICULTY;
    document.getElementById("bookmarks-route-length").innerHTML = routesList[bookmarkIndex].ROUTE_LENGTH + " km";
    document.getElementById("bookmarks-route-duration").innerHTML = routesList[bookmarkIndex].ROUTE_DURATION + " hrs";
    document.getElementById("bookmarks-container").style.backgroundImage = "url('" + routesList[bookmarkIndex].ROUTE_STATIC_IMG + "')";
}

function incrementBookmarkIndex(increment) {
    if ((bookmarkIndex + increment) == bookmarkCount) {
        bookmarkIndex = 0;
    } else {
        bookmarkIndex++;
    }
}

function decrementBookmarkIndex(decrement) {
    if ((bookmarkIndex - decrement) == -1) {
        bookmarkIndex = bookmarkCount - 1;
    } else {
        bookmarkIndex--;
    }
}

//fetch user reservations from the reservation collection

function fetchReservations() {
    let allReservations = db.collection("reservation").where("USER_ID", "==", userID);
        allReservations.get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                reservationsArray.push(doc.data());
            });
            getLockerID();
        })
        .catch((error) => {
            console.log(error);
        });
    }; 

//adds unique locker ids from reservations to an array

function getLockerID() {
    reservationsArray.forEach((reservation) => {
        lockersList.add(reservation.LOCKER_ID);
    });
    fetchLockerLocation();
}

//gets locker info from set of unique locker id

function fetchLockerLocation() {
    let allLockers = db.collection("lockers");
    for (let locker of lockersList) {
        allLockers.where("id", "==", locker).get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                lockerArray.push(doc.data());
            });
            updateUserReservation();
        })
        .catch((error) => {
            console.log(error);
        });
    }
}; 

//gets locker address from locker info

function getLockerAddress(lockerID) {
    lockerArray.forEach((locker) => {
        if (locker.id == lockerID) {
            return locker.address;
        }
    });
}

//adds reservation html based on parameters

function createReservationHistory(resID, resAddress, resBox, resDate, resDuration) {
    document.getElementById("reservations-div").insertAdjacentHTML("beforeend", '<table class="tg"><thead><tr><th class="titles">Locker Address</th><th class="values" id="raddress'+ resID +'">'+ resAddress +'</th></tr><tr><td class="titles">Box #</td><td class="values" id="rbox'+ resID +'">'+ resBox +'</td></tr><tr><td class="titles">Start Date</td><td class="values" id="rdate'+ resID +'">'+ resDate +'</td></tr><tr><td class="titles">Duration</td><td class="values" id="rduration'+ resID +'">'+ resDuration +'</td></tr></thead></table>');
}

//combines information and outputs it to the page as html

function updateUserReservation() {
    for (var i = 0; i < reservationsArray.length; i++) {
        createReservationHistory(i, getLockerAddress(i), reservationsArray[i].BOX_ID, reservationsArray[i].RES_BEGIN, reservationsArray[i].RES_DURATION_WEEKS);
    }
}