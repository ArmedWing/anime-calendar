import React, { createContext } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children, search, animeData, setData, singleData, setSingle }) => (
  <SearchContext.Provider value={{ search, animeData, setData, singleData, setSingle }}>
    {children}
  </SearchContext.Provider>
);

export default SearchProvider;