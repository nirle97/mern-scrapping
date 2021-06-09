import React, { useState, useEffect, useContext } from "react";
import useDebounce from "./use-debounce";
import { AppContext } from "../../AppContext";
import * as reactBts from "react-bootstrap";

import "./searchBar.css";
export default function SearchBar() {
  const { pastesContext, searchResults } = useContext(AppContext);
  const [pastesToShow, setPastesToShow] = pastesContext.toShowPastes;
  const [allPastes] = pastesContext.fetchedPasted;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [, setIsSearchResults] = searchResults;
  const searchCharacters = () => {
    return [...pastesToShow].filter((paste) =>
      paste.title.toLowerCase().includes(debouncedSearchTerm)
    );
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      const results = searchCharacters(debouncedSearchTerm);
      if (!results.length) {
        setIsSearchResults(true);
      } else {
        console.log(12);
        setPastesToShow(results);
        setIsSearchResults(false);
      }
    } else {
      setPastesToShow(allPastes);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="SearchBar-container">
      <reactBts.InputGroup size="lg">
        <reactBts.FormControl
          className="SearchBar-input"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          type="text"
          placeholder="Search a Paste..."
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
        />
      </reactBts.InputGroup>
    </div>
  );
}
