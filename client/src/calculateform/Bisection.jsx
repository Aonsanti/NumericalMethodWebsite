import { useState } from "react";
import { evaluate } from "mathjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import "./Bisection.css";

export default function Bisection() {
  const [fx, setFx] = useState("");
  const [xl, setXl] = useState("");
  const [xr, setXr] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [, setError] = useState("");
  const [answer, setAnswer] = useState([]);
  const [bisection , setBisection] = useState({
    fx:"",
    xl:"",
    xr:"",
    tolerance:""
  })
  
  function problem(x) {
    return evaluate(bisection.fx, { x: x });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBisection((prev) => ({ ...prev, [name]: value }));
    switch (name) {
      case "fx":
        setFx(value);
        break;
      case "xl":
        setXl(value);
        break;
      case "xr":
        setXr(value);
        break;
      case "tolerance":
        setTolerance(value);
        break;
      default:
        break;
    }
  }
  
 const handleClick = async (e) => {
    e.preventDefault(); // แก้ไขการสะกด
    try {
      await axios.post("http://localhost:8080/bisection", bisection);
      console.log("Save success");
      alert("Problem already save ,Please check in History");
    } catch (err) {
      console.log(err);
      setError("Failed to save data to database");
    }
 };
 
function calculate() {
    let xL = parseFloat(xl);
    let xR = parseFloat(xr);
    let tol = parseFloat(tolerance) || 0.0001;

    let xM = 0;
    let oldX = 0;
    let err = 1;
    let iter = 0;
    let result = [];

    while (err > tol && iter < 50) {
      oldX = xM;
      xM = (xL + xR) / 2.0;

      if (problem(xM) * problem(xR) > 0) {
        xR = xM;
      }else{
        xL = xM;
      }

      if (iter > 0) {
        err = Math.abs((xM - oldX) / xM);
      }

      result.push({
        iteration: iter + 1,
        xL: xL.toFixed(6),
        xR: xR.toFixed(6),
        xM: xM.toFixed(6),
        error: err.toFixed(6),
      });

      iter++;
    }
    setError(err);
    setAnswer(result);
  }

  return (
    <div>
      <div className="Formcontainer">
        <div className="nameHeader">
          <div>Function f(x)</div>
          <div>Lower bound (xL)</div>
          <div>Upper bound (xR)</div>
          <div>Tolerance (Error)</div>
        </div>
        <div className="data">
          <input placeholder="Function" name="fx" value={fx} onChange={handleChange}/>
          <input placeholder="Value of XL" name="xl" value={xl} onChange={handleChange}/>
          <input placeholder="Value of XR" name="xr" value={xr} onChange={handleChange}/>
          <input placeholder="Error tolerance" name="tolerance" value={tolerance} onChange={handleChange}/>
        </div>
        <span className="button">
          <button className="confirm" onClick={calculate}>Confirm</button>
          <button className="saveproblem" onClick={handleClick}>Save Problem</button>
        </span>
      </div>

      {answer.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>xL</th>
                <th>xR</th>
                <th>xM</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {answer.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.iteration}</td>
                  <td>{row.xL}</td>
                  <td>{row.xR}</td>
                  <td>{row.xM}</td>
                  <td>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={answer}>
                <CartesianGrid strokeDasharray={"0 0"}/>
                <XAxis dataKey="iteration"/>
                <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="xM" stroke="#0000ff" name="xM" />
                <Line type="monotone" dataKey="error" stroke="#ff0000" name="Error" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
