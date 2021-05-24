async function onClickPagination(user, buttonToHide, buttonToShow, isNextButton) {

    console.log("button was clicked");
    await queryAndRenderRoutes(user, isNextButton)
    //reset the "previousButton" class to empty string. So that the "previous button" shows on the other pages other than the first page
    buttonToShow.className = ""
    if (!pageEnd) {

        //last page, hide the next button
        buttonToHide.className = "hidden";
    }
}

async function queryAndRenderRoutes(user, isNextButton, restart) {
    let level = document.getElementById("levelOption").value
    let length = document.getElementById("lengthOption").value
    let query = db.collection("popular_routes")

    if (length == "0") {
        query = query.orderBy("ROUTE_POPULARITY", "desc")
    } else {
        //firebase database must order by the same field when doing inequality filter
        query = query.orderBy("ROUTE_LENGTH", "desc")
    }

    if (length == "1") {
        query = query.where("ROUTE_LENGTH", "<=", 10)
    }
    if (length == "2") {
        query = query.where("ROUTE_LENGTH", "<=", 20).where("ROUTE_LENGTH", ">", 10)
    }
    if (length == "3") {
        query = query.where("ROUTE_LENGTH", "<=", 30).where("ROUTE_LENGTH", ">", 20)
    }
    if (length == "4") {
        query = query.where("ROUTE_LENGTH", ">", 30)
    }
    if (level != "Difficulty Level: All") {
        query = query.where("ROUTE_DIFFICULTY", "==", level)
    }

    if (restart) {
        query = query.limit(4)
    }
    else if (isNextButton) {
        query = query.startAfter(pageEnd).limit(4);
    }
    else {
        query = query.endBefore(pageStart).limitToLast(4);
    }

    let result = await query.get()
    // stop the function when there is no routes left, stop the function right away
    if (!result.size) {
        return;
    }

    //reset the "pageStart" to the first route of the current page, "pageEnd" to the last route of the current page
    pageStart = result.docs[0]
    pageEnd = result.docs[3]

    //clear everything on the page first, otherwise, the next 4 routes will be added on top of the existing one
    document.getElementsByClassName("routesImage")[0].innerHTML = "";

    result.forEach(function (doc) {

        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
    })
}

async function AddNextClickPagination(user) {
    //get the "next" button
    let paginationNextButton = document.getElementById("nextButton");
    let paginationPreviousButton = document.getElementById("previousButton")
    paginationNextButton.addEventListener("click", () => onClickPagination(user, paginationNextButton, paginationPreviousButton, true))
}

async function AddPreviousClickPagination(user) {
    let paginationNextButton = document.getElementById("nextButton");
    let paginationPreviousButton = document.getElementById("previousButton");
    paginationPreviousButton.addEventListener("click", () => onClickPagination(user, paginationPreviousButton, paginationNextButton, false))

}

async function addFilterListenerForLength(user) {

    let lengthDropDown = document.getElementById("lengthOption");
    lengthDropDown.addEventListener("change", async function () {
        console.log("button was clicked")
        queryAndRenderRoutes(user, false, true)
    })
}

async function addLikeListener(id, user, likes_number, like_div) {

    let route_name = like_div.parentNode.getElementsByClassName("routesNameFont")[0].innerText
    let liked_routes_array = user.data().liked_routes
    if (liked_routes_array.includes(route_name)) {
        let thumbButtonArray = like_div.parentNode.getElementsByClassName("fa-thumbs-up")[0]

        thumbButtonArray.style.color = 'red'
    }
    like_div.addEventListener("click", async function () {

        user = await db.collection("users").doc(user.id).get()
        //check if the route the user is liking is already in the array
        if (user.data().liked_routes.includes(route_name)) {

            console.log("unlike was clicked!")
            db.collection("popular_routes")
                .doc(id)
                //if yes, then the user must have liked it before, then decrement like count if clicked again
                .update({
                    ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(-1) //decrements like!
                });

            db.collection("users")
                .doc(user.id)
                .update({

                    liked_routes: firebase.firestore.FieldValue.arrayRemove(route_name)
                });

            // reset the thumb button to fern green color
            let thumbButtonArray = like_div.parentNode.getElementsByClassName("fa-thumbs-up")[0];

            thumbButtonArray.style.color = '#4C744C';

            // otherwise, increment like count
        } else {
            console.log("like was clicked!")
            db.collection("popular_routes")
                .doc(id)
                .update({
                    ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(1) //increments like!
                });

            db.collection("users")
                .doc(user.id)
                .update({

                    liked_routes: firebase.firestore.FieldValue.arrayUnion(route_name)
                });

            // set the thumb button to red color
            let thumbButtonArray = like_div.parentNode.getElementsByClassName("fa-thumbs-up")[0]

            thumbButtonArray.style.color = 'red'

        }
    })

    // get the like count from database
    db.collection("popular_routes")
        .doc(id)
        .onSnapshot(function (snap) {
            likes_number.innerHTML = snap.get("ROUTE_POPULARITY")
        })
}


async function addFilterListenerForLevel(user) {

    var levelDropDown = document.getElementById("levelOption");
    levelDropDown
        .addEventListener("change", async function () {
            console.log("button was clicked")

            queryAndRenderRoutes(user, false, true)
        })
}

function add_popularRoutes(id, user, ROUTE_NAME, ROUTE_STATIC_IMG, ROUTE_LENGTH, ROUTE_DIFFICULTY, ROUTE_POPULARITY) {

    //create an individule div for each routes inside parent div  
    let individule_routes = document.createElement("div")
    individule_routes.className = "routes"  // set a class

    //create an image tag
    let image = document.createElement("img")
    image.setAttribute("src", ROUTE_STATIC_IMG)
    let a_link = document.createElement("a")
    a_link.setAttribute("href", "./routes_detail_page.html?name=" + ROUTE_NAME)
    a_link.appendChild(image)

    //create a div for routes name under the pic
    let routes_name = document.createElement("div")
    routes_name.className = "routesName"

    //create a p tag inside routesName div
    let route_name = document.createElement("p")
    route_name.className = "routesNameFont"
    routes_name.appendChild(route_name)
    route_name.innerText = ROUTE_NAME

    //create a like button
    let like_div = document.createElement("div")
    like_div.className = "thumb"
    like_div.innerHTML = '<i class="fas fa-thumbs-up"></i>'
    routes_name.appendChild(like_div)

    //create a routes detail div
    let routes_detail = document.createElement("div")
    routes_detail.className = "routesDetail"
    let level_text = document.createElement("p")
    level_text.innerHTML = ROUTE_DIFFICULTY
    let length_text = document.createElement("p")
    length_text.innerHTML = "Length:" + ROUTE_LENGTH.toString() + "km"
    length_text.className = "text"

    let likes_number = document.createElement("p")

    routes_detail.appendChild(level_text)
    routes_detail.appendChild(length_text)
    routes_detail.appendChild(likes_number)

    //attache event listener to the thumb
    addLikeListener(id, user, likes_number, like_div)

    //append child divs to parent div
    individule_routes.appendChild(a_link)
    individule_routes.appendChild(routes_name)
    individule_routes.appendChild(routes_detail)

    document.getElementsByClassName("routesImage")[0].appendChild(individule_routes)
}

//initialize pageStart and pageEnd to null. 
let pageStart = null;
let pageEnd = null;
firebase.auth().onAuthStateChanged(async function (firebaseUser) {
    if (!firebaseUser.uid) {
        window.location.href = "https://viking-eaee3.web.app/login.html";
        return;
    }

    let user = await db.collection("users").doc(firebaseUser.uid).get()
    queryAndRenderRoutes(user, false, true)

    AddNextClickPagination(user);

    AddPreviousClickPagination(user);

    addFilterListenerForLevel(user);

    addFilterListenerForLength(user);
})




