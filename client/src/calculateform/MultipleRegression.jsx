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


export default function MultipleRegression() {
  const [numVariables, setNumVariables] = useState(2);
  const [dataPoints, setDataPoints] = useState([
    { X1: "", X2: "", Y: "" },
    { X1: "", X2: "", Y: "" },
    { X1: "", X2: "", Y: "" },
  ]);
  const [predictX, setPredictX] = useState({});
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState("");

  // ✅ เปลี่ยนค่าในตารางข้อมูล
  const handleChange = (index, field, value) => {
    const newPoints = [...dataPoints];
    newPoints[index][field] = value;
    setDataPoints(newPoints);
  };

  // ✅ เพิ่มแถวข้อมูล
  const addRow = () => {
    const newRow = {};
    for (let i = 1; i <= numVariables; i++) {
      newRow[`X${i}`] = "";
    }
    newRow.Y = "";
    setDataPoints([...dataPoints, newRow]);
  };

  // ✅ ลบแถวข้อมูล
  const removeRow = (index) => {
    const newPoints = [...dataPoints];
    newPoints.splice(index, 1);
    setDataPoints(newPoints);
  };

  // ✅ เปลี่ยนจำนวนตัวแปร X
  const handleVariableChange = (e) => {
    const newNum = parseInt(e.target.value);
    setNumVariables(newNum);

    const newData = dataPoints.map((row) => {
      const updated = {};
      for (let i = 1; i <= newNum; i++) {
        updated[`X${i}`] = row[`X${i}`] || "";
      }
      updated.Y = row.Y;
      return updated;
    });
    setDataPoints(newData);

    const newPredict = {};
    for (let i = 1; i <= newNum; i++) newPredict[`X${i}`] = "";
    setPredictX(newPredict);
  };

  // ✅ เปลี่ยนค่า X สำหรับทำนาย
  const handlePredictChange = (field, value) => {
    setPredictX((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ คำนวณ Multiple Regression
  const calculateRegression = () => {
    try {
      const m = numVariables;

      const X = dataPoints.map((row) => [
        1,
        ...Array.from({ length: m }, (_, i) => parseFloat(row[`X${i + 1}`])),
      ]);
      const Y = dataPoints.map((row) => [parseFloat(row.Y)]);

      // ตรวจสอบว่ามีข้อมูลครบ
      if (X.some((r) => r.includes(NaN)) || Y.some((r) => isNaN(r[0]))) {
        setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
      }

      // --- ใช้ Math.js แบบ manual matrix calculation ---
      // (X^T * X)^-1 * X^T * Y
      const XT = X[0].map((_, i) => X.map((row) => row[i]));
      const XTX = XT.map((row, i) =>
        row.map((_, j) =>
          row.reduce((sum, _, k) => sum + XT[i][k] * X[k][j], 0)
        )
      );
      const XTY = XT.map((row) =>
        row.reduce((sum, _, k) => sum + row[k] * Y[k][0], 0)
      );

      // Inverse of XTX (2x2 or 3x3 general method)
      const inverse = (M) => {
        const det =
          M.length === 2
            ? M[0][0] * M[1][1] - M[0][1] * M[1][0]
            : M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
              M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
              M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
        if (det === 0) throw new Error("Matrix not invertible");

        if (M.length === 2) {
          return [
            [M[1][1] / det, -M[0][1] / det],
            [-M[1][0] / det, M[0][0] / det],
          ];
        }

        const cof = (r, c) => {
          const sub = M.filter((_, i) => i !== r).map((row) =>
            row.filter((_, j) => j !== c)
          );
          const s = (r + c) % 2 === 0 ? 1 : -1;
          return (
            s *
            (sub[0][0] * sub[1][1] - sub[0][1] * sub[1][0])
          );
        };

        const adj = M.map((row, i) => row.map((_, j) => cof(j, i)));
        return adj.map((row) => row.map((v) => v / det));
      };

      const invXTX = inverse(XTX);
      const B = invXTX.map((row) =>
        row.reduce((sum, val, i) => sum + val * XTY[i], 0)
      );

      // คำนวณค่าที่ทำนายได้
      const Y_pred = X.map((row) =>
        row.reduce((sum, val, i) => sum + val * B[i], 0)
      );

      // ทำนายจุดใหม่
      const predictVals = [1, ...Object.values(predictX).map(parseFloat)];
      const predictY = predictVals.reduce(
        (sum, val, i) => sum + val * B[i],
        0
      );

      // สร้างข้อมูลกราฟ (แสดง Y จริง vs ทำนาย)
      const chartData = dataPoints.map((row, i) => ({
        id: i + 1,
        Actual: parseFloat(row.Y),
        Predicted: Y_pred[i],
      }));

      setResult({ coefficients: B, predictY });
      setGraphData(chartData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการคำนวณ");
    }
  };

  // ✅ Save ลงฐานข้อมูล
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8080/multiple-regression", {
        dataPoints,
        predictX,
      });
      alert("Multiple Regression problem saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data to database.");
    }
  };

  return (
    <div className="regression-container">
      <div className="controls">
        <label>
          <select value={numVariables} onChange={handleVariableChange}>
            <option value={2}>2 Variables</option>
            <option value={3}>3 Variables</option>
          </select>
        </label>
      </div>

      <table className="input-table">
        <thead>
          <tr>
            {[...Array(numVariables)].map((_, i) => (
              <th key={i}>X{i + 1}</th>
            ))}
            <th>Y</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataPoints.map((point, index) => (
            <tr key={index}>
              {[...Array(numVariables)].map((_, i) => (
                <td key={i}>
                  <input
                    type="number"
                    value={point[`X${i + 1}`]}
                    onChange={(e) =>
                      handleChange(index, `X${i + 1}`, e.target.value)
                    }
                  />
                </td>
              ))}
              <td>
                <input
                  type="number"
                  value={point.Y}
                  onChange={(e) => handleChange(index, "Y", e.target.value)}
                />
              </td>
              <td>
                {dataPoints.length > 2 && (
                  <button className="delete-btn" onClick={() => removeRow(index)}>
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button className="add-btn" onClick={addRow}>+ Add Point</button>
      </div>

      <div className="predict-section">
        <h3>Predict Y for:</h3>
        {[...Array(numVariables)].map((_, i) => (
          <input
            key={i}
            type="number"
            placeholder={`X${i + 1}`}
            value={predictX[`X${i + 1}`] || ""}
            onChange={(e) => handlePredictChange(`X${i + 1}`, e.target.value)}
          />
        ))}
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
          <h3>Result</h3>
          <p>
            Y = {result.coefficients.map((b, i) =>
              i === 0
                ? `${b.toFixed(6)}`
                : ` + (${b.toFixed(6)})X${i}`
            )}
          </p>
          <p>
            Predicted Y = <strong>{result.predictY.toFixed(6)}</strong>
          </p>
        </div>
      )}

      {graphData.length > 0 && (
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" label={{ value: "Data Point", position: "insideBottom", offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Actual" stroke="#8884d8" name="Actual Y" />
              <Line type="monotone" dataKey="Predicted" stroke="#82ca9d" name="Predicted Y" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
