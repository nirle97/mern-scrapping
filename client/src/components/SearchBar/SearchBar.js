import React, { useState, useEffect, useContext, useRef } from "react";
import useDebounce from "./use-debounce";
import { AppContext } from "../../AppContext";
import * as reactBts from "react-bootstrap";

import "./searchBar.css";
export default function SearchBar() {
  const { pastesContext, searchResults } = useContext(AppContext);
  const [pastesToShow, setPastesToShow] = pastesContext.toShowPastes;
  const [allPastes, setAllPastes] = pastesContext.fetchedPasted;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [, setIsSearchResults] = searchResults;
  const searchTypeBtn = useRef();
  const searchCharacters = (type, text) => {
    return [...pastesToShow].filter((paste) => {
      if (type === "number") {
        if (paste.number === Number(text)) return true;
      } else {
        return paste.title.toLowerCase().includes(text);
      }
    });
  };
  const changeSearchType = () => {
    const btn = searchTypeBtn.current;
    if (btn.id) {
      btn.id = "";
      btn.value = 0;
    } else {
      btn.id = "SearchBar-btn";
      btn.value = 1;
    }
  };
  useEffect(() => {
    if (debouncedSearchTerm) {
      const searchType =
        searchTypeBtn.current.value === "1" ? "number" : "title";
      const results = searchCharacters(searchType, debouncedSearchTerm);
      if (!results.length) {
        setIsSearchResults(true);
      } else {
        setIsSearchResults(false);
        setPastesToShow(results);
      }
    } else {
      setPastesToShow([...allPastes]);
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
        <reactBts.Button
          variant="primary"
          size="sm"
          className="SearchBar-btn"
          ref={searchTypeBtn}
          onClick={changeSearchType}
          value={0}
        >
          By #Number
        </reactBts.Button>
      </reactBts.InputGroup>
    </div>
  );
}
