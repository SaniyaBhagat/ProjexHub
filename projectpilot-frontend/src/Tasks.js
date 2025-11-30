import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase'; // your firebase.js exports 'db'

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', status: '', assignedTo: '', projectId: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', status: '', assignedTo: '', projectId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const tasksCollectionRef = collection(db, 'tasks');
  const projectsCollectionRef = collection(db, 'projects');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDocs(tasksCollectionRef);
      const tasksData = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getDocs(projectsCollectionRef);
      const projectsData = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.status.trim() || !newTask.assignedTo.trim() || !newTask.projectId.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    try {
      await addDoc(tasksCollectionRef, newTask);
      setNewTask({ title: '', status: '', assignedTo: '', projectId: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to add task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({
      title: task.title || '',
      status: task.status || '',
      assignedTo: task.assignedTo || '',
      projectId: task.projectId || ''
    });
    setFormError('');
  };

  const handleUpdate = async (id) => {
    if (!editedTask.title.trim() || !editedTask.status.trim() || !editedTask.assignedTo.trim() || !editedTask.projectId.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, editedTask);
      setEditingTaskId(null);
      setEditedTask({ title: '', status: '', assignedTo: '', projectId: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  const getProjectName = (id) => projects.find((p) => p.id === id)?.name || 'Unknown Project';

  // Group tasks by project name
  const groupedTasks = tasks.reduce((acc, task) => {
    const projectName = getProjectName(task.projectId);
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(task);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 950, margin: 'auto', padding: 20 }}>
      <h4>📝 Tasks</h4>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="text"
          placeholder="Status"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          style={{ marginRight: 10, padding: 10 }}
        />
        <input
          type="text"
          placeholder="Assigned To"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          style={{ marginRight: 10, padding: 10 }}
        />
        <select
          value={newTask.projectId}
          onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
          style={{ padding: 10 }}
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {formError && <p style={{ color: 'red' }}>{formError}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading tasks...</p>}

      {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
        <div key={projectName} style={{ marginBottom: 30 }}>
          <h5>📁 {projectName}</h5>
          <ul style={{ listStyle: 'none', paddingLeft: 10 }}>
            {projectTasks.map((task) => (
              <li key={task.id} style={{ marginBottom: 10 }}>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      style={{ marginRight: 10, padding: 5 }}
                    />
                    <input
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                      style={{ marginRight: 10, padding: 5 }}
                    />
                    <input
                      value={editedTask.assignedTo}
                      onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
                      style={{ marginRight: 10, padding: 5 }}
                    />
                    <select
                      value={editedTask.projectId}
                      onChange={(e) => setEditedTask({ ...editedTask, projectId: e.target.value })}
                      style={{ padding: 5, marginRight: 10 }}
                    >
                      <option value="">Select Project</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                      ))}
                    </select>
                    <button onClick={() => handleUpdate(task.id)} style={{ marginRight: 5 }}>
                      Save
                    </button>
                    <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{task.title}</strong> — {task.status}
                      <br />
                      <small>👤 Assigned To: <strong>{task.assignedTo}</strong></small>
                    </div>
                    <div>
                      <button onClick={() => handleEdit(task)} style={{ marginRight: 5 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
       <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
}

export default Tasks;









