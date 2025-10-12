import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Charpter_Content = {
  "Root of Equation": ["Graphical", "Bisection", "False Position","NewtonRaphson","OnePoint","Secant"],
  "Linear Algebra": ["Gaussian Elimination", "LU Decomposition", "Matrix Inverse"]
};

const pathMap = {
  "History": "/history",
  "Graphical": "/graphical",
  "Bisection": "/bisection",
  "False Position": "/false-position",
  "NewtonRaphson":"/newtonraphson",
  "OnePoint":"/onepoint",
  "Secant":"/secant",
  "Gaussian Elimination": "/gaussian-elimination",
  "LU Decomposition": "/lu-decomposition",
  "Matrix Inverse": "/matrix-inverse",
};

export default function Header() {
  const [charpter, setCharpter] = useState("Root of Equation");
  const [content, setContent] = useState("");
  const headerText = content || charpter;
  const navigate = useNavigate();

  const ChangeChapter = (e) => {
    setCharpter(e.target.value);
    setContent("");
  };

  const ChangeContent = (e) => {
    const value = e.target.value;
    setContent(value);
    if (pathMap[value]) {
      navigate(pathMap[value]);
    }
  };

  const goToHistory = () => {
    navigate(pathMap["History"]);
  };

  return (
    <div className="Headercontainer">
      <div className="header-placeholder"></div>
      <div className="title">
        <h1>{headerText}</h1>
      </div>
      <div className="btn">
      
        <select value={charpter} onChange={ChangeChapter}>
          {Object.keys(Charpter_Content).map((ch) => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>

        <select value={content} onChange={ChangeContent}>
        <option hidden value="">Select Charpter</option>
          {Charpter_Content[charpter].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="History" onClick={goToHistory}>History</button>
      </div>
    </div>
  );
}
