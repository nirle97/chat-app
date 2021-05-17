import "./chatsRoom.css";
import { FirebaseContext } from "../../FirebaseContext";
import { AppContext } from "../../AppContext";
import { useContext, useRef } from "react";

function ChatsRoom({ room, msgs }) {
  const { roomObj } = useContext(AppContext);
  const [, setCurrentRoomObj] = roomObj;
  const roomTheme = useRef("");
  const date = (timeStamp) => (timeStamp ? new Date(timeStamp.toDate()) : null);

  const chooseRoom = () => {
    setCurrentRoomObj(room);
    roomTheme.current = "current-room";
  };
  return (
    <>
      <div
        onClick={chooseRoom}
        className={`room-container ${roomTheme.current}`}
      >
        <h4 className="room-name">
          {room.name} - <span>{room.description}</span>
        </h4>
        <h6>
          {/* {lastMsg.userName}: {lastMsg.text} |{" "} */}
          {/* {date(lastMsg.createdAt) &&
            `${date(lastMsg.createdAt).getHours()}:${
              date(lastMsg.createdAt).getMinutes() < 10 ? "0" : ""
            }${date(lastMsg.createdAt).getMinutes()}
      `} */}
        </h6>
      </div>
    </>
  );
}

export default ChatsRoom;
