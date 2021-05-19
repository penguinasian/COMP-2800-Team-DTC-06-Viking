let bookmarksArray = [];
let reservationsArray = [];
let routesList = [];
let bookmarkIndex = 0;
let bookmarkCount, userName;
let firstUpdate = false;

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