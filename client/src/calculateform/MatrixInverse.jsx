import { useState } from "react";
import axios from "axios";
import { inv, multiply, matrix } from "mathjs";
import "./MatrixInverse.css";

export default function MatrixInverse() {
  const [size, setSize] = useState(3);
  const [matrixA, setMatrixA] = useState(
    Array(3)
      .fill()
      .map(() => Array(3).fill(""))
  );
  const [matrixB, setMatrixB] = useState(Array(3).fill(""));
  const [inverseMatrix, setInverseMatrix] = useState([]);
  const [result, setResult] = useState([]); // ✅ X = A⁻¹ * B
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
    setInverseMatrix([]);
    setResult([]);
    setError("");
  };

  // ✅ คำนวณ Inverse และผลลัพธ์ X
  const calculateInverse = () => {
    try {
      const numericA = matrixA.map((row) => row.map((v) => parseFloat(v)));
      const numericB = matrixB.map((v) => parseFloat(v));

      const A = matrix(numericA);
      const B = matrix(numericB);
      const invA = inv(A);
      const X = multiply(invA, B);

      setInverseMatrix(invA.toArray());
      setResult(X.toArray());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid or singular matrix input!");
      setInverseMatrix([]);
      setResult([]);
    }
  };

  // ✅ บันทึกลง Database
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/matrixinverse", {
        size,
        matrixA,
        matrixB,
      });
      alert("Matrix inverse problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="matrix-container">
      {/* ✅ ส่วนเลือกขนาดเมทริกซ์ */}
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

      {/* ✅ ส่วน Matrix A และ B */}
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

      {/* ปุ่มต่างๆ */}
      <div className="buttons">
        <button onClick={calculateInverse} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {/* ข้อผิดพลาด */}
      {error && <div className="error">{error}</div>}

      {/* ✅ แสดงผลลัพธ์ */}
      {(inverseMatrix.length > 0 || result.length > 0) && (
        <div className="result">
          <h3>Inverse of A:</h3>
          <div className="final-matrix">
            {inverseMatrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((val, j) => (
                  <span key={j} className="matrix-cell readonly">
                    {val.toFixed(3)}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <h3>Result X = A⁻¹ × B:</h3>
          <div className="final-matrix">
            {result.map((val, i) => (
              <div key={i} className="matrix-row">
                <span className="matrix-cell readonly">
                  x{i + 1} = {val.toFixed(6)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
