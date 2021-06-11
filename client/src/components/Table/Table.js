import "./table.css";
import { useState, useRef, useContext } from "react";
import * as reactBts from "react-bootstrap";
import { AppContext } from "../../AppContext";
import Paste from "../Paste/Paste";

function Table() {
  const { pastesContext, searchResults } = useContext(AppContext);
  const [numberOfPastesToShow, setNumberOfPastesToShow] = useState(5);
  const [isSearchResults] = searchResults;
  const [pastesToShow, setPastesToShow] = pastesContext.toShowPastes;

  const showMorePastes = (e) => {
    console.log(12);
    if (numberOfPastesToShow >= pastesToShow.length) {
      e.target.disabled = true;
      return;
    }
    setNumberOfPastesToShow((prev) => prev + 5);
  };

  return (
    <div className="Table-container">
      {isSearchResults ? (
        <div className="Table-no-res">No Results ...</div>
      ) : (
        <>
          <div className="Table-table">
            <reactBts.Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Author</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pastesToShow.map((paste, i) => {
                  if (i < numberOfPastesToShow) {
                    return <Paste key={i} paste={paste} />;
                  }
                })}
              </tbody>
            </reactBts.Table>
          </div>
          <div>
            <reactBts.Button
              variant="primary"
              size="sm"
              id="Table-show-more-btn"
              disabled={false}
              onClick={(e) => showMorePastes(e)}
            >
              show more...
            </reactBts.Button>
            <reactBts.Button
              variant="primary"
              size="sm"
              className="Table-show-all-btn"
              onClick={() => setNumberOfPastesToShow(pastesToShow.length)}
            >
              show all pastes
            </reactBts.Button>
            <reactBts.Button
              variant="primary"
              size="sm"
              onClick={() => setNumberOfPastesToShow(5)}
            >
              show less
            </reactBts.Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Table;
