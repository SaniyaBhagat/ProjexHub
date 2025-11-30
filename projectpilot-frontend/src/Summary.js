import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';

function Summary() {
  const [tasks, setTasks] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const projectsSnapshot = await getDocs(collection(db, 'projects'));

      const taskList = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const projectMapTemp = {};
      projectsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`Project docId: ${doc.id}, name: ${data.name}`);
        projectMapTemp[doc.id] = data.name || 'Unnamed Project';
      });

      console.log('Tasks loaded:', taskList);

      setTasks(taskList);
      setProjectMap(projectMapTemp);
    } catch (error) {
      console.error('Firestore fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    if (tasks.length === 0) {
      setSummary('No tasks found to summarize.');
      return;
    }

    const summaryByProject = {};

    tasks.forEach(task => {
      const projName = projectMap[task.projectId];
      if (!projName) {
        console.warn(`Project ID not found for task ${task.id}: projectId=${task.projectId}`);
      }

      const projectNameToUse = projName || 'Unnamed Project';

      if (!summaryByProject[projectNameToUse]) {
        summaryByProject[projectNameToUse] = { total: 0, completed: 0, running: 0, pending: 0 };
      }

      summaryByProject[projectNameToUse].total++;

      const status = (task.status || '').toLowerCase();
      if (status === 'completed') {
        summaryByProject[projectNameToUse].completed++;
      } else if (status === 'pending') {
        summaryByProject[projectNameToUse].pending++;
      } else {
        summaryByProject[projectNameToUse].running++;
      }
    });

    let result = '📊 Task Summary by Project:  \n\n';
    Object.entries(summaryByProject).forEach(([projectName, stats]) => {
      result += `📁 ${projectName}\n`;
      result += `   Completed-${stats.completed}\n`;
      result += `   Running-${stats.running}\n`;
      result += `   Pending-${stats.pending}\n`;
      result += `   Total-${stats.total}\n\n`;
    });    
    setSummary(result);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h4>📍 Project Task Summary</h4>

      <button onClick={generateSummary} disabled={loading}>
        {loading ? '⏳ Loading data...' : '📋 Generate Summary'}
      </button>

      {summary && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20, padding: 12, backgroundColor: '#f4f4f4', borderRadius: 8 }}>
          {summary}
        </pre>
      )}
       <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
}

export default Summary;
