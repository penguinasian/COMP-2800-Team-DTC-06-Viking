
// Our web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAnItMRdAhhWAhg2DmlPu6Li2vO952iEho",
  authDomain: "viking-eaee3.firebaseapp.com",
  databaseURL: "https://viking-eaee3-default-rtdb.firebaseio.com",
  projectId: "viking-eaee3",
  storageBucket: "viking-eaee3.appspot.com",
  messagingSenderId: "1023079035960",
  appId: "1:1023079035960:web:8b599ae44da92977ea62cd",
  measurementId: "G-N6DGC8Y5FP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore(); // add this to read/write
