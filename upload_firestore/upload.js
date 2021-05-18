const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

/* Upload JSON TO Firestore */
const jsonToFirestore = async () => {
    try{
        console.log('Initializing Firebase');
        await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
        console.log('Firebase Initialized');

        /* enter the name of JSON file below */
        await firestoreService.restore('./parkade_json.json');
        console.log('Update Success');
    }
    catch (error) {
        console.log(error);
    }
};

jsonToFirestore();


/* Code Reference
    https://copycoding.tistory.com/315 */
