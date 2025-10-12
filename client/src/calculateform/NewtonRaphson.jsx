import { useState } from "react";
import { evaluate, derivative } from "mathjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";

export default function NewtonRaphson() {
  const [fx, setFx] = useState("");
  const [guess, setGuess] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [, setError] = useState("");
  const [answer, setAnswer] = useState([]);
  const [newtonraphson, setNewtonraphson] = useState({
    fx: "",
    guess: "",
    tolerance: ""
  });

  function f(x) {
    return evaluate(newtonraphson.fx, { x: x });
  }

  function fPrime(x) {
    const df = derivative(newtonraphson.fx, "x");
    return evaluate(df.toString(), { x: x });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewtonraphson((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fx":
        setFx(value);
        break;
      case "guess":
        setGuess(value);
        break;
      case "tolerance":
        setTolerance(value);
        break;
      default:
        break;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/newtonraphson", newtonraphson);
      console.log("Save success");
      alert("Problem already save, Please check in History");
    } catch (err) {
      console.log(err);
      setError("Failed to save data to database");
    }
  };

  function calculate() {
    let x = parseFloat(guess);
    let tol = parseFloat(tolerance) || 0.0001;
    let err = 1;
    let iter = 0;
    let result = [];

    while (err > tol && iter < 50) {
      let fxValue = f(x);
      let fpxValue = fPrime(x);

      if (fpxValue === 0) {
        alert("Answer is NaN , Please fix your function.");
        break;
      }

      let xNew = x - fxValue / fpxValue;

      if (iter > 0) {
        err = Math.abs((xNew - x) / xNew);
      }

      result.push({
        iteration: iter + 1,
        x: x.toFixed(6),
        fx: fxValue.toFixed(6),
        fpx: fpxValue.toFixed(6),
        xNew: xNew.toFixed(6),
        error: err.toFixed(6)
      });

      x = xNew;
      iter++;
    }

    setError(err);
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
                <th>x</th>
                <th>f(x)</th>
                <th>f'(x)</th>
                <th>x(new)</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {answer.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.iteration}</td>
                  <td>{row.x}</td>
                  <td>{row.fx}</td>
                  <td>{row.fpx}</td>
                  <td>{row.xNew}</td>
                  <td>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={answer}>
                <CartesianGrid strokeDasharray={"0 0"} />
                <XAxis dataKey="iteration" />
                <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="xNew" stroke="#0000ff" name="x(new)" />
                <Line type="monotone" dataKey="error" stroke="#ff0000" name="Error" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
