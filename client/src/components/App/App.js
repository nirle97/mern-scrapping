import "./App.css";
import { useContext, useEffect, useState } from "react";
import Table from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import Chart from "../Chart/Chart";
import axios from "axios";
import { AppContext } from "../../AppContext";

function App() {
  const { pastesContext } = useContext(AppContext);
  const [, setAllPastes] = pastesContext.fetchedPasted;
  const [, setPastesToShow] = pastesContext.toShowPastes;
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(false);

  const getPastes = async () => {
    try {
      setLoading(true);
      const { data: pastes } = await axios.get("http://localhost:8080/pastes");
      setAllPastes(pastes);
      setPastesToShow(pastes);
      setLoading(false);
      const { data: analyticsData } = await axios.get(
        "http://localhost:8080/analytics"
      );
      setChartsData(analyticsData);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    getPastes();
    const interavl = setInterval(() => {
      console.log("fetching pastes");
      getPastes();
    }, 864000);
    return () => clearInterval(interavl);
  }, []);

  return (
    <>
      {loading ? (
        <div className="App-spinner">
          <img alt="loading..." src="./images/spinner.gif" />
        </div>
      ) : (
        <div className="App">
          <>
            <Chart chartsData={chartsData} />
            <SearchBar />
            <Table />
          </>
        </div>
      )}
    </>
  );
}

export default App;
