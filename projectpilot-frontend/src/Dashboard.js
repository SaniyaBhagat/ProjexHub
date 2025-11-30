import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { db } from './firebase';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch all tasks
        const taskSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = taskSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);

        // Fetch all users
        const userSnapshot = await getDocs(collection(db, 'users'));
        const usersData = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAll();
  }, []);

  const totalTasks = tasks.length;

  const statusCounts = tasks.reduce((acc, task) => {
    const status = task.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // When admin clicks a user, fetch their tasks based on project
  const handleUserClick = async (user) => {
    setSelectedUser(user);

    const userProject = user.projectsAssigned; // Use correct field name

    console.log('Selected user:', user);
    console.log('User project:', userProject);

    if (!userProject) {
      setUserTasks([]);
      return;
    }

    try {
      const q = query(collection(db, 'tasks'), where('project', '==', userProject));
      const userTaskSnapshot = await getDocs(q);

      const userTasksData = userTaskSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('User tasks fetched:', userTasksData);

      setUserTasks(userTasksData);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      setUserTasks([]);
    }
  };

  return (
  
    <div className="dashboard" style={{ maxWidth: 1100, margin: 'auto' }}>
  <h4>📊 Dashboard</h4>
  <div>Total Tasks: <strong>{totalTasks}</strong></div>

  <PieChart width={800} height={550}>
    <Pie
      data={pieData}
      cx={350}
      cy={250}
      outerRadius={160}
      label
      dataKey="value"
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
      <hr />
      <h3>👥 Registered Users</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => handleUserClick(user)}
              style={{ cursor: 'pointer', backgroundColor: '#ef5353ff', border: 'none', padding: '8px 12px', borderRadius: 4 }}
            >
              {user.name} ({user.email})
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (


<div className="user-report">
  <h3>📋 Report for {selectedUser.name}</h3>

  <p><strong>Email:  </strong> {selectedUser.email}</p>

  <p><strong>Team:  </strong> {selectedUser.team || 'N/A'}</p>

  <p><strong>Project:  </strong> {selectedUser.projectsAssigned || 'N/A'}</p>


          <ul>
            {userTasks.map(task => (
              <li key={task.id}>
                {task.title || task.name || 'Unnamed Task'} – <em>{task.status || 'Unknown status'}</em>
              </li>
            ))}
          </ul>
        </div>
      )} <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
};

export default Dashboard;








