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
import "./SimpleRegression.css";


export default function SimpleRegression() {
  const [dataPoints, setDataPoints] = useState([
    { x: "", y: "" },
    { x: "", y: "" },
    { x: "", y: "" },
  ]);
  const [predictX, setPredictX] = useState("");
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState("");

  // ✅ เปลี่ยนค่า x,y
  const handleChange = (index, field, value) => {
    const newPoints = [...dataPoints];
    newPoints[index][field] = value;
    setDataPoints(newPoints);
  };

  // ✅ เพิ่มแถว
  const addRow = () => {
    setDataPoints([...dataPoints, { x: "", y: "" }]);
  };

  // ✅ ลบแถว
  const removeRow = (index) => {
    const newPoints = [...dataPoints];
    newPoints.splice(index, 1);
    setDataPoints(newPoints);
  };

  // ✅ ฟังก์ชันคำนวณ Simple Linear Regression
  const calculateRegression = () => {
    try {
      const validPoints = dataPoints
        .map((p) => ({
          x: parseFloat(p.x),
          y: parseFloat(p.y),
        }))
        .filter((p) => !isNaN(p.x) && !isNaN(p.y));

      if (validPoints.length < 2) {
        setError("ต้องมีข้อมูลอย่างน้อย 2 จุดในการคำนวณ");
        return;
      }

      const n = validPoints.length;
      const sumX = validPoints.reduce((acc, p) => acc + p.x, 0);
      const sumY = validPoints.reduce((acc, p) => acc + p.y, 0);
      const sumXY = validPoints.reduce((acc, p) => acc + p.x * p.y, 0);
      const sumX2 = validPoints.reduce((acc, p) => acc + p.x * p.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const predictVal = predictX !== "" ? slope * predictX + intercept : null;

      const graphPts = validPoints.map((p) => ({
        x: p.x,
        y: p.y,
        regression: slope * p.x + intercept,
      }));

      // ถ้ามี predict ให้เพิ่มจุด extrapolation
      if (predictVal !== null) {
        graphPts.push({
          x: parseFloat(predictX),
          y: predictVal,
          regression: predictVal,
          isPredict: true,
        });
      }

      setResult({ slope, intercept, predictVal });
      setGraphData(graphPts);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error calculating regression!");
    }
  };

  // ✅ บันทึกลง Database
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/regression", {
        dataPoints,
        predictX,
      });
      alert("Regression problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="regression-container">
      <h2>Simple Linear Regression (Extrapolation)</h2>

      <table className="input-table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataPoints.map((point, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={point.x}
                  onChange={(e) => handleChange(index, "x", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={point.y}
                  onChange={(e) => handleChange(index, "y", e.target.value)}
                />
              </td>
              <td>
                {dataPoints.length > 2 && (
                  <button
                    className="delete-btn"
                    onClick={() => removeRow(index)}
                  >
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button className="add-btn" onClick={addRow}>
          + Add Point
        </button>
      </div>

      <div className="predict-section">
        <h3>Predict Y at X =</h3>
        <input
          type="number"
          value={predictX}
          onChange={(e) => setPredictX(e.target.value)}
          placeholder="Enter X value"
        />
      </div>

      <div className="buttons">
        <button className="confirm" onClick={calculateRegression}>
          Calculate
        </button>
        <button className="saveproblem" onClick={handleSave}>
          Save Problem
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result-section">
          <h3>Results</h3>
          <p>y = {result.slope.toFixed(6)}x + {result.intercept.toFixed(6)}</p>
          {result.predictVal !== null && (
            <p>
              Predicted Y at X = {predictX} →{" "}
              <strong>{result.predictVal.toFixed(6)}</strong>
            </p>
          )}
        </div>
      )}

      {graphData.length > 0 && (
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                name="Original Data"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="regression"
                stroke="#82ca9d"
                name="Regression Line"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
