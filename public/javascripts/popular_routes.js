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
    length_text.innerHTML = "Length:" +" " + ROUTE_LENGTH.toString() + "km"
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
        db.collection("users").doc(uid)
            .get().then(function (doc) {
                db.collection("popular_routes")
                    .get()
                    .then(function (query) {
                        query.forEach(function (doc) {

                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)

                        })
                    })

            })

    })
}

readPopularRoutes();

function addLikeListener(id, likes_number, like_div) {
    firebase.auth().onAuthStateChanged(function (user) {
        like_div.addEventListener("click", function () {
            console.log("like was clicked!")
            db.collection("popular_routes")
                .doc(id)
                .update({
                    ROUTE_POPULARITY: firebase.firestore.FieldValue.increment(1) //increments like!
                })

        })
    })
    db.collection("popular_routes")
        .doc(id)
        .onSnapshot(function (snap) {
            likes_number.innerHTML = snap.get("ROUTE_POPULARITY")
        })
}


function addFilterListener() {
    var e = document.getElementById("levelOption")
    
    var levelDropDown = document.getElementById("levelOption");
    firebase.auth().onAuthStateChanged(function (user) {
        levelDropDown.addEventListener("change", function () {
            var text = e.value
            console.log("button was clicked")
            db.collection("popular_routes")
                .get()
                .then(function (query) {
                    document.getElementsByClassName("routesImage")[0].innerHTML = "";
                    query.forEach(function (doc) {
                        if (doc.data().ROUTE_DIFFICULTY == text) {
                            add_popularRoutes(doc.id, doc.data().ROUTE_NAME, doc.data().ROUTE_STATIC_IMG, doc.data().ROUTE_LENGTH
                                , doc.data().ROUTE_DIFFICULTY, doc.data().ROUTE_POPULARITY)
                                
                        } 

                        if (text == "Level: All") {
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
                    })
                })
        })
    })
}

addFilterListener();