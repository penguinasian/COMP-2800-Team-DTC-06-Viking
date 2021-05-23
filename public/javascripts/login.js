var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules allow the user to write. 
            //------------------------------------------------------------------------------------------
            let latestID;
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) { 
                db.collection("users").doc("idTracking").get()
                .then(
                    function (doc) {
                        latestID = doc.data().USER_ID;
                        console.log(latestID);
                    }
                )
                .catch(
                    function (error) {
                        console.log(error);
                    }
                )
                //if new user
                db.collection("users").doc(user.uid).set({         //write to firestore
                    name: user.displayName,                    //"users" collection
                    email: user.email,                   //with authenticated user's ID (user.uid)
                    bookmarks: [],                      // adds bookmarks                        // adds likes
                    liked_routes: [],
                    USER_ID: latestID,                    // add liked_routes     
                }).then(function () {
                    console.log("New user added to firestore");
                    db.collection("users").doc("idTracking").set({
                        USER_ID: latestID + 1,
                    })
                    .then(() => {
                        console.log("Updated latest user id");
                        //re-direct to main.html after signup
                        window.location.assign("../home.html"); 
                    })
                    .catch(
                        function (error) {
                            console.log(error);
                        }
                    )      
                })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },

    },
    
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '../home.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



