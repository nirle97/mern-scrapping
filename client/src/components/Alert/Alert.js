import React, { useEffect, useState } from "react";
import socketClient from "socket.io-client";
const baseUrl = "http://localhost:8080";

export default function Alert() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const socket = socketClient(baseUrl);
    socket.on("pasteAlert", (data) => {
      setAlerts([...alerts, data]);
    });
    return () => socket.disconnect();
  }, []);
  return <div>{alerts[0]}</div>;
}
