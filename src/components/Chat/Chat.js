import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import "./chat.css";

function Chat({ msg }) {
  console.log(msg);
  const { userAuth } = useContext(AppContext);
  const [user] = userAuth;
  const sender = msg.uid === user.uid ? "sent" : "received";
  const date = msg.createdAt ? new Date(msg.createdAt.toDate()) : null;
  return (
    <span className={`message ${sender}`}>
      <img
        className={`profile-img ${
          sender === "received" ? "rec-img" : "sent-img"
        }`}
        src={msg.imgUrl ? msg.imgUrl : null}
      />
      <span>
        {sender === "received" ? `${msg.userName}: ${msg.text}` : `${msg.text}`}
      </span>
      <span className="msg-time">
        {date &&
          `${date.getHours()}:${
            date.getMinutes() < 10 ? "0" : ""
          }${date.getMinutes()}
      `}
      </span>
    </span>
  );
}
export default Chat;
