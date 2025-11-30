import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login'; 
import Projects from './Projects';
import Tasks from './Tasks';
import Teams from './Teams'; 
import Home from './Home'; 
import Dashboard from './Dashboard';

import Summary from './Summary';
import UserRegister from './UserRegister';

function App() {
  return (
    <Router>
      <div className='title' style={{ textAlign: 'center', marginTop: '10px' }}>
        <h1>ProjexHub</h1>


        <div>
  <p style={{ 
      fontSize: '45px', 
      fontFamily:'Franklin Gothic Medium, Arial Narrow, Arial, sans-serif',
      color: '#c41f0dff', 
      fontWeight: '500', 
      marginTop: '10px' 
  }}>
    Your Project Powerhouse.
  </p>
</div>

      </div>

      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Link to="/" style={{ marginRight: '10px' }}>LOGIN</Link>
          <Link to="/user-register" style={{ marginRight: '10px' }}>REGISTER</Link>
          <Link to="/home" style={{ marginRight: '10px' }}>HOME</Link>
          <Link to="/projects" style={{ marginRight: '10px' }}>PROJECTS</Link>
          <Link to="/tasks" style={{ marginRight: '10px' }}>TASKS</Link>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>DASHBOARD</Link>
          <Link to="/teams" style={{ marginRight: '10px' }}>TEAMS</Link>
          <Link to="/summary" style={{ marginRight: '10px' }}>SUMMARY</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          

          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
