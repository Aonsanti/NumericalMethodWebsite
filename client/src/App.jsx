// import {useEffect } from 'react'
// import axios from "axios";
import './App.css'
import Header from './components/Header';
import History from './components/History'
import Bisection from './calculateform/Bisection'
import FaslePosition from './calculateform/FaslePosition'
import GaussianElimination from './calculateform/GaussianElimination'
import LUDecomposition from './calculateform/LUDecomposition'
import MatrixInverse from './calculateform/MatrixInverse'
import Graphical from './calculateform/Graphical';
import NewtonRaphson from './calculateform/NewtonRaphson';
import OnePoint from './calculateform/OnePoint';
import Secant from './calculateform/Secant';
import {Routes , Route , HashRouter} from 'react-router-dom'

function App() {
  return (
    <>
      <HashRouter>
        <Header/>
        <Routes>
          <Route path="/graphical" element={<Graphical />} />
          <Route path="/bisection" element={<Bisection />} />
          <Route path="/false-position" element={<FaslePosition />} />
          <Route path="/newtonraphson" element={<NewtonRaphson />} />
          <Route path="/onepoint" element={<OnePoint />} />
          <Route path="/secant" element={<Secant />} />



          
          <Route path="/gaussian-elimination" element={<GaussianElimination />} />
          <Route path="/lu-decomposition" element={<LUDecomposition />} />
          <Route path="/matrix-inverse" element={<MatrixInverse />} />




          <Route path="/history" element={<History />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App
