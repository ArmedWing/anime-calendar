import React, { createContext, useState } from "react";

export const HomePageContext = createContext();

export const HomePageProvider = ({ children }) => {
  const [homePageResults, setHomePageResults] = useState([]);

  return (
    <HomePageContext.Provider value={{ homePageResults, setHomePageResults }}>
      {children}
    </HomePageContext.Provider>
  );
};
