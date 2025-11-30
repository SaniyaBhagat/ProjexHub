import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase'; // adjust path if needed

function Teams() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    teamName: '',
    project: '',
    members: [{ name: '', role: '' }],
  });
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeam, setEditedTeam] = useState(null);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');

  const teamsCollectionRef = collection(db, 'teams');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await getDocs(teamsCollectionRef);
      const teamsData = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch teams.');
    }
  };

  const handleMemberChange = (index, field, value, isEdit = false) => {
    const teamToUpdate = isEdit ? { ...editedTeam } : { ...newTeam };
    const updatedMembers = [...teamToUpdate.members];
    updatedMembers[index][field] = value;
    teamToUpdate.members = updatedMembers;

    isEdit ? setEditedTeam(teamToUpdate) : setNewTeam(teamToUpdate);
  };

  const handleAddMemberField = (isEdit = false) => {
    const teamToUpdate = isEdit ? { ...editedTeam } : { ...newTeam };
    teamToUpdate.members.push({ name: '', role: '' });

    isEdit ? setEditedTeam(teamToUpdate) : setNewTeam(teamToUpdate);
  };

  const handleDeleteMember = (index, isEdit = false) => {
    const teamToUpdate = isEdit ? { ...editedTeam } : { ...newTeam };
    teamToUpdate.members.splice(index, 1);

    isEdit ? setEditedTeam(teamToUpdate) : setNewTeam(teamToUpdate);
  };

  const handleAddTeam = async () => {
    if (!newTeam.teamName.trim() || !newTeam.project.trim()) {
      setFormError('Team Name and Project are required.');
      return;
    }

    const incomplete = newTeam.members.some(
      (m) => !m.name.trim() || !m.role.trim()
    );
    if (incomplete) {
      setFormError('All members must have Name and Role.');
      return;
    }

    setFormError('');
    try {
      await addDoc(teamsCollectionRef, newTeam);
      setNewTeam({ teamName: '', project: '', members: [{ name: '', role: '' }] });
      fetchTeams();
    } catch (err) {
      console.error(err);
      setError('Failed to add team.');
    }
  };

  const handleEdit = (team) => {
    setEditingTeamId(team.id);
    setEditedTeam({ ...team });
    setFormError('');
  };

  const handleUpdateTeam = async (id) => {
    if (!editedTeam.teamName.trim() || !editedTeam.project.trim()) {
      setFormError('Team Name and Project are required.');
      return;
    }

    const incomplete = editedTeam.members.some(
      (m) => !m.name.trim() || !m.role.trim()
    );
    if (incomplete) {
      setFormError('All members must have Name and Role.');
      return;
    }

    setFormError('');
    try {
      const teamDoc = doc(db, 'teams', id);
      await updateDoc(teamDoc, editedTeam);
      setEditingTeamId(null);
      setEditedTeam(null);
      fetchTeams();
    } catch (err) {
      console.error(err);
      setError('Failed to update team.');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const teamDoc = doc(db, 'teams', id);
        await deleteDoc(teamDoc);
        fetchTeams();
      } catch (err) {
        console.error(err);
        setError('Failed to delete team.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h4>👥 Team Management</h4>

      <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 8, marginBottom: 30 }}>
        <h3>🛠 Form a Team</h3>

        <input
          type="text"
          placeholder="Team Name"
          value={newTeam.teamName}
          onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="text"
          placeholder="Project Name"
          value={newTeam.project}
          onChange={(e) => setNewTeam({ ...newTeam, project: e.target.value })}
          style={{ padding: 5 }}
        />

        <h4 style={{ marginTop: 15,fontSize:'25px' }}>👥 Team Members</h4>
        {newTeam.members.map((member, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
              style={{ marginRight: 10, padding: 5 }}
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
              style={{ padding: 5 }}
            />
            {newTeam.members.length > 1 && (
              <button onClick={() => handleDeleteMember(idx)}>Delete</button>
            )}
          </div>
        ))}

        <button onClick={() => handleAddMemberField()} style={{ marginRight: 10 }}>
          Add Member
        </button>
        <button
          onClick={handleAddTeam}
        >
          Form Team
        </button>

        {formError && <p style={{ color: 'red', marginTop: 10 }}>{formError}</p>}
      </div>

      <h3> Formed Teams</h3>
      {teams.length === 0 ? (
        <li>No teams formed yet.</li>
      ) : (
        teams.map((team) =>
          editingTeamId === team.id ? (
            <div
              key={team.id}
              style={{ marginBottom: 0, padding: 15, border: '2px dashed #888', borderRadius: 8 }}
            >
              <h4> Edit Team</h4>
              <input
                type="text"
                placeholder="Team Name"
                value={editedTeam.teamName}
                onChange={(e) => setEditedTeam({ ...editedTeam, teamName: e.target.value })}
                style={{ marginRight: 10, padding: 5 }}
              />
              <input
                type="text"
                placeholder="Project"
                value={editedTeam.project}
                onChange={(e) => setEditedTeam({ ...editedTeam, project: e.target.value })}
                style={{ padding: 5 }}
              />

              <h5>👥 Members:</h5>
              {editedTeam.members.map((m, idx) => (
                <div key={idx} style={{ marginBottom: 3 }}>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value, true)}
                    placeholder="Name"
                    style={{ marginRight: 10, padding: 5 }}
                  />
                  <input
                    type="text"
                    value={m.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value, true)}
                    placeholder="Role"
                    style={{ padding: 5 }}
                  />
                  {editedTeam.members.length > 1 && (
                    <button onClick={() => handleDeleteMember(idx, true)}>Delete</button>
                  )}
                </div>
              ))}

              <button onClick={() => handleAddMemberField(true)} style={{ marginTop: 5 }}>
                Add Member
              </button>
              <br />
              <button onClick={() => handleUpdateTeam(team.id)} style={{ marginRight: 10, marginTop: 10 }}>
                Save
              </button>
              <button onClick={() => setEditingTeamId(null)}>Cancel</button>
            </div>
          ) : (
            <div
              key={team.id}
              style={{
                fontSize:'25px',
                marginBottom: 15,
                padding: 15,
                marginLeft:'15px',
                border: '1px solid #ddd',
                borderRadius: 8,
                background: '#f9f9f9',
              }}
            >

              <p 
  style={{
    fontSize: '35px',
    marginBottom: '5px',
    color: '#3c355dff',
    marginLeft:'0px',
    fontFamily: "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
    fontWeight: '600'
  }}
>
  Team:   {team.teamName}
</p>

<h3
  style={{
    marginTop: '5px',
    marginBottom: '5px',
    color: '#773c34ff',marginLeft:'20px'
  }}
>
  Project:   <strong>{team.project}</strong>
</h3>
         <h5 className="members-title">👥 Members</h5>

<div className="members-list">
  {team.members.map((m, i) => (
    <div className="member-row" key={i}>
      <span className="member-name">    {m.name}</span>
      <span className="member-divider"> —  </span>
      <span className="member-role">    {m.role}</span>
    </div>
  ))}
</div>

              <button onClick={() => handleEdit(team)} style={{ marginRight: 10 }}>
                Edit Team
              </button>
              <button
                onClick={() => handleDeleteTeam(team.id)}
              >
                Delete Team
              </button>
            </div>
          )
        )
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
       <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
    
  );
}

export default Teams;


