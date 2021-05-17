import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [user, setUser] = useState(null);
  const [currentRoomObj, setCurrentRoomObj] = useState({});
  return (
    <AppContext.Provider
      value={{
        userAuth: [user, setUser],
        roomObj: [currentRoomObj, setCurrentRoomObj],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
