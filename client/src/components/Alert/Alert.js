import React, { useEffect, useState, useContext } from "react";
import socketClient from "socket.io-client";
import axios from "axios";
import "./alert.css";
import { AppContext } from "../../AppContext";
const baseUrl = "http://localhost:8080";

export default function Alert() {
  const { pastesContext } = useContext(AppContext);
  const [pastesToShow, setPastesToShow] = pastesContext.toShowPastes;
  const [allPastes, setAllPastes] = pastesContext.fetchedPasted;
  const [chartsData, setChartsData] = pastesContext.charts;
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [newAlertSign, setNewAlertSign] = useState(false);
  useEffect(() => {
    const socket = socketClient(baseUrl);
    socket.on("pasteAlert", (newPastes) => {
      setAllPastes([...allPastes, ...newPastes]);
      setPastesToShow([...pastesToShow, ...newPastes]);
      axios.get(`${baseUrl}/analytics`).then((res) => setChartsData(res.data));
      setNewAlertSign(true);
      const alertObj = {
        time: `${new Date().getHours()}:${
          (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes()
        }`,
        numOfPastes: newPastes.length,
      };
      setAlerts([...alerts, alertObj]);
    });
    return () => socket.disconnect();
  }, []);

  const openAlertsBell = () => {
    setShowAlerts((prev) => !prev);
    setNewAlertSign(false);
  };

  const deleteAlert = (e) => {
    const selectedAlert = e.target.parentNode;
    const selectedAlertTime =
      selectedAlert.nextElementSibling.nextElementSibling.innerText;
    for (let i = 0; i < alerts.length; i++) {
      if (alerts[i].time === selectedAlertTime) {
        alerts.splice(i, 1);
        setAlerts([...alerts]);
      }
    }
  };

  return (
    <div className="Alert-container">
      <span onClick={openAlertsBell} className="Alert-bell">
        <i className="fas fa-bell"></i>
      </span>
      {newAlertSign && <div className="Table-alerts-num">{alerts.length}</div>}
      {showAlerts && (
        <>
          {!alerts.length ? (
            <span className="Alert-no-alerts">No New Alerts</span>
          ) : (
            alerts.map((alert, i) => (
              <div key={i} className="Alert-alert-div">
                <span onClick={(e) => deleteAlert(e)} id="pastes-X">
                  <i className="fas fa-times-circle"></i>
                </span>
                <span id="pastes-num">{`The Scrapper Has Found ${alert.numOfPastes} new Pastes |`}</span>
                <span id="pastes-time">{alert.time}</span>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
