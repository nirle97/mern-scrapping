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
  const [, setAllPastes] = pastesContext.fetchedPasted;
  const [, setPastesToShow] = pastesContext.toShowPastes;
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(true);

  const getPastesData = async () => {
    try {
      const { data: pastes } = await axios.get(`${baseUrl}/pastes`);
      setAllPastes(pastes);
      setPastesToShow(pastes);
      const { data: analyticsData } = await axios.get(`${baseUrl}/analytics`);
      setChartsData(analyticsData);
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(async () => {
    await getPastesData();
    const interavl = setInterval(() => {
      console.log("Fetching Pastes");
      getPastesData();
    }, 86400);
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
