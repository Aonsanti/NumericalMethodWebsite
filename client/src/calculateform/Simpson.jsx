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
  ResponsiveContainer
} from "recharts";
import "./Simpson.css";

export default function SimpsonRule() {
  const [fx, setFx] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState([]);
  const [integral, setIntegral] = useState(null);
  const [, setError] = useState("");

  const [simpson, setSimpson] = useState({
    fx: "",
    a: "",
    b: "",
    n: "",
  });

  function f(x) {
    return evaluate(simpson.fx, { x });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSimpson((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fx":
        setFx(value);
        break;
      case "a":
        setA(value);
        break;
      case "b":
        setB(value);
        break;
      case "n":
        setN(value);
        break;
      default:
        break;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/simpson", simpson);
      alert("Problem saved successfully! Check in History.");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database");
    }
  };

  function calculate() {
    let A = parseFloat(a);
    let B = parseFloat(b);
    let N = parseInt(n);

    if (N % 2 !== 0) {
      alert("⚠️ จำนวน n ต้องเป็นเลขคู่สำหรับ Simpson’s Rule!");
      return;
    }

    let h = (B - A) / N;
    let xi = [];
    let yi = [];
    let sumOdd = 0;
    let sumEven = 0;

    for (let i = 0; i <= N; i++) {
      let x = A + i * h;
      xi.push(x);
      yi.push(f(x));
      if (i !== 0 && i !== N) {
        if (i % 2 === 0) sumEven += f(x);
        else sumOdd += f(x);
      }
    }

    let I = (h / 3) * (f(A) + f(B) + 4 * sumOdd + 2 * sumEven);
    setIntegral(I.toFixed(6));

    let data = xi.map((x, i) => ({
      step: i,
      x: x.toFixed(6),
      fx: yi[i].toFixed(6),
    }));

    setResult(data);
  }

  return (
    <div className="trap-container">
      <div className="trap-inputs">
        <input
          name="fx"
          value={fx}
          onChange={handleChange}
          placeholder="Enter f(x)"
        />
        <input
          name="a"
          value={a}
          onChange={handleChange}
          placeholder="Lower limit (a)"
          type="number"
        />
        <input
          name="b"
          value={b}
          onChange={handleChange}
          placeholder="Upper limit (b)"
          type="number"
        />
        <input
          name="n"
          value={n}
          onChange={handleChange}
          placeholder="Number of intervals (even only)"
          type="number"
        />
      </div>

      <div className="trap-buttons">
        <button className="confirm" onClick={calculate}>
          Confirm
        </button>
        <button className="saveproblem" onClick={handleClick}>
          Save Problem
        </button>
      </div>

      {integral && (
        <div className="trap-result">
          <h3>Result:</h3>
          <p>Integral ≈ <b>{integral}</b></p>
        </div>
      )}

      {result.length > 0 && (
        <div className="trap-table">
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>x</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {result.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.step}</td>
                  <td>{row.x}</td>
                  <td>{row.fx}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={result}>
                <CartesianGrid strokeDasharray="0 0" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fx" stroke="#0000ff" name="f(x)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
