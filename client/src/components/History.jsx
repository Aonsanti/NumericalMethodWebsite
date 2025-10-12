import { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";

export default function History() {
  const [bisection, setBisection] = useState([]);
  const [graphical, setGraphical] = useState([]);
  const [falseposition, setFalseposition] = useState([]);
  const [newtonraphson, setNewtonraphson] = useState([]);
  const [onepoint, setOnepoint] = useState([]);
  const [secant, setSecant] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bisectionRes , graphicalRes , falsepositionRes , newtonraphsonRes , onepointRes , secantRes] = await Promise.all([
          axios.get("http://localhost:8080/bisection"),
          axios.get("http://localhost:8080/graphical"),
          axios.get("http://localhost:8080/falseposition"),
          axios.get("http://localhost:8080/newtonraphson"),
          axios.get("http://localhost:8080/onepoint"),
          axios.get("http://localhost:8080/secant"),
        ]);
        setBisection(bisectionRes.data);
        setGraphical(graphicalRes.data);
        setFalseposition(falsepositionRes.data);
        setNewtonraphson(newtonraphsonRes.data);
        setOnepoint(onepointRes.data);
        setSecant(secantRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="ShowHistory">
      {/* ======= item 1 ======= */}
      <div className="item">
        <h1>Bisection</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>Lower bound (xL)</th>
              <th>Upper bound (xR)</th>
              <th>Tolerance (Error)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {bisection.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              bisection.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.xl}</td>
                  <td>{item.xr}</td>
                  <td>{item.tolerance}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>



      {/* ======= item 2 ======= */}
      <div className="item">
        <h1>Graphical</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>xStart(xL)</th>
              <th>xEnd (xR)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {graphical.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              graphical.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.xstart}</td>
                  <td>{item.xend}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* ======= item 3 ======= */}
      <div className="item">
        <h1>FalsePosition</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>Lower bound (xL)</th>
              <th>Upper bound (xR)</th>
              <th>Tolerance (Error)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {falseposition.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              falseposition.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.xl}</td>
                  <td>{item.xr}</td>
                  <td>{item.tolerance}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    {/* ======= item 4 ======= */}
      <div className="item">
        <h1>NewtonRaphson</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>Initial Guess(xL)</th>
              <th>Tolerance (Error)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {newtonraphson.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              newtonraphson.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.guess}</td>
                  <td>{item.tolerance}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>



    {/* ======= item 5 ======= */}
      <div className="item">
        <h1>Onepoint Iteration</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>Initial Guess(xL)</th>
              <th>Tolerance (Error)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {onepoint.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              onepoint.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.guess}</td>
                  <td>{item.tolerance}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    {/* ======= item 6 ======= */}
      <div className="item">
        <h1>Secant</h1>
        <table className="HistoryTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Function f(x)</th>
              <th>x0</th>
              <th>x1</th>
              <th>Tolerance (Error)</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {secant.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data is Empty
                </td>
              </tr>
            ) : (
              secant.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fx}</td>
                  <td>{item.x0}</td>
                  <td>{item.x1}</td>
                  <td>{item.tolerance}</td>
                  <td>
                    {item.datecreate
                      ? new Date(item.datecreate)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(/,/, " ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}
