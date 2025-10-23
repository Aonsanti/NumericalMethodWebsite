import { useState } from "react";
import axios from "axios";

export default function Lagrange() {
  const [size, setSize] = useState(3);
  const [xValues, setXValues] = useState(Array(3).fill(""));
  const [yValues, setYValues] = useState(Array(3).fill(""));
  const [xInput, setXInput] = useState("");
  const [fxResult, setFxResult] = useState(null);
  const [polynomial, setPolynomial] = useState("");
  const [error, setError] = useState("");

  // ✅ เปลี่ยนจำนวนจุด
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setXValues(Array(newSize).fill(""));
    setYValues(Array(newSize).fill(""));
    setFxResult(null);
    setPolynomial("");
  };

  // ✅ คำนวณ Lagrange Polynomial
  const calculateLagrange = () => {
    try {
      const n = size;
      const X = xValues.map((x) => parseFloat(x));
      const Y = yValues.map((y) => parseFloat(y));

      if (X.some(isNaN) || Y.some(isNaN)) throw new Error("Invalid input!");

      // ✅ คำนวณสมการ Lagrange
      let terms = [];
      for (let i = 0; i < n; i++) {
        let numerator = [];
        let denominator = 1;
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            numerator.push(`(x - ${X[j]})`);
            denominator *= X[i] - X[j];
          }
        }
        let term = `${Y[i].toFixed(6)} * [${numerator.join(" * ")}] / (${denominator.toFixed(6)})`;
        terms.push(term);
      }

      const polyStr = "P(x) = " + terms.join(" + ");
      setPolynomial(polyStr);

      // ✅ ถ้ามีค่า xInput ให้คำนวณ f(x)
      if (xInput !== "") {
        const xVal = parseFloat(xInput);
        let result = 0;

        for (let i = 0; i < n; i++) {
          let Li = 1;
          for (let j = 0; j < n; j++) {
            if (i !== j) {
              Li *= (xVal - X[j]) / (X[i] - X[j]);
            }
          }
          result += Y[i] * Li;
        }

        setFxResult(result);
      } else {
        setFxResult(null);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Calculation error! Please check inputs.");
      setFxResult(null);
      setPolynomial("");
    }
  };

  // ✅ Save to Database
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/lagrange", {
        size,
        xValues,
        yValues,
      });
      alert("Lagrange interpolation problem saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="matrix-container">
      <div className="controls">
        <label>
          Number of Points &nbsp;
          <select value={size} onChange={handleSizeChange}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
      </div>

      {/* ✅ กรอกค่า X, Y */}
      <div className="matrix-section">
        <div className="matrix-input">
          <h3>X Values</h3>
          {xValues.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => {
                const newX = [...xValues];
                newX[i] = e.target.value;
                setXValues(newX);
              }}
              className="matrix-cell"
            />
          ))}
        </div>

        <div className="matrix-input">
          <h3>Y Values</h3>
          {yValues.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => {
                const newY = [...yValues];
                newY[i] = e.target.value;
                setYValues(newY);
              }}
              className="matrix-cell"
            />
          ))}
        </div>
      </div>

      {/* ✅ ช่องสำหรับกรอกค่า x เพื่อคำนวณ f(x) */}
      <div className="extra-section">
        <h3>Find f(x) at</h3>
        <input
          type="number"
          value={xInput}
          onChange={(e) => setXInput(e.target.value)}
          placeholder="Enter x value"
        />
      </div>

      {/* ✅ ปุ่ม */}
      <div className="buttons">
        <button onClick={calculateLagrange} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {/* ✅ Error */}
      {error && <div className="error">{error}</div>}

      {/* ✅ แสดง Polynomial */}
      {polynomial && (
        <div className="result">
          <h3>Lagrange Polynomial</h3>
          <p>{polynomial}</p>
        </div>
      )}

      {/* ✅ แสดงผลลัพธ์ f(x) */}
      {fxResult !== null && (
        <div className="result">
          <h3>Result</h3>
          <p>
            f({xInput}) = <b>{fxResult.toFixed(6)}</b>
          </p>
        </div>
      )}
    </div>
  );
}
