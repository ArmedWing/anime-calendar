import { createContext } from "react";

const SearchContext = createContext({
  animeData: [],
  singleData: {},
  search: () => {},
  setData: () => {},
  setSingle: () => {},
});

export default SearchContext;
