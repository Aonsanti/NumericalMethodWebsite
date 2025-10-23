import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Charpter_Content = {
  "Root of Equation": ["Graphical", "Bisection", "False Position","NewtonRaphson","OnePoint","Secant"],
  "Linear Algebra": ["Cramer's Rule","Matrix Inversion" , "Gaussian Elimination","Gauss Jordan", "LU Decomposition","Choleskey Decomposition","Jacobi Iteration" , "Gauss Seidal Iteration" , "Conjugate Gradient" ],
  "Interpolation":["Newton's Divied Difference","Lagrange Polynomials","Spline Interpolation"],
  "Extrapolation":["Simple Regression","Multiple Regression"],
  "Integration":["Trapezoidal","Simpson","Composite Trapezoidal","Composite Simpson"]
  ,"Differentiation":["Differentiation"]
};

const pathMap = {
  "History": "/history",
  "Graphical": "/graphical",
  "Bisection": "/bisection",
  "False Position": "/false-position",
  "NewtonRaphson":"/newtonraphson",
  "OnePoint":"/onepoint",
  "Secant":"/secant",

  "Cramer's Rule": "/cramer's-rule",
  "Matrix Inversion": "/matrix-inversion",
  "Gaussian Elimination": "/gaussian-elimination",
  "Gauss Jordan": "/gauss-jordan",
  "LU Decomposition": "/lu-decomposition",
  "Choleskey Decomposition": "/choleskey-decomposition",
  "Jacobi Iteration" : "/jacobi-iteration",
  "Gauss Seidal Iteration" : "/gauss-seidal-iteration",
  "Conjugate Gradient" : "/conjugate-gradient",

  "Newton's Divied Difference":"/newton-divied-difference",
  "Lagrange Polynomials":"/lagrange-polynomials",
  "Spline Interpolation":"/spline-interpolation",

  "Simple Regression":"/simple-regression",
  "Multiple Regression":"/multiple-regression",

  "Trapezoidal":"/trapezoidal",
  "Simpson":"/simpson",
  "Composite Trapezoidal":"/composite-trapezoidal",
  "Composite Simpson":"/composite-simpson", 
  
  "Differentiation":"/differentiation",

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
