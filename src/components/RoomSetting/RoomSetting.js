import "./roomSetting.css";
import { FirebaseContext } from "../../FirebaseContext";
import React, { useState, useRef, useContext } from "react";

function RoomSetting({ setChatRoomSettings }) {
  const firebase = useContext(FirebaseContext);
  const particNum = useRef();
  const roomName = useRef();
  const roomDesc = useRef();
  const praticEmail1 = useRef();
  const praticEmail2 = useRef();
  const praticEmail3 = useRef();
  const emails = [praticEmail1, praticEmail2, praticEmail3];
  const chatRoomsRef = firebase.firestore().collection("chatRooms");

  const [addPrtic, setAddprtic] = useState(false);
  const addPrticFunc = (e) => {
    e.preventDefault();
    setAddprtic(true);
  };
  const submitRoom = async (e) => {
    e.preventDefault();
    let validEmails = [];
    emails.forEach((email, i) => {
      if (!email.current) {
        emails.splice(i, 1);
      } else {
        validEmails.push(
          email.current.value,
          firebase.auth().currentUser.email
        );
      }
    });
    await chatRoomsRef.add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      name: roomName.current.value,
      description: roomDesc.current.value,
      participants: validEmails,
    });
    setChatRoomSettings(false);
  };

  return (
    <>
      <form className="input-group mb-3" onSubmit={(e) => submitRoom(e)}>
        <span className="input-group-text name-span" id="addon-wrapping">
          Name
        </span>
        <input
          ref={roomName}
          className="form-control input-name"
          placeholder="Room's Name"
          required
        />
        <span className="input-group-text desc-span" id="addon-wrapping">
          Description
        </span>
        <input
          ref={roomDesc}
          className="form-control input-desc"
          placeholder="Room's Description"
          maxLength="20"
        />
        <span className="input-group-text participants" id="addon-wrapping">
          Invited
        </span>
        <select
          onChange={() => setAddprtic((prev) => !prev)}
          className="form-select"
          id="inputGroupSelect04"
          ref={particNum}
          name="participants"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button
          onClick={(e) => addPrticFunc(e)}
          className="btn btn-outline-warning"
        >
          Set
        </button>
        {addPrtic &&
          [...Array(Number(particNum.current.value))].map((n, i) => {
            let refMail;
            switch (i) {
              case 0:
                refMail = emails[0];
                break;
              case 1:
                refMail = emails[1];
                break;
              case 2:
                refMail = emails[2];
                break;
            }
            return (
              <input
                ref={refMail}
                key={i}
                id={`partic-email-${i + 1}`}
                type="email"
                placeholder="Participant's Email"
                required
              />
            );
          })}
        <button className="btn btn-outline-success" type="submit">
          Start a Room
        </button>
      </form>
    </>
  );
}
export default RoomSetting;
