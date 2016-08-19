var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const config = {
    apiKey: "AIzaSyCOCjTMWrdR6DVmfrSePHg8vlgDh6eR6R8",
    authDomain: "formulario-proyectos.firebaseapp.com",
    databaseURL: "https://formulario-proyectos.firebaseio.com",
    storageBucket: "formulario-proyectos.appspot.com",
  };

firebase.initializeApp(config);