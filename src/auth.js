import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
    userAuth
} from './stores/stores';

const firebaseConfig = {
    apiKey: "AIzaSyAjCgYB9VdcCacpWLaWTN4UBCXoUgJlHGA",
    authDomain: "pixelizerwebapp.firebaseapp.com",
    databaseURL: "https://pixelizerwebapp.firebaseio.com",
    projectId: "pixelizerwebapp",
    storageBucket: "pixelizerwebapp.appspot.com",
    messagingSenderId: "464760066182",
    appId: "1:464760066182:web:2f0462df33feaf7d81c107",
    measurementId: "G-G2QQYDS1BB"
};

export class FirebaseHook {


    constructor(firebaseConfig) {
        this.firebaseConfig = firebaseConfig
        firebase.initializeApp(this.firebaseConfig);
        this.auth = firebase.auth()
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
    }

    googleSignIn() {
        this.auth
            .signInWithPopup(this.googleProvider)
            .then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                userAuth.set(result);
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`)
                userAuth.set(undefined);
            });
    }

    signOut() {
        this.auth.signOut()
        userAuth.set(undefined);
    }
}

export const firebaseHook = new FirebaseHook(firebaseConfig)