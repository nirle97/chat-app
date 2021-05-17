import { FirebaseContext } from "../../FirebaseContext";
import "./signPage.css";
import { useRef, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { Link, useHistory } from "react-router-dom";

function SignPage() {
  const firebase = useContext(FirebaseContext);
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const storage = firebase.storage();
  const [userName, setUserName] = useState("");
  const { userAuth } = useContext(AppContext);
  const [user, setUser] = userAuth;
  const email = useRef();
  const password = useRef();
  const [imgFile, setImgFile] = useState({});
  const [toRegister, setToRegister] = useState(false);
  const history = useHistory();

  auth.onAuthStateChanged((dataUser) => {
    if (dataUser) {
      setUser(dataUser);
      return;
    }
    setUser(null);
  });
  const providerSignUp = (method) => {
    let provider;
    if (method === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (method === "facebook") {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    auth.signInWithPopup(provider).then((cred) => {
      firestore.collection("users").doc(cred.user.uid).set({
        uid: cred.user.uid,
        userName: cred.user.displayName,
        email: cred.user.email,
        profileImgUrl: cred.user.photoURL,
        chatRooms: [],
      });
    });
  };
  const sign = () => {
    const userEmail = email.current.value;
    const userPass = password.current.value;
    if (toRegister) {
      if (Object.keys(imgFile).length === 0 && !userName)
        return alert("Please Fill All The Fields");
      auth
        .createUserWithEmailAndPassword(userEmail, userPass)
        .then((cred) => {
          updateProfileImg(imgFile, cred.user.uid);
          firestore.collection("users").doc(cred.user.uid).set({
            uid: cred.user.uid,
            userName: userName,
            email: userEmail,
            profileImgUrl: "",
            chatRooms: [],
          });
          cred.user
            .sendEmailVerification()
            .then(() => {
              alert("Verification Email Has Been Sent");
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => alert(e.message));
    } else {
      auth
        .signInWithEmailAndPassword(userEmail, userPass)
        .then((user) => {
          setUser(user);
        })
        .catch((e) => alert(e.message));
    }
  };

  const updateProfileImg = (file, uid) => {
    const uploadImg = storage.ref(`images/${file.name}`).put(file);
    uploadImg.on(
      "state_changed",
      (snapshot) => {},
      (error) => console.log(error),
      () => {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            firestore
              .collection("users")
              .doc(uid)
              .update({ profileImgUrl: url });
          });
      }
    );
  };

  return (
    <>
      <div className="sign-main-div">
        <h1 className="we-talk-h1">
          <span>We</span> <span id="talk">Talk</span>
        </h1>
        <div className="sign-in-div">
          <span className="sign-in-span">
            {toRegister ? "Sign Up" : "Sign In"}
          </span>
          <span className="logos">
            <span
              className="logo-sign-in-btn"
              onClick={() => providerSignUp("google")}
            >
              <i className="fab fa-google"></i>
            </span>
            <span
              className="logo-sign-in-btn"
              onClick={() => providerSignUp("facebook")}
            >
              <i className="fab fa-facebook"></i>
            </span>
          </span>
          <span className="mail-pass-span">Or Use Email & Password</span>
          <input
            ref={email}
            type="email"
            placeholder="E-mail"
            className="credentials"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="credentials"
          />
          {!toRegister && (
            <span
              className="no-account-span"
              onClick={() => setToRegister(true)}
            >
              Don't have an account? click <a>here</a>
            </span>
          )}
          {toRegister && (
            <>
              <input
                placeholder="UserName"
                className="credentials"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <span>
                <label className="choose-image-label">
                  Choose a Profile Picture
                </label>
                <input
                  id="file-input"
                  type="file"
                  className="credentials"
                  onChange={(e) => {
                    setImgFile(e.target.files[0]);
                  }}
                  required
                />
              </span>
            </>
          )}
          <button onClick={(e) => sign(e)} id="sign-in-btn">
            {toRegister ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </>
  );
}

export default SignPage;
