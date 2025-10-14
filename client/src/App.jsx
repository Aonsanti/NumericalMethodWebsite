// import {useEffect } from 'react'
// import axios from "axios";
import './App.css'
import Header from './components/Header';
import History from './components/History'

import Graphical from './calculateform/Graphical';
import Bisection from './calculateform/Bisection'
import FaslePosition from './calculateform/FaslePosition'
import OnePoint from './calculateform/OnePoint';
import NewtonRaphson from './calculateform/NewtonRaphson';
import Secant from './calculateform/Secant';

import Cramer from './calculateform/Cramer'
import MatrixInverse from './calculateform/MatrixInverse'
import GaussianElimination from './calculateform/GaussianElimination'
import GaussianJordan from './calculateform/GaussianJordan';
import LUDecomposition from './calculateform/LUDecomposition'
import Choleskey from './calculateform/Choleskey'

import Jacobi from './calculateform/Jacobi'
import GaussSeidal from './calculateform/GaussSeidal'
import Conjugate from './calculateform/Conjugate'


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


          <Route path="/cramer's-rule" element={<Cramer />} />
          <Route path="/matrix-inversion" element={<MatrixInverse />} />
          <Route path="/gaussian-elimination" element={<GaussianElimination />} />
          <Route path="/gauss-jordan" element={<GaussianJordan />} />
          <Route path="/lu-decomposition" element={<LUDecomposition />} />
          <Route path="/choleskey-decomposition" element={<Choleskey />} />


          <Route path="/jacobi-iteration" element={<Jacobi />} />
          <Route path="/gauss-seidal-iteration" element={<GaussSeidal />} />
          <Route path="/conjugate-gradient" element={<Conjugate />} />







          <Route path="/history" element={<History />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App
