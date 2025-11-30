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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', status: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProject, setEditedProject] = useState({ name: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Reference to 'projects' collection in Firestore
  const projectsCollectionRef = collection(db, 'projects');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getDocs(projectsCollectionRef);
      // Map Firestore docs to array with id
      const projectsData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim() || !newProject.status.trim()) {
      setFormError('Both Project Name and Status are required.');
      return;
    }

    try {
      await addDoc(projectsCollectionRef, newProject);
      setNewProject({ name: '', status: '' });
      setFormError('');
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to add project.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const projectDoc = doc(db, 'projects', id);
      await deleteDoc(projectDoc);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);
    setEditedProject({ name: project.name, status: project.status });
    setFormError('');
  };

  const handleUpdate = async (id) => {
    if (!editedProject.name.trim() || !editedProject.status.trim()) {
      setFormError('Both Project Name and Status are required.');
      return;
    }

    try {
      const projectDoc = doc(db, 'projects', id);
      await updateDoc(projectDoc, editedProject);
      setEditingProjectId(null);
      setEditedProject({ name: '', status: '' });
      setFormError('');
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to update project.');
    }
  };

  const generateSummary = (projectId) => {
    // As you don't have tasks collection here integrated with Firestore,
    // you can expand this part after adding tasks firestore logic.
    alert('Generate summary feature needs task data integration.');
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h4>📁 Projects</h4>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="text"
          placeholder="Status"
          value={newProject.status}
          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          style={{ marginRight: 10, padding: 5 }}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      {formError && <p style={{ color: 'red' }}>{formError}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading projects...</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {projects.map((project) => (
          <li key={project.id} style={{ marginBottom: 15 }}>
            {editingProjectId === project.id ? (
              <>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  style={{ marginRight: 10, padding: 5 }}
                />
                <input
                  type="text"
                  value={editedProject.status}
                  onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                  style={{ marginRight: 10, padding: 5 }}
                />
                <button onClick={() => handleUpdate(project.id)} style={{ marginRight: 5 }}>
                  Save
                </button>
                <button onClick={() => setEditingProjectId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{project.name}</strong> — {project.status}
                <button
                  onClick={() => handleEdit(project)}
                  style={{ marginLeft: 10, marginRight: 5 }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)} style={{ marginRight: 5 }}>
                  Delete
                </button>
                <button onClick={() => generateSummary(project.id)}>Generate Summary</button>
              </>
            )}
          </li>
        ))}
      </ul>
       <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
}

export default Projects;



