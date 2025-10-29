import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Failed from './components/Failed';
import Success from './components/Success';



function App() {
  return (

    <div>

       <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/payment-success' element={<Success/>}/>
          <Route path='/payment-failed' element={<Failed/>}/>
        </Routes>
       </Router>

   
  
    </div>
    
  )
}

export default App