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
  ReferenceLine,
} from "recharts";
import "./Trapzoidal.css";

export default function NumericalDifferentiation() {
  const [fx, setFx] = useState("");
  const [x0, setX0] = useState("");
  const [h, setH] = useState("");
  const [method, setMethod] = useState("central");
  const [result, setResult] = useState(null);
  const [table, setTable] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState("");

  // Evaluate safe wrapper
  const f = (x) => evaluate(fx, { x });

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/numerical-diff", {
        fx,
        x0,
        h,
        method,
      });
      alert("Problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save problem to database.");
    }
  };

  const calculate = () => {
    try {
      const a = parseFloat(x0);
      const hNum = parseFloat(h);
      if (!fx || isNaN(a) || isNaN(hNum) || hNum === 0) {
        setError("กรุณากรอก f(x), x0 และ h ให้ถูกต้อง (h ≠ 0)");
        return;
      }

      // Prepare sample points around x0 for table/graph (from x0-3h to x0+3h)
      const samples = [];
      for (let k = -3; k <= 3; k++) {
        const xi = a + k * hNum;
        let yi;
        try {
          yi = f(xi);
          if (!isFinite(yi)) yi = NaN;
        } catch {
          yi = NaN;
        }
        samples.push({ k, x: xi, fx: yi });
      }

      // Compute derivative according to method at x0
      let derivative;
      if (method === "forward") {
        const y0 = f(a);
        const y1 = f(a + hNum);
        derivative = (y1 - y0) / hNum;
      } else if (method === "backward") {
        const y0 = f(a);
        const y_1 = f(a - hNum);
        derivative = (y0 - y_1) / hNum;
      } else if (method === "central") {
        // 2nd order central
        const y1 = f(a + hNum);
        const y_1 = f(a - hNum);
        derivative = (y1 - y_1) / (2 * hNum);
      } else if (method === "central4") {
        // 4th order central: (-f(x+2h)+8f(x+h)-8f(x-h)+f(x-2h)) / (12h)
        const y2 = f(a + 2 * hNum);
        const y1 = f(a + hNum);
        const y_1 = f(a - hNum);
        const y2m = f(a - 2 * hNum);
        derivative = (-y2 + 8 * y1 - 8 * y_1 + y2m) / (12 * hNum);
      } else if (method === "second") {
        // second derivative central: (f(x+h)-2f(x)+f(x-h))/h^2
        const y1 = f(a + hNum);
        const y0 = f(a);
        const y_1 = f(a - hNum);
        derivative = (y1 - 2 * y0 + y_1) / (hNum * hNum);
      } else {
        derivative = NaN;
      }

      // For graph of derivative approximations on neighborhood, compute derivative estimates at sample points using central (where possible)
      const derivSamples = samples.map((s) => {
        const xi = s.x;
        let d = NaN;
        try {
          // prefer 4th order when possible (need x±2h)
          const has2p = !isNaN(f(xi + 2 * hNum));
          const has2m = !isNaN(f(xi - 2 * hNum));
          if (has2p && has2m) {
            const y2 = f(xi + 2 * hNum);
            const y1 = f(xi + hNum);
            const y_1 = f(xi - hNum);
            const y2m = f(xi - 2 * hNum);
            d = (-y2 + 8 * y1 - 8 * y_1 + y2m) / (12 * hNum);
          } else {
            // fallback to 2nd order central if possible
            const y1 = f(xi + hNum);
            const y_1 = f(xi - hNum);
            if (!isNaN(y1) && !isNaN(y_1)) d = (y1 - y_1) / (2 * hNum);
          }
        } catch {
          d = NaN;
        }
        return { x: xi, fx: s.fx, d };
      });

      // Build table rows (show f values and derivatives where possible)
      const tableRows = derivSamples.map((s, idx) => ({
        index: idx,
        x: s.x,
        fx: s.fx,
        derivative: s.d,
      }));

      setTable(tableRows);
      setGraphData(
        derivSamples.map((s) => ({
          x: s.x,
          fx: s.fx,
          derivative: s.d,
        }))
      );

      setResult(derivative);
      setError("");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการคำนวณ โปรดตรวจสอบนิพจน์ f(x)");
      setResult(null);
      setTable([]);
      setGraphData([]);
    }
  };

  return (
    <div className="trap-container">
      <div className="trap-input-section">
        <div className="input-group">
          <label>f(x)</label>
          <input
            type="text"
            placeholder="e.g. sin(x) or x^3 - 2*x + 1"
            value={fx}
            onChange={(e) => setFx(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>x₀</label>
          <input
            type="number"
            placeholder="Point x0"
            value={x0}
            onChange={(e) => setX0(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>h (step)</label>
          <input
            type="number"
            placeholder="Step size h"
            value={h}
            onChange={(e) => setH(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ height: 44, borderRadius: 8, background: "#111827", color: "#e6eef8", border: "1px solid #374151" }}
          >
            <option value="forward">Forward Difference (O(h))</option>
            <option value="backward">Backward Difference (O(h))</option>
            <option value="central">Central Difference (O(h²))</option>
            <option value="central4">Higher-order Central (O(h⁴))</option>
            <option value="second">Second Derivative (Central)</option>
          </select>
        </div>
      </div>

      <div className="trap-buttons">
        <button className="confirm" onClick={calculate}>
          Calculate
        </button>
        <button className="saveproblem" onClick={handleSave}>
          Save Problem
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result !== null && (
        <div className="trap-result">
          <h3>Result at x = {x0}</h3>
          <p>
            {method === "second" ? "f''(x) ≈ " : "f'(x) ≈ "}
            <b>{Number(result).toFixed(6)}</b>
          </p>
        </div>
      )}

      {table.length > 0 && (
        <div className="trap-table">
          <h3>Sample Points & Approximated Derivative</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>x</th>
                <th>f(x)</th>
                <th>approx derivative</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{r.x.toFixed(6)}</td>
                  <td>{isNaN(r.fx) ? "NaN" : Number(r.fx).toFixed(6)}</td>
                  <td>{isNaN(r.derivative) ? "-" : Number(r.derivative).toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {graphData.length > 0 && (
        <div className="graph-container">
          <h3>Function and Derivative (approx)</h3>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fx" name="f(x)" dot={false} stroke="#2563eb" />
              <Line type="monotone" dataKey="derivative" name="f'(x) approx" dot={{ r: 3 }} stroke="#f97316" />
              <ReferenceLine x={parseFloat(x0) || 0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "x0", position: "top" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
