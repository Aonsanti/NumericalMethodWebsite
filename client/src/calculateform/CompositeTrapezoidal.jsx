import { useState } from "react";
import { evaluate } from "mathjs";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CompositeTrapezoidal() {
  const [fx, setFx] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fx") setFx(value);
    if (name === "a") setA(value);
    if (name === "b") setB(value);
    if (name === "n") setN(value);
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/composite-trapezoidal", {
        fx,
        a,
        b,
        n,
      });
      alert("Composite Trapezoidal problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save problem to database.");
    }
  };

  const calculate = () => {
    try {
      const func = (x) => evaluate(fx, { x });
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const nNum = parseInt(n);

      if (isNaN(aNum) || isNaN(bNum) || isNaN(nNum) || !fx) {
        setError("⚠️ Invalid input values!");
        return;
      }

      const h = (bNum - aNum) / nNum;
      let sum = func(aNum) + func(bNum);
      const data = [];
      const stepDetails = [];

      for (let i = 1; i < nNum; i++) {
        const x = aNum + i * h;
        const y = func(x);
        sum += 2 * y;
        stepDetails.push({ i, x: x.toFixed(4), fxi: y.toFixed(6) });
        data.push({ x, y });
      }

      // เพิ่มจุดเริ่มต้นและจุดสุดท้ายลงกราฟ
      data.unshift({ x: aNum, y: func(aNum) });
      data.push({ x: bNum, y: func(bNum) });

      const integral = (h / 2) * sum;
      setResult(integral);
      setSteps(stepDetails);
      setGraphData(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("⚠️ Error calculating Composite Trapezoidal!");
    }
  };

  return (
    <div className="trap-container">
      {/* ===== Input Section ===== */}
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
            value={a}
            onChange={handleChange}
            placeholder="Start"
          />
        </div>
        <div className="input-group">
          <label>b (upper bound)</label>
          <input
            type="number"
            name="b"
            value={b}
            onChange={handleChange}
            placeholder="End"
          />
        </div>
        <div className="input-group">
          <label>n (intervals)</label>
          <input
            type="number"
            name="n"
            value={n}
            onChange={handleChange}
            placeholder="Number of subintervals"
          />
        </div>
      </div>

      {/* ===== Buttons ===== */}
      <div className="trap-buttons">
        <button className="confirm" onClick={calculate}>
          Calculate
        </button>
        <button className="saveproblem" onClick={handleSave}>
          Save Problem
        </button>
      </div>

      {/* ===== Error ===== */}
      {error && <div className="error">{error}</div>}

      {/* ===== Result Section ===== */}
      {result !== null && (
        <div className="trap-result">
          <h3>Result</h3>
          <p>
            ∫ f(x) dx ≈ <b>{result.toFixed(6)}</b>
          </p>
        </div>
      )}

      {/* ===== Table of steps ===== */}
      {steps.length > 0 && (
        <div className="trap-table">
          <h3>Calculation Steps</h3>
          <table>
            <thead>
              <tr>
                <th>i</th>
                <th>xᵢ</th>
                <th>f(xᵢ)</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, index) => (
                <tr key={index}>
                  <td>{s.i}</td>
                  <td>{s.x}</td>
                  <td>{s.fxi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Graph ===== */}
      {graphData.length > 0 && (
        <div className="trap-graph">
          <h3>Graph of f(x)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={graphData}>
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
