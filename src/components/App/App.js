import "./App.css";
import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import SignPage from "../SignPage/SignPage";
import Profile from "../Profile/Profile";
import FirebaseProvider from "../../FirebaseContext";

function App() {
  const { userAuth } = useContext(AppContext);
  const [user] = userAuth;

  return (
    <div className="App">
      <FirebaseProvider>
        {user && user.emailVerified ? (
          <div className="main-screen-div">
            <Profile />
          </div>
        ) : (
          <div className="sign-up-in-div">
            <SignPage />
          </div>
        )}
      </FirebaseProvider>
    </div>
  );
}

export default App;
