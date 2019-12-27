import firebase from "../node_modules/@firebase/app";
import "../node_modules/@firebase/storage";

var Config = {
  apiKey: "AIzaSyC5n8K36r44yEkafOd6Cyf2CjSFmcD0ioI",
  authDomain: "ardwtalab-b5d8c.firebaseapp.com",
  databaseURL: "https://ardwtalab-b5d8c.firebaseio.com",
  projectId: "ardwtalab-b5d8c",
  storageBucket: "ardwtalab-b5d8c.appspot.com",
  messagingSenderId: "875941737379",
  appId: "1:875941737379:web:6485c36e9b9cdc6f322016"
};

firebase.initializeApp(Config);

const storage = firebase.storage();
export { storage, firebase as default };

