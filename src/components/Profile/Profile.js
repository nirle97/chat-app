import { FirebaseContext } from "../../FirebaseContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./profile.css";
import { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../AppContext";
import Messeges from "../../Messeges/Messeges";
import ChatsRoom from "../ChatsRoom/ChatsRoom";
import RoomSetting from "../RoomSetting/RoomSetting";

function Profile() {
  const firebase = useContext(FirebaseContext);
  const { userAuth, roomObj } = useContext(AppContext);
  const [user] = userAuth;
  const [currentRoomObj] = roomObj;
  const scrollDown = useRef();
  const [formValue, setFormValue] = useState("");
  const [chatRoomSettings, setChatRoomSettings] = useState(false);
  const [userName, setUserName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const messagesRef = firebase.firestore().collection("messages");
  const messageQuery = messagesRef.orderBy("createdAt", "asc").limitToLast(25);
  const [messages] = useCollectionData(messageQuery, { idField: "id" });
  const usersDocRef = firebase
    .firestore()
    .collection("users")
    .doc(`${user.uid}`);

  const chatRoomsRef = firebase.firestore().collection("chatRooms");
  const roomsQuery = chatRoomsRef.orderBy("createdAt", "desc");

  const [rooms] = useCollectionData(roomsQuery, { idField: "id" });
  const [setMsgs] = useState([]);
  const lastMsgsByRoom = filterLastMsg(messages);

  useEffect(() => {
    usersDocRef.get().then((doc) => {
      doc.data().userName
        ? setUserName(doc.data().userName)
        : setUserName(user.displayName);
      setImgUrl(doc.data().profileImgUrl);
    });
  }, []);

  const sendMsg = async (e) => {
    e.preventDefault();
    await messagesRef.add({
      uid: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text: formValue,
      chatRoomId: currentRoomObj.id,
      userName: user.displayName ? user.displayName : userName,
      imgUrl: imgUrl ? imgUrl : null,
    });
    setFormValue("");
    scrollDown.current.scrollIntoView({ behavior: "smooth" });
  };
  function filterLastMsg(msgs) {
    if (!msgs) return;
    let msgsWithDate = msgs.slice();
    msgsWithDate = msgsWithDate.sort((msgA, msgB) => {
      if (!msgA.createdAt) return;
      return msgB.createdAt.seconds - msgA.createdAt.seconds;
    });
    let lastMsgsByRoom = msgsWithDate.filter(
      (v, i, a) => a.findIndex((t) => t.chatRoomId === v.chatRoomId) === i
    );
    return lastMsgsByRoom;
  }
  return (
    <div className="chat-container">
      <header>
        <h3 className="title-header">
          We <span>Talk</span> - signed in as {user.email}
          {currentRoomObj.name && ` | Room: ${currentRoomObj.name}`}
        </h3>
        <span className="log-out-btn" onClick={() => firebase.auth().signOut()}>
          Log Out
          <i className="fas fa-sign-out-alt"></i>
        </span>
      </header>

      <div className="msg-div">
        {currentRoomObj.id && (
          <Messeges messages={messages} setMsgs={setMsgs} />
        )}
        <div ref={scrollDown}></div>
        <form onSubmit={sendMsg} className="msg-form">
          <input
            className="msg-input"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!formValue && !currentRoomObj.id}
          >
            Send
          </button>
        </form>
      </div>
      <div className="chat-room-div">
        <button
          onClick={() => setChatRoomSettings((prev) => !prev)}
          className="start-room-btn btn btn-outline-secondary"
        >
          {chatRoomSettings ? "Close" : "Open"} Chat Room Options
        </button>
        {chatRoomSettings && (
          <RoomSetting setChatRoomSettings={setChatRoomSettings} />
        )}
        {rooms?.map((room) => {
          return room.participants.map((email) => {
            if (email === user.email) {
              return lastMsgsByRoom.map((msg) => {
                if (room.id === msg.chatRoomId) {
                  return <ChatsRoom key={room.id} room={room} lastMsg={msg} />;
                }
              });
            }
          });
        })}
      </div>
    </div>
  );
}

export default Profile;
