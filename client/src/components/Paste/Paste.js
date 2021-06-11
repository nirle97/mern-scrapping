import React from "react";
import "./paste.css";
export default function Paste({ paste }) {
  return (
    <tr className="Paste-tr">
      <td>{paste.number}</td>
      <td>{paste.title}</td>
      <td>{paste.content}</td>
      <td>{paste.author}</td>
      <td>{paste.date}</td>
    </tr>
  );
}
