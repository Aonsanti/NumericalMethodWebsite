import { useState } from "react";
import axios from "axios";
import "./Jacobi.css"; // ใช้ css เดิมได้เลย

export default function SplineInterpolation() {
  const [size, setSize] = useState(4);
  const [xValues, setXValues] = useState(Array(4).fill(""));
  const [yValues, setYValues] = useState(Array(4).fill(""));
  const [xInput, setXInput] = useState("");
  const [fxResult, setFxResult] = useState(null);
  const [splineEquations, setSplineEquations] = useState([]);
  const [error, setError] = useState("");

  // ✅ เปลี่ยนจำนวนจุด
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setXValues(Array(newSize).fill(""));
    setYValues(Array(newSize).fill(""));
    setSplineEquations([]);
    setFxResult(null);
  };

  // ✅ คำนวณ Cubic Spline
  const calculateSpline = () => {
    try {
      const n = size;
      const X = xValues.map((x) => parseFloat(x));
      const Y = yValues.map((y) => parseFloat(y));

      if (X.some(isNaN) || Y.some(isNaN)) throw new Error("Invalid input!");

      const h = Array(n - 1)
        .fill()
        .map((_, i) => X[i + 1] - X[i]);

      // สร้างระบบสมการ Ax = B สำหรับหาค่า c
      const A = Array(n)
        .fill()
        .map(() => Array(n).fill(0));
      const B = Array(n).fill(0);

      // Boundary conditions (Natural spline)
      A[0][0] = 1;
      A[n - 1][n - 1] = 1;

      for (let i = 1; i < n - 1; i++) {
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        B[i] =
          3 *
          ((Y[i + 1] - Y[i]) / h[i] - (Y[i] - Y[i - 1]) / h[i - 1]);
      }

      // แก้ระบบสมการ Ax = B ด้วย Gauss Elimination
      const c = gaussianSolve(A, B);

      // คำนวณค่า a, b, d
      const a = [...Y];
      const b = [];
      const d = [];

      for (let i = 0; i < n - 1; i++) {
        b.push(
          (Y[i + 1] - Y[i]) / h[i] -
            (h[i] * (2 * c[i] + c[i + 1])) / 3
        );
        d.push((c[i + 1] - c[i]) / (3 * h[i]));
      }

      const equations = [];
      for (let i = 0; i < n - 1; i++) {
        const eq = `S${i}(x) = ${a[i].toFixed(6)} + ${b[i].toFixed(
          6
        )}(x - ${X[i]}) + ${c[i].toFixed(6)}(x - ${X[i]})^2 + ${d[
          i
        ].toFixed(6)}(x - ${X[i]})^3 , for [${X[i]}, ${X[i + 1]}]`;
        equations.push(eq);
      }

      setSplineEquations(equations);

      // ✅ ถ้ามีค่า xInput ให้คำนวณ f(x)
      if (xInput !== "") {
        const xVal = parseFloat(xInput);
        let fx = null;

        for (let i = 0; i < n - 1; i++) {
          if (xVal >= X[i] && xVal <= X[i + 1]) {
            fx =
              a[i] +
              b[i] * (xVal - X[i]) +
              c[i] * (xVal - X[i]) ** 2 +
              d[i] * (xVal - X[i]) ** 3;
            break;
          }
        }

        if (fx === null) throw new Error("x out of range!");
        setFxResult(fx);
      } else {
        setFxResult(null);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Calculation error! Please check inputs.");
      setSplineEquations([]);
      setFxResult(null);
    }
  };

  // ✅ ฟังก์ชันแก้ระบบสมการ Ax = B
  const gaussianSolve = (A, B) => {
    const n = B.length;
    for (let i = 0; i < n; i++) {
      // หาค่า pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
      }

      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [B[i], B[maxRow]] = [B[maxRow], B[i]];

      // ทำให้เป็น Upper Triangular
      for (let k = i + 1; k < n; k++) {
        const factor = A[k][i] / A[i][i];
        for (let j = i; j < n; j++) {
          A[k][j] -= factor * A[i][j];
        }
        B[k] -= factor * B[i];
      }
    }

    // Back substitution
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = B[i];
      for (let j = i + 1; j < n; j++) {
        sum -= A[i][j] * x[j];
      }
      x[i] = sum / A[i][i];
    }

    return x;
  };

  // ✅ Save to DB
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/spline", {
        size,
        xValues,
        yValues,
      });
      alert("Cubic Spline problem saved!");
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

      {/* ✅ กรอก X, Y */}
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

      {/* ✅ Input ค่า x */}
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
        <button onClick={calculateSpline} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {/* ✅ Error */}
      {error && <div className="error">{error}</div>}

      {/* ✅ สมการแต่ละช่วง */}
      {splineEquations.length > 0 && (
        <div className="result">
          <h3>Cubic Spline Equations</h3>
          <ul>
            {splineEquations.map((eq, i) => (
              <li key={i}>{eq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ ค่า f(x) */}
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
