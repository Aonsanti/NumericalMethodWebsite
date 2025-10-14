import { useState } from "react";
import axios from "axios";

export default function CramerRule() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  // ✅ เปลี่ยนค่า Matrix A
  const handleMatrixAChange = (row, col, value) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  // ✅ เปลี่ยนค่า Matrix B
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
    setResult([]);
    setError("");
  };

  // ✅ ฟังก์ชันหาค่า determinant แบบ recursive
  const determinant = (matrix) => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2)
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let col = 0; col < n; col++) {
      const subMatrix = matrix
        .slice(1)
        .map(row => row.filter((_, j) => j !== col));
      det += ((col % 2 === 0 ? 1 : -1) * matrix[0][col] * determinant(subMatrix));
    }
    return det;
  };

  // ✅ คำนวณด้วย Cramer's Rule
  const calculateCramer = () => {
    try {
      const n = size;
      const A = matrixA.map(row => row.map(val => parseFloat(val)));
      const B = matrixB.map(val => parseFloat(val));

      // ตรวจสอบ input
      if (A.some(row => row.some(isNaN)) || B.some(isNaN)) {
        throw new Error("Invalid matrix input");
      }

      const detA = determinant(A);
      if (detA === 0) throw new Error("Det(A) = 0, no unique solution");

      const results = [];
      for (let i = 0; i < n; i++) {
        // สร้าง A_i
        const Ai = A.map((row, r) =>
          row.map((val, c) => (c === i ? B[r] : val))
        );
        const detAi = determinant(Ai);
        results.push(detAi / detA);
      }

      setResult(results);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid or singular matrix input!");
      setResult([]);
    }
  };

  // ✅ Save to DB
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/cramer", {
        size,
        matrixA,
        matrixB,
      });
      alert("Cramer's Rule problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="matrix-container">
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

      <div className="matrix-section">
        {/* ✅ Matrix A */}
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

        {/* ✅ Matrix B */}
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

      <div className="buttons">
        <button onClick={calculateCramer} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result.length > 0 && (
        <div className="result">
          <h3>Solution:</h3>
          {result.map((val, i) => (
            <p key={i}>x{i + 1} = {val.toFixed(6)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
