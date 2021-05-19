let bookmarksArray = [];
let reservationsArray = [];
let routesList = [];
let bookmarkIndex = 0;
let bookmarkCount;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // Do something for the user here. 
        console.log(user.uid);
        db.collection("users").doc(user.uid)
            .get()
            .then(function (doc) {
                document.getElementById("profile-title").innerText = doc.data().name + "'s Profile";
                bookmarksArray = doc.data().bookmarks;
                bookmarkCount = bookmarksArray.length;
            })
    } else {
        // No user is signed in.
        window.location.href="https://viking-eaee3.web.app/login.html";
    }
});

document.getElementById("bookmarks-prev").addEventListener('click', function() {
    incrementBookmarkIndex(-1);
    setCurrentBookmark();
});
    
document.getElementById("bookmarks-next").addEventListener('click', function() {
   incrementBookmarkIndex(1);
   setCurrentBookmark();
    });

function fetchRoutes() {
    let allRoutes = db.collection("popular_routes");
    for (bookmark in bookmarksArray) {
        allRoutes.doc(bookmark).get()
        .then((doc) => {
            console.log("Bookmark", doc.data());
            routesList.push(doc.data());
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

function setCurrentBookmark() {
    document.getElementById("bookmarks-route-title").innerText = routesList[bookmarkIndex].ROUTE_TITLE;
    document.getElementById("bookmarks-route-difficulty").innerText = routesList[bookmarkIndex].ROUTE_DIFFICULTY;
    document.getElementById("bookmarks-route-length").innerText = routesList[bookmarkIndex].ROUTE_LENGTH + " km";
    document.getElementById("bookmarks-route-duration").innerText = routesList[bookmarkIndex].ROUTE_DURATION + " hrs";
    document.getElementById("bookmarks-container").style.backgroundImage = "url('" + routesList[bookmarkIndex].ROUTE_STATIC_IMG + "')";
}

function incrementBookmarkIndex(increment) {
    if (bookmarkIndex + increment > bookmarkCount) {
        bookmarkIndex = 0;
    } else if (bookmarkIndex + increment < 0) {
        bookmarkIndex = bookmarkCount - 1;
    } else {
        bookmarkIndex++;
    }
}