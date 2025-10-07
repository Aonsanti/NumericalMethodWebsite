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

export default function Graphical() {
  const [graphical, setGraphical] = useState({
    fx: "",
    xstart: "",
    xend: ""
  });
  const [answer, setAnswer] = useState([]);
  const [root, setRoot] = useState(null);

  function f(x) {
    return evaluate(graphical.fx, { x: x });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGraphical((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/graphical", graphical);
      console.log("Save success");
      alert("Problem already saved. Please check in History");
    } catch (err) {
      console.log(err);
    }
  };

  function calculate() {
    let xStart = parseFloat(graphical.xstart);
    let xEnd = parseFloat(graphical.xend);
    if (isNaN(xStart) || isNaN(xEnd) || !graphical.fx) {
      alert("Please enter function, start, and end values!");
      return;
    }

    let y = null;
    let z = null;
    let rootValue = null;
    let result = [];

    for (let x = xStart; x <= xEnd; x += 1) {
      const f1 = f(x);
      const f2 = f(x + 1);
      result.push({
        x: x.toFixed(4),
        fx: f1.toFixed(6)
      });
      if (f1 * f2 < 0) {
        y = x;
        z = x + 1;
      }
    }

    if (y !== null && z !== null) {
      for (let x = y; x <= z; x += 0.000001) {
        const fval = f(x);
        if (fval >= 0) {
          rootValue = x;
          break;
        }
      }
    }
    setAnswer(result);
    setRoot(rootValue);
  }

  return (
    <div>
      <div className="Formcontainer">
        <div className="nameHeader">
          <div>Function f(x)</div>
          <div>Start (x)</div>
          <div>End (x)</div>
        </div>

        <div className="data">
          <input placeholder="Function" name="fx" value={graphical.fx} onChange={handleChange} />
          <input placeholder="Start x" name="xstart" value={graphical.xstart} onChange={handleChange} />
          <input placeholder="End x" name="xend" value={graphical.xend} onChange={handleChange} />
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
                <th>x</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {answer.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.x}</td>
                  <td>{row.fx}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={answer}>
                <CartesianGrid strokeDasharray="0 0" />
                <XAxis dataKey="x" label={{ value: "x", position: "insideBottom" }} />
                <YAxis label={{ value: "f(x)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="fx" stroke="#00bcd4" name="f(x)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <h4 style={{ color: "red" }}> x ≈ {parseFloat(root).toFixed(6)}</h4>
          </div>
        </div>
      )}
    </div>
  );
}