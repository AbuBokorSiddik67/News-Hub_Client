// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_t6XUUmTq7rGIkA29E60ud332xVcCEmE",
    authDomain: "news-letter-fb213.firebaseapp.com",
    projectId: "news-letter-fb213",
    storageBucket: "news-letter-fb213.firebasestorage.app",
    messagingSenderId: "597920702895",
    appId: "1:597920702895:web:4e6fecf41b32cced3b4f5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export default auth;