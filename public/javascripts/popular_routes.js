
function add_popularRoutes(id, ROUTE_NAME, ROUTE_STATIC_IMG, ROUTE_LENGTH, ROUTE_DIFFICULTY, ROUTE_POPULARITY) {

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
    addLikeListener(id, likes_number, like_div)


    //append child divs to parent div
    individule_routes.appendChild(a_link)
    individule_routes.appendChild(routes_name)
    individule_routes.appendChild(routes_detail)


    document.getElementsByClassName("routesImage")[0].appendChild(individule_routes)
}


function readPopularRoutes() {

    firebase.auth().onAuthStateChanged(function (user) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        if (uid) {
            db.collection("users").doc(uid)
                .get().then(function (doc) {
                    db.collection("popular_routes").orderBy("ROUTE_POPULARITY", "desc").limit(4)
                        .get()
                        .then(function (query) {

                            pageStart = query.docs[0]
                            pageEnd = query.docs[3]


                            query.forEach(function (doc) {

                                add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                    , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                            })
                        })

                })
        } else {
            window.location.href = "https://viking-eaee3.web.app/login.html";
        }
    })
}

let pageStart = null;
let pageEnd = null;
readPopularRoutes();


function AddNextClickPagination() {

    firebase.auth().onAuthStateChanged(function (user) {
        paginationButton = document.getElementById("nextButton");
        paginationButton.addEventListener("click", function () {
            console.log("button was clicked");
            firebase.auth().onAuthStateChanged(function (user) {
                var user = firebase.auth().currentUser;
                var uid = user.uid;
                document.getElementById("previousButton").className = ""
                db.collection("users").doc(uid)
                    .get().then(function (doc) {

                        db.collection("popular_routes").orderBy("ROUTE_POPULARITY", "desc").startAfter(pageEnd).limit(4)
                            .get()
                            .then(function (query) {

                                if (!query.size) {
                                    return;
                                }

                                pageStart = query.docs[0]
                                pageEnd = query.docs[3]

                                document.getElementsByClassName("routesImage")[0].innerHTML = "";

                                if (!pageEnd) {
                                    nextButton = document.getElementById("nextButton");
                                    nextButton.className = "hidden";
                                }
                                query.forEach(function (doc) {

                                    add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                        , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                                })
                            })

                    })

            })
        })
    })
}

AddNextClickPagination();


function AddPreviousClickPagination() {

    firebase.auth().onAuthStateChanged(function (user) {
        paginationButton = document.getElementById("previousButton");
        paginationButton.addEventListener("click", function () {
            console.log("button was clicked");
            firebase.auth().onAuthStateChanged(function (user) {

                document.getElementById("nextButton").className = ""
                var user = firebase.auth().currentUser;
                var uid = user.uid;
                db.collection("users").doc(uid)
                    .get().then(function (doc) {

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

                                    add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                        , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                                })
                            })

                    })

            })
        })
    })
}

AddPreviousClickPagination();


function addLikeListener(id, likes_number, like_div) {
    firebase.auth().onAuthStateChanged(function (user) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;

        like_div.addEventListener("click", async function () {

            let route_name = like_div.parentNode.getElementsByClassName("routesNameFont")[0].innerText
            let user = await db.collection("users").doc(uid).get()
            let liked_routes_array = user.data().liked_routes
            if (liked_routes_array.includes(route_name)) {
                console.log("like was clicked!")
                db.collection("popular_routes")
                    .doc(id)
                    .update({
                        ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(-1) //decrements like!
                    })


                db.collection("users")
                    .doc(uid)
                    .update({

                        liked_routes: firebase.firestore.FieldValue.arrayRemove(route_name)
                    })

                let thumbButton = document.getElementsByClassName("fa-thumbs-up")[0]
                thumbButton.style.color = "#4C744C";


            } else {
                console.log("like was clicked!")
                db.collection("popular_routes")
                    .doc(id)
                    .update({
                        ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(1) //increments like!
                    })

                db.collection("users")
                    .doc(uid)
                    .update({

                        liked_routes: firebase.firestore.FieldValue.arrayUnion(route_name)
                    })
                let thumbButton = document.getElementsByClassName("fa-thumbs-up")[0]
                thumbButton.style.color = "red";

            }
        })


    })

    db.collection("popular_routes")
        .doc(id)
        .onSnapshot(function (snap) {
            likes_number.innerHTML = snap.get("ROUTE_POPULARITY")
        })
}


function addFilterListenerForLevel() {
    var e = document.getElementById("levelOption")

    var levelDropDown = document.getElementById("levelOption");
    firebase.auth().onAuthStateChanged(function (user) {
        levelDropDown
            .addEventListener("change", function () {
                var text = e.value
                console.log("button was clicked")
                db.collection("popular_routes").where("ROUTE_DIFFICULTY", "==", text)
                    .get()
                    .then(function (query) {
                        document.getElementsByClassName("routesImage")[0].innerHTML = "";
                        query.forEach(function (doc) {

                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)


                        })
                    })
            })
    })
}

addFilterListenerForLevel();


function addFilterListenerForLength() {
    var e = document.getElementById("lengthOption")

    var lengthDropDown = document.getElementById("lengthOption");
    firebase.auth().onAuthStateChanged(function (user) {
        lengthDropDown.addEventListener("change", function () {
            var text = e.value
            console.log("button was clicked")
            if (text == "0") {
                db.collection("popular_routes")
                    .get()
                    .then(function (query) {
                        document.getElementsByClassName("routesImage")[0].innerHTML = "";
                        query.forEach(function (doc) {
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                        })
                    })
            }

        })
    })
}

addFilterListenerForLength();

function addFilterListenerForPopularity() {
    var e = document.getElementById("popularity")

    var lengthDropDown = document.getElementById("popularity");
    firebase.auth().onAuthStateChanged(function (user) {
        lengthDropDown.addEventListener("change", function () {
            var text = e.value
            console.log("filter changed")
            if (text == "Popularity: All") {
                db.collection("popular_routes")
                    .get()
                    .then(function (query) {
                        document.getElementsByClassName("routesImage")[0].innerHTML = "";
                        query.forEach(function (doc) {
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
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
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                        })
                    })
            }

        })
    })
}

addFilterListenerForPopularity();