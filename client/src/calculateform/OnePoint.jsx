import { useState } from "react";
import { evaluate } from "mathjs";
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
import axios from "axios";

export default function OnePoint() {
  const [fx, setFx] = useState("");
  const [guess, setGuess] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [, setError] = useState("");
  const [answer, setAnswer] = useState([]);
  const [onePoint, setOnePoint] = useState({
    fx: "",
    guess: "",
    tolerance: "",
  });

  function proposition(x) {
    return evaluate(onePoint.fx, { x });
  }

  function converged(a, b, epsilon) {
    return Math.abs(a - b) < epsilon;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOnePoint((prev) => ({ ...prev, [name]: value }));

    if (name === "fx") setFx(value);
    if (name === "guess") setGuess(value);
    if (name === "tolerance") setTolerance(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/onepoint", onePoint);
      console.log("Save success");
      alert("Problem already saved, Please check in History");
    } catch (err) {
      console.log(err);
      setError("Failed to save data to database");
    }
  };

  function calculate() {
    let xOld = parseFloat(guess);
    let epsilon = parseFloat(tolerance) || 0.000001;
    let xNew = 0.0;
    let iteration = 0;
    let result = [];

    while (true) {
      xNew = proposition(xOld);
      iteration++;

      result.push({
        iteration: iteration,
        xOld: xOld.toFixed(6),
        xNew: xNew.toFixed(6),
        error: Math.abs(xNew - xOld).toFixed(10),
      });

      if (converged(xNew, xOld, epsilon)) {
        break;
      }

      xOld = xNew;

      if (iteration > 100) break;
    }

    console.log("Root:", xNew, "Iterations:", iteration);
    setAnswer(result);
  }

  return (
    <div>
      <div className="Formcontainer">
        <div className="nameHeader">
          <div>Function f(x)</div>
          <div>Initial Guess (x₀)</div>
          <div>Tolerance (Error)</div>
        </div>

        <div className="data">
          <input placeholder="Function" name="fx" value={fx} onChange={handleChange}/>
          <input placeholder="Value of x₀" name="guess" value={guess} onChange={handleChange}/>
          <input placeholder="Error tolerance" name="tolerance" value={tolerance} onChange={handleChange}/>
        </div>

        <span className="button">
          <button className="confirm" onClick={calculate}>Confirm</button>
          <button className="saveproblem" onClick={handleClick}>Save Problem</button>
        </span>
      </div>

      {answer.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>xOld</th>
                <th>xNew</th>
                <th>|xNew - xOld|</th>
              </tr>
            </thead>
            <tbody>
              {answer.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.iteration}</td>
                  <td>{row.xOld}</td>
                  <td>{row.xNew}</td>
                  <td>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={answer}>
                <CartesianGrid strokeDasharray="0 0" />
                <XAxis dataKey="iteration" />
                <YAxis label={{value: "Value", angle: -90,position: "insideLeft",}}/>
                <Tooltip contentStyle={{backgroundColor: "#1F2937",border: "1px solid #374151",borderRadius: "8px",color: "#fff", }}/>
                <Legend />
                <Line type="monotone" dataKey="xNew" stroke="#0000ff" name="xNew"/>
                <Line type="monotone" dataKey="error" stroke="#ff0000" name="|xNew - xOld|"/>
              </LineChart>
            </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <strong>
              Root ≈ {answer[answer.length - 1].xNew} &ensp;&ensp;&ensp; Iterations : {answer.length}
            </strong>
          </div>
          </div>

        </div>
      )}
    </div>
  );
}
