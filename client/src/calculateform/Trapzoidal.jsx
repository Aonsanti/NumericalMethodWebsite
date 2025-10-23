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
  Area,
  AreaChart,
} from "recharts";
import "./Trapzoidal.css";

export default function Trapezoidal() {
  const [fx, setFx] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [dataGraph, setDataGraph] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fx") setFx(value);
    else if (name === "a") setA(value);
    else if (name === "b") setB(value);
    else if (name === "n") setN(value);
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/trapezoidal", {
        fx,
        a,
        b,
        n,
      });
      alert("Problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save problem.");
    }
  };

  const calculate = () => {
    try {
      const func = (x) => evaluate(fx, { x });
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const nNum = parseInt(n);

      if (isNaN(aNum) || isNaN(bNum) || isNaN(nNum) || !fx) {
        setError("Invalid input values!");
        return;
      }

      const h = (bNum - aNum) / nNum;
      let sum = 0;
      const points = [];

      for (let i = 0; i <= nNum; i++) {
        const x = aNum + i * h;
        const y = func(x);
        points.push({ x, y });

        if (i === 0 || i === nNum) sum += y;
        else sum += 2 * y;
      }

      const integral = (h / 2) * sum;

      setResult(integral);
      setDataGraph(points);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error calculating integration!");
    }
  };

  return (
    <div className="trap-container">
      <div className="trap-input-section">
        <div className="input-group">
          <label>f(x)</label>
          <input
            type="text"
            name="fx"
            placeholder="Enter function e.g. x^2 + 2*x + 1"
            value={fx}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>a (lower bound)</label>
          <input
            type="number"
            name="a"
            placeholder="Start"
            value={a}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>b (upper bound)</label>
          <input
            type="number"
            name="b"
            placeholder="End"
            value={b}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>n (intervals)</label>
          <input
            type="number"
            name="n"
            placeholder="Number of intervals"
            value={n}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="trap-buttons">
        <button onClick={calculate} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result !== null && (
        <div className="trap-result">
          <h3>Result</h3>
          <p>
            ∫ f(x) dx ≈ <b>{result.toFixed(6)}</b>
          </p>
        </div>
      )}

      {dataGraph.length > 0 && (
        <div className="trap-graph">
          <h3>Graph of f(x)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dataGraph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="y"
                stroke="#3b82f6"
                fill="#60a5fa"
                fillOpacity={0.3}
                name="f(x)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
