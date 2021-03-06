import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [allPastes, setAllPastes] = useState([]);
  const [pastesToShow, setPastesToShow] = useState(allPastes);
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [chartsData, setChartsData] = useState({});

  return (
    <AppContext.Provider
      value={{
        pastesContext: {
          fetchedPasted: [allPastes, setAllPastes],
          toShowPastes: [pastesToShow, setPastesToShow],
          charts: [chartsData, setChartsData],
        },
        searchResults: [isSearchResults, setIsSearchResults],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
