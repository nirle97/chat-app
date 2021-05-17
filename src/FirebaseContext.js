import React, { createContext } from "react";
import firebaseApp from "firebase";
const FirebaseContext = createContext(null);
export { FirebaseContext };
export default ({ children }) => {
  if (!firebaseApp.apps.length) {
    firebaseApp.initializeApp({
      apiKey: "AIzaSyAz1CPymBALafFITccYDnyqa7Zw_R32K1c",
      authDomain: "chat-app-6a174.firebaseapp.com",
      projectId: "chat-app-6a174",
      storageBucket: "chat-app-6a174.appspot.com",
      messagingSenderId: "783762399629",
      appId: "1:783762399629:web:63c3e8f35722505770ddc4",
      measurementId: "G-HN15WYT1YN",
    });
  }
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
};
