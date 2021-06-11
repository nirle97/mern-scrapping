import "./App.css";
import { useContext, useEffect, useState } from "react";
import Table from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import Chart from "../Chart/Chart";
import Alert from "../Alert/Alert";
import axios from "axios";
import { AppContext } from "../../AppContext";
const baseUrl = "http://localhost:8080";
function App() {
  const { pastesContext } = useContext(AppContext);
  const [allPastes, setAllPastes] = pastesContext.fetchedPasted;
  const [, setPastesToShow] = pastesContext.toShowPastes;
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(true);

  function addSerialNumber(pastes) {
    for (let i = 0; i < pastes.length; i++) {
      pastes[i].number = i + 1;
    }
    return pastes;
  }

  const getPastesData = async () => {
    try {
      const { data: pastes } = await axios.get(`${baseUrl}/pastes`);
      setAllPastes([...addSerialNumber(pastes)]);
      setPastesToShow([...[...addSerialNumber(pastes)]]);
      const { data: analyticsData } = await axios.get(`${baseUrl}/analytics`);
      setChartsData(analyticsData);
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(async () => {
    await getPastesData();
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
            <h1>The Scrapper's Analyzes</h1>
            <Alert />
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
