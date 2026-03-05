import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"
import CollectorDashboard from "./pages/CollectorDashboard"
import Admin from "./pages/Admin"
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset"
import About from "./pages/About"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default function App(){
    return(
  <BrowserRouter>

    <ToastContainer position="top-right" autoClose={3000} />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/collector" element={<CollectorDashboard/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/forgot" element={<Forgot/>}/>
        <Route path="/reset/:uid/:token" element={<Reset/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </BrowserRouter>
  )
}
