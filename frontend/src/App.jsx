import React from 'react'
import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  return (
    <div>

       <Router>
        <Route>
          <Routes path='/' element={<Home/>}>
          <Routes path='/payment-success' element={</>}>

        </Route>
       </Router>
  
    </div>
  )
}

export default App