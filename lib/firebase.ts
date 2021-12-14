// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore  } from 'firebase/firestore';
// import { getStorage  } from 'firebase/storage';

// // use this if you want to follow V8 tutorial. Otherwise, go full-on V9
// // import firebase from 'firebase/compat/app'
// // import 'firebase/compat/auth';
// // import 'firebase/compat/firestore';
// // import 'firebase/compat/storage';

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBe9CHwlfyr0tfZ_aTq9tKCd_0Abkn-ptw",
//   authDomain: "fireship-d89a0.firebaseapp.com",
//   projectId: "fireship-d89a0",
//   storageBucket: "fireship-d89a0.appspot.com",
//   messagingSenderId: "808592955554",
//   appId: "1:808592955554:web:ec91088eac6a0b355d5ffb",
//   measurementId: "${config.measurementId}"
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // Checking due to Next issue on double init
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
// const auth = getAuth();
// const db = getFirestore(app);
// const storage = getStorage(app);
// const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBe9CHwlfyr0tfZ_aTq9tKCd_0Abkn-ptw",
  authDomain: "fireship-d89a0.firebaseapp.com",
  projectId: "fireship-d89a0",
  storageBucket: "fireship-d89a0.appspot.com",
  messagingSenderId: "808592955554",
  appId: "1:808592955554:web:ec91088eac6a0b355d5ffb",
  measurementId: "${config.measurementId}"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();


export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // createdAt: data.createdAt.toMillis(),
    // updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
