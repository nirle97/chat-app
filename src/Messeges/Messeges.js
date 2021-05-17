import Chat from "../components/Chat/Chat";
import { FirebaseContext } from "../FirebaseContext";
import { useContext } from "react";
import { AppContext } from "../AppContext";

function Messeges({ messages }) {
  const { roomObj } = useContext(AppContext);
  const [currentRoomObj] = roomObj;
  // const messageQuery = messagesRef.orderBy("createdAt", "asc").limitToLast(25);
  // const [messages] = useCollectionData(messageQuery, { idField: "id" });

  return (
    <>
      {messages?.map((msg) => {
        if (msg.chatRoomId === currentRoomObj.id) {
          {
            /* setMsgs([...messages]); */
          }
          return <Chat key={msg.id} msg={msg} />;
        }
      })}
    </>
  );
}

export default Messeges;
