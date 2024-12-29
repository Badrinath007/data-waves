import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './Components/Login';
import Signup from './Components/Signup';
import './index.css'
import Dashboard from './Components/Dashboard';


const App = () => {

  
  return (
    <Router>
  
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
    </Router>
  );
};

export default App;
