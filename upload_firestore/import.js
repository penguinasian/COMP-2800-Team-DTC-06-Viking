const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

const admin = require("firebase-admin");

/* Upload JSON TO Firestore */
const jsonToFirestore = async () => {
    try{
        console.log('Initializing Firebase');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://viking-eaee3-default-rtdb.firebaseio.com"
          });
        // await firestoreService.initializeApp(serviceAccount, "https://viking-eaee3-default-rtdb.firebaseio.com");
        console.log('Firebase Initialized');

        /* enter the name of JSON file below */
        await firestoreService.restore('./data/parkade_json.json');
        console.log('Update Success');
    }
    catch (error) {
        console.log(error);
    }
};

jsonToFirestore();


/* Code Reference
    https://copycoding.tistory.com/315 */
