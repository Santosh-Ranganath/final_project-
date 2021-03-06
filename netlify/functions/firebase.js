const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {apiKey: "AIzaSyANVXBOsL8Oij3vllP5r7j85ZM1h69TRKQ",
authDomain: "kiei-451-9dc69.firebaseapp.com",
projectId: "kiei-451-9dc69",
storageBucket: "kiei-451-9dc69.appspot.com",
messagingSenderId: "276054356383",
appId: "1:276054356383:web:ec794fb4737cbd02704daa"} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase