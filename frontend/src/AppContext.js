import { useReducer } from "react";

import React from "react";

const NewAppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "appName":
      return { ...state, appName: action.value };
    case "appDescription":
      return { ...state, appDescription: action.value };
    case "logo":
      return { ...state, logo: action.value };
    case "playlists":
      return { ...state, playlists: action.value };
    case "step":
      return { ...state, step: action.value };
  }
};
const NewAppProvider = ({ children }) => {
  const initialState = {
    appName: null,
    appDescription: null,
    logo: null,
    playlists: { audio: [], video: [] },
    step: 1,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NewAppContext.Provider
      value={{
        values: state,
        setValue: (type, value) => dispatch({ type: type, value: value }),
      }}
    >
      {children}
    </NewAppContext.Provider>
  );
};

const useNewApp = () => {
  return React.useContext(NewAppContext);
};

export { NewAppProvider, NewAppContext, useNewApp };
