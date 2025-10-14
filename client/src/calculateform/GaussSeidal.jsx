import { useState } from "react";
import axios from "axios";
import "./Jacobi.css"; // ใช้ CSS เดิมได้เลย

export default function GaussSeidel() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [xValues, setXValues] = useState(["x1", "x2", "x3"]);
  const [tolerance, setTolerance] = useState(0.0001);
  const [iterationTable, setIterationTable] = useState([]);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

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
    setError("");
  };

  // ✅ ฟังก์ชันคำนวณ Gauss-Seidel Iteration
  const calculateGaussSeidel = () => {
    try {
      const A = matrixA.map((row) => row.map((v) => parseFloat(v)));
      const B = matrixB.map((v) => parseFloat(v));

      const n = size;
      let x = Array(n).fill(0); // ค่าตั้งต้น x0
      let tol = parseFloat(tolerance);
      let iterations = 0;
      const maxIter = 1000;
      const table = [];

      while (iterations < maxIter) {
        const xOld = [...x];

        for (let i = 0; i < n; i++) {
          let sum = 0;
          for (let j = 0; j < n; j++) {
            if (j !== i) sum += A[i][j] * x[j]; // ✅ ใช้ค่า x ที่อัปเดตแล้ว
          }
          x[i] = (B[i] - sum) / A[i][i];
        }

        table.push([...x]);

        // ✅ คำนวณ error
        let diff = 0;
        for (let i = 0; i < n; i++) diff += Math.abs(x[i] - xOld[i]);

        iterations++;
        if (diff < tol) break;
      }

      setIterationTable(table);
      setResult([...x]);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid matrix or calculation error!");
      setResult([]);
      setIterationTable([]);
    }
  };

  // ✅ บันทึกลง Database
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/gaussseidel", {
        size,
        matrixA,
        matrixB,
        tolerance,
      });
      alert("Gauss-Seidel problem saved successfully!");
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

      {/* ✅ ส่วน Tolerance */}
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
        <button onClick={calculateGaussSeidel} className="confirm">
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
        </div>
      )}
    </div>
  );
}
