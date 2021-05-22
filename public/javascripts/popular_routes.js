async function AddNextClickPagination(user) {


    //get the "next" button
    paginationButton = document.getElementById("nextButton");
    paginationButton.addEventListener("click", function () {
        console.log("button was clicked");

        //reset the "previousButton" class to empty string. So that the "previous button" shows on the other pages other than the first page
        document.getElementById("previousButton").className = ""

        // get the next 4 routes by using orderBy and startAfter. Note: pageEnd has been reset to the the 4th route of previous page
        db.collection("popular_routes").orderBy("ROUTE_POPULARITY", "desc").startAfter(pageEnd).limit(4)
            .get()
            .then(function (query) {
                // stop the function when there is no routes left, stop the function right away
                if (!query.size) {
                    return;
                }

                //reset the "pageStart" to the first route of the current page, "pageEnd" to the last route of the current page
                pageStart = query.docs[0]
                pageEnd = query.docs[3]

                //clear everything on the page first, otherwise, the next 4 routes will be added on top of the existing one
                document.getElementsByClassName("routesImage")[0].innerHTML = "";

                //since we are using query.docs[3] to set the "pageEnd", if we couldn't have a fourth item, then means this is the last page
                if (!pageEnd) {

                    //last page, hide the next button
                    nextButton = document.getElementById("nextButton");
                    nextButton.className = "hidden";
                }
                query.forEach(function (doc) {

                    add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                        , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                })
            })

    })

}

function addFilterListenerForLength(user) {
    var e = document.getElementById("lengthOption")

    var lengthDropDown = document.getElementById("lengthOption");

    lengthDropDown.addEventListener("change", function () {
        var text = e.value
        console.log("button was clicked")
        if (text == "0") {
            db.collection("popular_routes")
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "1") {
            db.collection("popular_routes").where("ROUTE_LENGTH", "<=", 10)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "2") {
            db.collection("popular_routes").where("ROUTE_LENGTH", "<=", 20).where("ROUTE_LENGTH", ">", 10)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "3") {
            db.collection("popular_routes").where("ROUTE_LENGTH", "<=", 30).where("ROUTE_LENGTH", ">", 20)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "4") {
            db.collection("popular_routes").where("ROUTE_LENGTH", ">", 30)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

    })

}

function readPopularRoutes(user) {

    //to get only 4 routes at a time in a page
    db.collection("popular_routes").orderBy("ROUTE_POPULARITY", "desc").limit(4)
        .get()
        .then(function (query) {

            //assign the first document(route) and the last document(route) on a page to variables pageStart and pageEnd
            pageStart = query.docs[0]
            pageEnd = query.docs[3]

            //query the documents inside popular_routes collection
            query.forEach(function (doc) {

                add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                    , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
            })
        })

}

async function AddPreviousClickPagination(user) {


    paginationButton = document.getElementById("previousButton");
    paginationButton.addEventListener("click", function () {
        console.log("button was clicked");

        document.getElementById("nextButton").className = ""


        db.collection("popular_routes").orderBy("ROUTE_POPULARITY", "desc").endBefore(pageStart).limitToLast(4)
            .get()
            .then(function (query) {
                if (!query.size) {
                    return;
                }
                pageStart = query.docs[0]
                pageEnd = query.docs[3]

                document.getElementsByClassName("routesImage")[0].innerHTML = "";

                if (!pageEnd) {
                    previousButton = document.getElementById("previousButton");
                    previous.className = "hidden";
                }
                query.forEach(function (doc) {

                    add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                        , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                })
            })




    })

}

function addFilterListenerForPopularity(user) {
    var e = document.getElementById("popularity")

    var lengthDropDown = document.getElementById("popularity");

    lengthDropDown.addEventListener("change", function () {
        var text = e.value
        console.log("filter changed")
        if (text == "Popularity: All") {
            db.collection("popular_routes")
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "Top 3") {
            db.collection("popular_routes").where("ROUTE_POPULARITY", ">=", 1).orderBy("ROUTE_POPULARITY").limit(3)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "Top 5") {
            db.collection("popular_routes").where("ROUTE_POPULARITY", ">=", 1).orderBy("ROUTE_POPULARITY").limit(5)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

        if (text == "Top 10") {
            db.collection("popular_routes").where("ROUTE_POPULARITY", ">=", 1).orderBy("ROUTE_POPULARITY").limit(10)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                    })
                })
        }

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

        let route_name = like_div.parentNode.getElementsByClassName("routesNameFont")[0].innerText
        let liked_routes_array = user.data().liked_routes
        //check if the route the user is liking is already in the array
        if (liked_routes_array.includes(route_name)) {

            console.log("like was clicked!")
            db.collection("popular_routes")
                .doc(id)
                //if yes, then the user must have liked it before, then decrement like count if clicked again
                .update({
                    ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(-1) //decrements like!
                })


            db.collection("users")
                .doc(user.id)
                .update({

                    liked_routes: firebase.firestore.FieldValue.arrayRemove(route_name)
                })

            // reset the thumb button to fern green color
            let thumbButtonArray = like_div.parentNode.getElementsByClassName("fa-thumbs-up")[0]

            thumbButtonArray.style.color = '#4C744C'

            // otherwise, increment like count
        } else {
            console.log("like was clicked!")
            db.collection("popular_routes")
                .doc(id)
                .update({
                    ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(1) //increments like!
                })

            db.collection("users")
                .doc(user.id)
                .update({

                    liked_routes: firebase.firestore.FieldValue.arrayUnion(route_name)
                })
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


function addFilterListenerForLevel(user) {
    var e = document.getElementById("levelOption")

    var levelDropDown = document.getElementById("levelOption");

    levelDropDown
        .addEventListener("change", function () {
            var text = e.value
            console.log("button was clicked")
            db.collection("popular_routes").where("ROUTE_DIFFICULTY", "==", text)
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {

                        add_popularRoutes(doc.id, user, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                            , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)


                    })
                })
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
    readPopularRoutes(user);

    AddNextClickPagination(user);

    AddPreviousClickPagination(user);

    addFilterListenerForLevel(user);

    addFilterListenerForLength(user);

    addFilterListenerForPopularity(user);
})




