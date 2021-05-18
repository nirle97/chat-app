import "./chatsRoom.css";
import { AppContext } from "../../AppContext";
import { useContext } from "react";

function ChatsRoom({ room, lastMsg }) {
  const { roomObj } = useContext(AppContext);
  const [, setCurrentRoomObj] = roomObj;
  const date = (timeStamp) => (timeStamp ? new Date(timeStamp.toDate()) : null);

  const chooseRoom = () => {
    setCurrentRoomObj(room);
  };

  return (
    <>
      <div onClick={chooseRoom} className={`room-container`}>
        <h4 className="room-name">
          {room.name} - <span>{room.description}</span>
        </h4>
        <h6 className="room-last-msg">
          {lastMsg && (
            <>
              {lastMsg.userName}: {lastMsg.text} |{" "}
              {date(lastMsg.createdAt) &&
                `${date(lastMsg.createdAt).getHours()}:${
                  date(lastMsg.createdAt).getMinutes() < 10 ? "0" : ""
                }${date(lastMsg.createdAt).getMinutes()}
      `}
            </>
          )}
        </h6>
      </div>
    </>
  );
}

export default ChatsRoom;
