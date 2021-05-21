let clickCount = 1;
        function sayHello() {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    // Do something for the user here. 
                    console.log(user.uid);
                    db.collection("users").doc(user.uid)
                        .get()
                        .then(function (doc) {
                            var n = doc.data().name;
                            console.log(n);
                            document.getElementById("username").innerText = n;

                        })
                } else {
                    // No user is signed in.
                    //window.location.href="https://viking-eaee3.web.app/login.html";
                }
            });
        }
        sayHello();

        document.getElementById("logoImg").addEventListener("click", function () {
            if (clickCount != 10) {
                clickCount++;
                document.getElementsByClassName("logoName")[0].removeAttribute("id");
            } else {
                clickCount = 1;
                document.getElementsByClassName("logoName")[0].id = "animated-logo";
            }
        });

        function addAnimationListener() {
            let i = 0

            let easterEggButton = document.getElementById("username")
            easterEggButton.addEventListener("click", function(){
                i++;
                if(i==1){
                    let newPara = document.getElementById("vikingLogo")
                    newPara.innerHTML = "Daniel"
                }

                if(i==2){
                    let newPara = document.getElementById("vikingLogo")
                    newPara.innerHTML = "Eiman"
                }

                if(i==3){
                    let newPara = document.getElementById("vikingLogo")
                    newPara.innerHTML = "JJ"
                }


                if(i==4){
                    let newPara = document.getElementById("vikingLogo")
                    newPara.innerHTML = "Kevin"
                }

                if(i>4){
                    let newPara = document.getElementById("vikingLogo")
                    newPara.innerHTML = "Viking"
                }
                if (i>4) {


                    i = 0;
                }


                let firstPage = document.getElementsByClassName("firstPage")[0]
                firstPage.className = "firstPage alternateBackGround" + i;






            })
        }

        addAnimationListener();