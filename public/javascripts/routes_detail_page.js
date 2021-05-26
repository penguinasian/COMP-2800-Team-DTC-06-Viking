let userBookmarks = [];
let routeID, userID;
let signOn = true;


function add_RoutesDetail(id, ROUTE_MAP_LINK, ROUTE_LENGTH, ROUTE_DIFFICULTY, ROUTE_DURATION, ROUTE_ELEV_UP, ROUTE_DESC, ROUTE_NAME) {

    //create a div for bike route title on the top
    let route_title_div = document.createElement("div")
    route_title_div.className = "route_title"
    let route_title = document.createElement("h1")
    route_title.innerText = ROUTE_NAME
    route_title_div.appendChild(route_title)

    let wrapper_div = document.createElement("div")
    wrapper_div.id = "button-wrapper";
    route_title_div.appendChild(wrapper_div);
    //create a bookmark for bike route details page on the top
    let bookmark_div = document.createElement("div")
    bookmark_div.className = "bookmark"
    bookmark_div.id = "bookmarkButton"
    bookmark_div.innerHTML = '<i class="fas fa-bookmark fa-2x"></i>'
    wrapper_div.appendChild(bookmark_div)

    //create an image tag
    let image = document.createElement("iframe")
    image.setAttribute("src", ROUTE_MAP_LINK)

    //create a div for routes details under the map image
    let routes_detail = document.createElement("div")
    routes_detail.className = "routesDetail"

    //create a div to contain all the texts
    let details_text = document.createElement("div")
    details_text.className = "detailsText"

    let level_text = document.createElement("p")
    level_text.innerHTML = "Difficulty:" + ROUTE_DIFFICULTY
    details_text.appendChild(level_text)

    let duration = document.createElement("p")
    duration.innerHTML = "Duration:" + ROUTE_DURATION + "hr(s)"
    details_text.appendChild(duration)

    let length_text = document.createElement("p")
    length_text.innerHTML = "Length:" + ROUTE_LENGTH.toString() + "km"
    length_text.className = "text"
    details_text.appendChild(length_text)

    let elevation = document.createElement("p")
    elevation.innerHTML = "Elevation gain:" + ROUTE_ELEV_UP + "m"
    details_text.appendChild(elevation)

    routes_detail.appendChild(image)
    routes_detail.appendChild(details_text)

    //create a paragraph to describe the route
    let route_para = document.createElement("p")
    route_para.className = "routePara"
    route_para.innerText = ROUTE_DESC

    //append child divs to parent div
    document.getElementsByClassName("detailsPage")[0].appendChild(route_title_div)
    document.getElementsByClassName("detailsPage")[0].appendChild(routes_detail)
    document.getElementsByClassName("detailsPage")[0].appendChild(route_para)
    document.getElementById("button-wrapper").insertAdjacentHTML("beforeend", '<div class="fb-share-button" data-href="' + window.location.href + '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' +  window.location.href + '&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore"><img src="./images/facebook.png"/></a></div>');
    if (signOn) {

    changeBookmarksColour();

    document.getElementById("bookmarkButton").addEventListener("click", function () {
        updateBookmarks();
    });
    } else {
        document.getElementById("bookmarkButton").style.visibility = "hidden";
    }

}


function changeBookmarksColour() {
    if (userBookmarks.includes(routeID)) {
        document.getElementById("bookmarkButton").style.color = "#4C744C";
    } else {
        document.getElementById("bookmarkButton").style.color = "grey";
    }
}

// from https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
// why doesn't javascript have a remove function?
function removeBookmark() {
    const index = userBookmarks.indexOf(routeID);
    if (index > -1) {
    userBookmarks.splice(index, 1);
    }
}

function updateBookmarks() {
    if (userBookmarks.includes(routeID)) {
        db.collection("users").doc(userID).update({
            bookmarks: firebase.firestore.FieldValue.arrayRemove(routeID)
        });
        removeBookmark();
        changeBookmarksColour();
    } else {
        db.collection("users").doc(userID).update({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(routeID)
        });
        userBookmarks.push(routeID);
        changeBookmarksColour();
    }
}


function readPopularRoutesName(id) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userID = user.uid;
            db.collection("users").doc(user.uid).get()
            .then((doc) => {
                userBookmarks = doc.data().bookmarks;
            })
            .catch(function (error) {
                console.log("Error adding new user: " + error);
            });

        } else {
            //No user is signed in.
            signOn = false;
        }
        db.collection("popular_routes").where("ROUTE_NAME", "==", value)
        .get().then(function (result) {
            let doc = result.docs[0]
            routeID = doc.data().ROUTE_ID;
            add_RoutesDetail(doc.id, doc.data().ROUTE_MAP_LINK, doc.data().ROUTE_LENGTH
                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_DURATION, doc.data().ROUTE_ELEV_UP, doc.data().ROUTE_DESC, doc.data().ROUTE_NAME)

        })
    })


}


const params = new URLSearchParams(window.location.search)
const value = params.get('name')

readPopularRoutesName(value)