// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/storage';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// jeff's config
const firebaseConfig = {
  apiKey: 'AIzaSyBX5gkKsbOr1V0zxBuSqHWFct12dFOsQHA',
  authDomain: 'nextfire-demo.firebaseapp.com',
  projectId: 'nextfire-demo',
  storageBucket: 'nextfire-demo.appspot.com',
  messagingSenderId: '827402452263',
  appId: '1:827402452263:web:c9a4bea701665ddf15fd02',
};

// my config
// const firebaseConfig = {
//   apiKey: "AIzaSyBe9CHwlfyr0tfZ_aTq9tKCd_0Abkn-ptw",
//   authDomain: "fireship-d89a0.firebaseapp.com",
//   projectId: "fireship-d89a0",
//   storageBucket: "fireship-d89a0.appspot.com",
//   messagingSenderId: "808592955554",
//   appId: "1:808592955554:web:ec91088eac6a0b355d5ffb",
//   measurementId: "G-WELL2043B3"
// };

// Initialize firebase
// let firebaseApp;
// let firestore;
// if (!getApps().length) {
//   // firebase.initializeApp(firebaseConfig);
//   initializeApp(firebaseConfig);
//   firestore = getFirestore();
// }

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);



// Auth exports
// export const auth = firebase.auth();
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);
// export const firestore = firebase.firestore();
// export { firestore };
// export const serverTimestamp = serverTimestamp;
// export const fromMillis = fromMillis;
// export const increment = increment;

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

/// Helper functions


/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  // const usersRef = collection(firestore, 'users');
  // const query = usersRef.where('username', '==', username).limit(1);

  const q = query(
    collection(getFirestore(), 'users'), 
    where('username', '==', username),
    limit(1)
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
