import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBXmTeXZEFak3r-dR7C5k7Cu3daznKCtqg",
    authDomain: "eet-next.firebaseapp.com",
    projectId: "eet-next",
    storageBucket: "eet-next.appspot.com",
    messagingSenderId: "244683001793",
    appId: "1:244683001793:web:7f41d7171faf306d98a940",
    measurementId: "G-MJD4M1YPE7"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyCpO_iHlkc1FdFOXhhjbzEOKJ5wlOB9TGQ",
//     authDomain: "eet-website.firebaseapp.com",
//     projectId: "eet-website",
//     storageBucket: "eet-website.appspot.com",
//     messagingSenderId: "217832949611",
//     appId: "1:217832949611:web:f8bde9f4e5ab757187ee2e",
//     measurementId: "G-BQ274BYZXS"
// }
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

