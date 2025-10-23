import { useState } from "react";
import axios from "axios";

export default function NewtonDividedDifference() {
  const [size, setSize] = useState(3);
  const [xValues, setXValues] = useState(Array(3).fill(""));
  const [yValues, setYValues] = useState(Array(3).fill(""));
  const [dividedTable, setDividedTable] = useState([]);
  const [polynomial, setPolynomial] = useState("");
  const [xInput, setXInput] = useState("");
  const [fxResult, setFxResult] = useState(null);
  const [error, setError] = useState("");

  // ✅ เปลี่ยนขนาดข้อมูล
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setXValues(Array(newSize).fill(""));
    setYValues(Array(newSize).fill(""));
    setDividedTable([]);
    setPolynomial("");
    setFxResult(null);
  };

  // ✅ คำนวณ Newton's Divided Difference
  const calculateNewton = () => {
    try {
      const n = size;
      const X = xValues.map((x) => parseFloat(x));
      const Y = yValues.map((y) => parseFloat(y));
      if (X.some(isNaN) || Y.some(isNaN)) throw new Error("Invalid input!");

      // สร้างตารางส่วนต่าง
      const table = Array(n)
        .fill()
        .map(() => Array(n).fill(0));

      for (let i = 0; i < n; i++) table[i][0] = Y[i];

      for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
          table[i][j] =
            (table[i + 1][j - 1] - table[i][j - 1]) / (X[i + j] - X[i]);
        }
      }

      setDividedTable(table);

      // สร้างสมการ P(x)
      let terms = [];
      for (let i = 0; i < n; i++) {
        let term = table[0][i].toFixed(6);
        for (let j = 0; j < i; j++) {
          term += `*(x - ${X[j]})`;
        }
        terms.push(term);
      }
      const polyStr = "P(x) = " + terms.join(" + ");
      setPolynomial(polyStr);

      // ถ้ามีค่า xInput ให้คำนวณ f(x)
      if (xInput !== "") {
        const xVal = parseFloat(xInput);
        let result = table[0][0];
        for (let i = 1; i < n; i++) {
          let product = table[0][i];
          for (let j = 0; j < i; j++) {
            product *= xVal - X[j];
          }
          result += product;
        }
        setFxResult(result);
      } else {
        setFxResult(null);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Calculation error! Please check inputs.");
      setDividedTable([]);
      setPolynomial("");
    }
  };

  // ✅ Save to Database (optional)
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/newton", {
        size,
        xValues,
        yValues,
      });
      alert("Newton's Divided Difference problem saved!");
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

      {/* ✅ Input ค่า x เพื่อคำนวณ f(x) */}
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
        <button onClick={calculateNewton} className="confirm">
          Calculate
        </button>
        <button onClick={handleSave} className="saveproblem">
          Save Problem
        </button>
      </div>

      {/* ✅ Error */}
      {error && <div className="error">{error}</div>}

      {/* ✅ ตารางผลลัพธ์ */}
      {dividedTable.length > 0 && (
        <div className="result">
          <h3>Divided Difference Table</h3>
          <table className="result-table">
            <thead>
              <tr>
                <th>x</th>
                <th>f[x]</th>
                {Array.from({ length: size - 1 }, (_, i) => (
                  <th key={i}>Order {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dividedTable.map((row, i) => (
                <tr key={i}>
                  <td>{xValues[i]}</td>
                  {row.map((val, j) => (
                    <td key={j}>
                      {i + j < size ? val.toFixed(6) : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ แสดงสมการ */}
      {polynomial && (
        <div className="result">
          <h3>Polynomial</h3>
          <p>{polynomial}</p>
        </div>
      )}

      {/* ✅ ค่าที่ได้จาก f(xInput) */}
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
