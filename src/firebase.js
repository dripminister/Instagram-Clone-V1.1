import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyADXphUWrjF11VKCbKPwKaD2Ipw8PepV7c",
	authDomain: "insta-clone-41a85.firebaseapp.com",
	projectId: "insta-clone-41a85",
	storageBucket: "insta-clone-41a85.appspot.com",
	messagingSenderId: "310017934607",
	appId: "1:310017934607:web:e45b18a63f034d31516a7a",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)