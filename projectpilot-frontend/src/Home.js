import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
const heroImage = "https://getnave.com/blog/wp-content/uploads/2018/01/what-is-project-management-process.png";

function Home() {
  return (
    <div className="home-container">
  <div className="hero-content">
      <div className="hero-description">
    
      <p>
        <strong>ProjexHub</strong> is your all-in-one <strong>Project & Task Management Tool </strong> 
         designed to simplify how teams and individuals plan, track, and deliver projects.<br></br><br></br>
      Built to simplify workflows and enhance productivity, it offers a centralized space to plan, organize, track, and complete work efficiently.<br></br>
Whether you're managing a personal side project or collaborating across teams, ProjexHub adapts to your needs with flexible features and real-time updates.


      </p>
    <div className="hero-image">
      <img
        src={heroImage}
        alt="Project Management Illustration"
      />
    </div>
  
     <div className="features">
        <h2> Features</h2>
        <ul>
          <li> Create, edit, and delete projects & tasks</li>
          <li> Manage your team effortlessly</li>
          <li> Task Assignment & Tracking </li>
          <li> Team Collaboration </li>
          <li> Generate NLP-based summaries</li>
          <li> Stay organized and productive</li>
        </ul>

      <h2>Why Use ProjexHub?</h2>
      <ul>
        <li>Manage Multiple Projects</li>
        <li>Assign Tasks with Deadlines</li>
        <li>Team Collaboration</li>
        <li>Progress Analytics with Charts</li>
        <li>AI Summary Generator</li>
        <li>Admin & User Login</li>
        <li>Export Tasks to CSV</li>
      </ul>
      </div>
    </div>
  </div>
     <footer>
         © {new Date().getFullYear()}   ProjexHub | Saniya Bhagat • All Rights Reserved
       </footer> 
</div>
  );
}

export default Home;
