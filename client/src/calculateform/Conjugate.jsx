import { useState } from "react";
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
import "./Jacobi.css";

export default function ConjugateGradient() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3)
      .fill()
      .map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [xValues, setXValues] = useState(["x1", "x2", "x3"]);
  const [tolerance, setTolerance] = useState(0.0001);
  const [iterationTable, setIterationTable] = useState([]);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]);

  // ✅ เปลี่ยนค่าช่อง Matrix A
  const handleMatrixAChange = (row, col, value) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  // ✅ เปลี่ยนค่าช่อง Matrix B
  const handleMatrixBChange = (row, value) => {
    const newMatrix = [...matrixB];
    newMatrix[row] = value;
    setMatrixB(newMatrix);
  };

  // ✅ เปลี่ยนขนาด Matrix
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill("")));
    setMatrixB(Array(newSize).fill(""));
    setXValues(Array(newSize).fill().map((_, i) => `x${i + 1}`));
    setResult([]);
    setIterationTable([]);
    setChartData([]);
    setError("");
  };

  // ✅ ฟังก์ชันคำนวณ Conjugate Gradient
  const calculateConjugateGradient = () => {
    try {
      const A = matrixA.map((row) => row.map((v) => parseFloat(v)));
      const B = matrixB.map((v) => parseFloat(v));
      const n = size;
      let x = Array(n).fill(0); // เริ่มต้น x0 = 0
      let r = B.map((b, i) => b - A[i].reduce((sum, aij, j) => sum + aij * x[j], 0));
      let p = [...r];
      let rsold = r.reduce((sum, ri) => sum + ri * ri, 0);

      const tol = parseFloat(tolerance);
      const maxIter = 100;
      let table = [];
      let chart = [];

      for (let iter = 0; iter < maxIter; iter++) {
        // คำนวณ Ap
        const Ap = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            Ap[i] += A[i][j] * p[j];
          }
        }

        // คำนวณค่า alpha
        const alpha = rsold / p.reduce((sum, pj, j) => sum + pj * Ap[j], 0);

        // อัปเดต x และ r
        for (let i = 0; i < n; i++) {
          x[i] = x[i] + alpha * p[i];
          r[i] = r[i] - alpha * Ap[i];
        }

        const rsnew = r.reduce((sum, ri) => sum + ri * ri, 0);
        const err = Math.sqrt(rsnew);

        table.push([...x]);
        chart.push({ iteration: iter + 1, error: err });

        if (err < tol) break;

        // คำนวณค่า p ใหม่
        for (let i = 0; i < n; i++) {
          p[i] = r[i] + (rsnew / rsold) * p[i];
        }

        rsold = rsnew;
      }

      setIterationTable(table);
      setChartData(chart);
      setResult([...x]);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid matrix or calculation error!");
      setResult([]);
      setIterationTable([]);
      setChartData([]);
    }
  };

  // ✅ บันทึกลง Database
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/conjugategradient", {
        size,
        matrixA,
        matrixB,
        tolerance,
      });
      alert("Conjugate Gradient problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="matrix-container">
      {/* ✅ เลือกขนาดเมทริกซ์ */}
      <div className="controls">
        <label>
          Select Matrix Size &nbsp;
          <select value={size} onChange={handleSizeChange}>
            <option value={2}>2 × 2</option>
            <option value={3}>3 × 3</option>
            <option value={4}>4 × 4</option>
          </select>
        </label>
      </div>

      {/* ✅ ส่วน Matrix A, X Values, B */}
      <div className="matrix-section">
        {/* Matrix A */}
        <div className="matrix-input">
          <h3>Matrix A</h3>
          {matrixA.map((row, rowIndex) => (
            <div key={rowIndex} className="matrix-row">
              {row.map((val, colIndex) => (
                <input
                  key={colIndex}
                  type="number"
                  value={val}
                  onChange={(e) =>
                    handleMatrixAChange(rowIndex, colIndex, e.target.value)
                  }
                  className="matrix-cell"
                />
              ))}
            </div>
          ))}
        </div>

        {/* X Values */}
        <div className="x-values">
          <h3>Values of X</h3>
          {xValues.map((val, i) => (
            <input
              key={i}
              type="text"
              value={val}
              disabled
              className="matrix-cell readonly"
            />
          ))}
        </div>

        {/* Matrix B */}
        <div className="matrix-b">
          <h3>Matrix B</h3>
          {matrixB.map((val, rowIndex) => (
            <input
              key={rowIndex}
              type="number"
              value={val}
              onChange={(e) => handleMatrixBChange(rowIndex, e.target.value)}
              className="matrix-cell"
            />
          ))}
        </div>
      </div>

      {/* ✅ ส่วน Tolerance ด้านล่าง */}
      <div className="extra-section">
        <h3>Tolerance</h3>
        <input
          type="number"
          value={tolerance}
          step="0.0001"
          onChange={(e) => setTolerance(e.target.value)}
        />
      </div>

      {/* ✅ ปุ่ม */}
      <div className="buttons">
        <button onClick={calculateConjugateGradient} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {/* ✅ Error */}
      {error && <div className="error">{error}</div>}

      {/* ✅ แสดงผลลัพธ์เป็นตาราง */}
      {iterationTable.length > 0 && (
        <div className="result">
          <h3>Iteration Results</h3>
          <table className="result-table">
            <thead>
              <tr>
                <th>Iteration</th>
                {xValues.map((val, i) => (
                  <th key={i}>{val}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {iterationTable.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  {row.map((val, j) => (
                    <td key={j}>{val.toFixed(6)}</td>
                  ))}
                </tr>
              ))}
              <tr className="final-row">
                <td>Values of x</td>
                {result.map((val, i) => (
                  <td key={i}>{val.toFixed(6)}</td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* ✅ แสดงกราฟ Error ต่อ Iteration */}
          <div className="chart-section">
            <h3>Error vs Iteration</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" label={{ value: "Iteration", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Error", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="error" stroke="red" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
