import { useState } from "react";
import axios from "axios";
import "./GaussianElimination.css";

export default function GaussJordan() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [result, setResult] = useState([]);
  const [finalMatrix, setFinalMatrix] = useState([]); 
  const [error, setError] = useState("");

  const handleMatrixAChange = (row, col, value) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  const handleMatrixBChange = (row, value) => {
    const newMatrix = [...matrixB];
    newMatrix[row] = value;
    setMatrixB(newMatrix);
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill("")));
    setMatrixB(Array(newSize).fill(""));
    setResult([]);
    setFinalMatrix([]);
    setError("");
  };

  // ✅ Gauss–Jordan Elimination
  const calculateGaussJordan = () => {
    try {
      const A = matrixA.map((row) => row.map((val) => parseFloat(val)));
      const B = matrixB.map((val) => [parseFloat(val)]);
      const n = size;
      const augmented = A.map((row, i) => [...row, B[i][0]]);

      // ทำให้เป็น Reduced Row Echelon Form
      for (let i = 0; i < n; i++) {
        // หาค่า pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
          if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
            maxRow = k;
          }
        }
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

        const pivot = augmented[i][i];
        if (pivot === 0 || isNaN(pivot)) throw new Error("Singular matrix");

        // ทำให้ pivot = 1
        for (let j = 0; j <= n; j++) {
          augmented[i][j] /= pivot;
        }

        // ทำให้คอลัมน์อื่นๆ ในคอลัมน์ pivot เป็น 0
        for (let k = 0; k < n; k++) {
          if (k !== i) {
            const factor = augmented[k][i];
            for (let j = 0; j <= n; j++) {
              augmented[k][j] -= factor * augmented[i][j];
            }
          }
        }
      }

      // ✅ คำตอบคือค่าในคอลัมน์สุดท้าย
      const x = augmented.map((row) => row[n]);

      setResult(x);
      setFinalMatrix(augmented);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid or singular matrix input!");
      setResult([]);
      setFinalMatrix([]);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/gaussjordan", {
        size,
        matrixA,
        matrixB,
      });
      alert("Gauss–Jordan problem saved successfully!");
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

      <div className="buttons">
        <button onClick={calculateGaussJordan} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result.length > 0 && (
        <div className="result-section">
          {/* แสดงผลลัพธ์และ matrix ข้างกัน */}
          <div className="result-box">
            <h3>Solution</h3>
            {result.map((val, i) => (
              <p key={i}>
                x{i + 1} = {val.toFixed(6)}
              </p>
            ))}
          </div>

          <div className="final-matrix-box">
            <h3>Final Reduced Matrix</h3>
            <div className="final-matrix">
              {finalMatrix.map((row, i) => (
                <div key={i} className="matrix-row">
                  {row.map((val, j) => (
                    <span key={j} className="matrix-cell readonly">
                      {val.toFixed(3)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
