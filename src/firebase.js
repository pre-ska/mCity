import firebase from "firebase/app";
import "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDsKmU9qncdX3dEgZ4lVhGWo4KSGic195M",
  authDomain: "sport-team-page.firebaseapp.com",
  databaseURL: "https://sport-team-page.firebaseio.com",
  projectId: "sport-team-page",
  storageBucket: "sport-team-page.appspot.com",
  messagingSenderId: "232094042735",
  appId: "1:232094042735:web:64b4217b5f247356acdb9a"
};

firebase.initializeApp(config);

const fbdb = firebase.database();
const fbMatches = fbdb.ref("matches");
const fbPromotions = fbdb.ref("promotions");
const fbTeams = fbdb.ref("teams");
const fbPlayers = fbdb.ref("players");

export { firebase, fbMatches, fbPromotions, fbTeams, fbdb, fbPlayers };
