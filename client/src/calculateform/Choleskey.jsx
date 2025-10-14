import { useState } from "react";
import axios from "axios";

export default function CholeskyDecomposition() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [LMatrix, setLMatrix] = useState([]);
  const [LTMatrix, setLTMatrix] = useState([]);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  // เปลี่ยนค่าช่อง input matrix A
  const handleMatrixAChange = (row, col, value) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  // เปลี่ยนค่าช่อง input matrix B
  const handleMatrixBChange = (row, value) => {
    const newMatrix = [...matrixB];
    newMatrix[row] = value;
    setMatrixB(newMatrix);
  };

  // เปลี่ยนขนาดเมทริกซ์
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrixA(Array(newSize).fill().map(() => Array(newSize).fill("")));
    setMatrixB(Array(newSize).fill(""));
    setResult([]);
    setLMatrix([]);
    setLTMatrix([]);
    setError("");
  };

  // ✅ คำนวณ Cholesky Decomposition
  const calculateCholesky = () => {
    try {
      const n = size;
      const A = matrixA.map((row) => row.map((val) => parseFloat(val)));
      const B = matrixB.map((val) => parseFloat(val));

      // ตรวจสอบว่าเป็น symmetric หรือไม่
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (A[i][j] !== A[j][i]) {
            throw new Error("Matrix A must be symmetric!");
          }
        }
      }

      // สร้าง L matrix ว่าง
      const L = Array(n).fill().map(() => Array(n).fill(0));

      // คำนวณค่า L ตามสูตร Cholesky
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          let sum = 0;
          for (let k = 0; k < j; k++) {
            sum += L[i][k] * L[j][k];
          }

          if (i === j) {
            const diag = A[i][i] - sum;
            if (diag <= 0) throw new Error("Matrix is not positive definite!");
            L[i][j] = Math.sqrt(diag);
          } else {
            L[i][j] = (A[i][j] - sum) / L[j][j];
          }
        }
      }

      // หา Lᵀ
      const LT = Array(n)
        .fill()
        .map(() => Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          LT[i][j] = L[j][i];
        }
      }

      // Forward substitution: L * y = B
      const y = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[i][j] * y[j];
        }
        y[i] = (B[i] - sum) / L[i][i];
      }

      // Backward substitution: Lᵀ * x = y
      const x = Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
          sum += LT[i][j] * x[j];
        }
        x[i] = (y[i] - sum) / LT[i][i];
      }

      setLMatrix(L);
      setLTMatrix(LT);
      setResult(x);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error occurred during Cholesky decomposition!");
      setResult([]);
      setLMatrix([]);
      setLTMatrix([]);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/cholesky", {
        size,
        matrixA,
        matrixB,
      });
      alert("Cholesky problem saved successfully!");
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
        <button onClick={calculateCholesky} className="confirm">
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
            <p key={i}>
              x{i + 1} = {val.toFixed(6)}
            </p>
          ))}

          {/* ✅ แสดง L Matrix */}
          <h3>Matrix L:</h3>
          <div className="final-matrix">
            {LMatrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((val, j) => (
                  <span key={j} className="matrix-cell readonly">
                    {val.toFixed(3)}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* ✅ แสดง Lᵀ Matrix */}
          <h3>Matrix Lᵀ:</h3>
          <div className="final-matrix">
            {LTMatrix.map((row, i) => (
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
      )}
    </div>
  );
}
