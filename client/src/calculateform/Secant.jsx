import { useState } from "react";
import { evaluate } from "mathjs";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Secant() {
  const [fx, setFx] = useState("");
  const [x0, setX0] = useState("");
  const [x1, setX1] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [answer, setAnswer] = useState([]);
  const [, setError] = useState("");
  const [secant, setSecant] = useState({
    fx: "",
    x0: "",
    x1: "",
    tolerance: "",
  });

  function f(x) {
    try {
      return evaluate(secant.fx, { x: x });
    } catch (e) {
      console.error("Error evaluating function:", e);
      return NaN;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSecant((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fx":
        setFx(value);
        break;
      case "x0":
        setX0(value);
        break;
      case "x1":
        setX1(value);
        break;
      case "tolerance":
        setTolerance(value);
        break;
      default:
        break;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/secant", secant);
      alert("Problem already saved, please check in History");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database");
    }
  };

  function calculate() {
    let x0Val = parseFloat(x0);
    let x1Val = parseFloat(x1);
    let epsilon = parseFloat(tolerance) || 0.000001;
    let iteration = 0;
    let x2 = 0;
    let result = [];

    while (true) {
      let f0 = f(x0Val);
      let f1 = f(x1Val);

      x2 = x1Val - (f1 * (x1Val - x0Val)) / (f1 - f0);
      iteration++;

      let error = Math.abs(x2 - x1Val);

      result.push({
        iteration: iteration,
        x0: x0Val.toFixed(6),
        x1: x1Val.toFixed(6),
        x2: x2.toFixed(6),
        error: error.toFixed(8),
      });

      if (error < epsilon || iteration > 50) {
        break;
      }

      x0Val = x1Val;
      x1Val = x2;
    }

    setAnswer(result);
    setError(result[result.length - 1] ?.error);
  }

  return (
    <div>
      <div className="Formcontainer">
        <div className="nameHeader">
          <div>Function f(x)</div>
          <div>Initial x0</div>
          <div>Initial x1</div>
          <div>Tolerance (Error)</div>
        </div>

        <div className="data">
          <input placeholder="Function" name="fx" value={fx} onChange={handleChange}/>
          <input placeholder="Value of x0" name="x0" value={x0} onChange={handleChange}/>
          <input placeholder="Value of x1" name="x1" value={x1} onChange={handleChange}/>
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
                <th>x0</th>
                <th>x1</th>
                <th>x2 (New)</th>
                <th>Error</th>s
              </tr>
            </thead>
            <tbody>
              {answer.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.iteration}</td>
                  <td>{row.x0}</td>
                  <td>{row.x1}</td>
                  <td>{row.x2}</td>
                  <td>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={answer}>
                <CartesianGrid strokeDasharray="0 0" />
                <XAxis dataKey="iteration" />
                <YAxis label={{value: "Value",angle: -90,position: "insideLeft",}}/>
                <Tooltip contentStyle={{backgroundColor: "#1F2937",border: "1px solid #374151",borderRadius: "8px",color: "#fff",}}/>
                <Legend />
                <Line type="monotone" dataKey="x2" stroke="#0000ff" name="x₂ (Result)"/>
                <Line type="monotone" dataKey="error" stroke="#ff0000" name="Error"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
