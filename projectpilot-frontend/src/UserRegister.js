import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [project, setProject] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [registeredNames, setRegisteredNames] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch current user and registered names
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);

        // Fetch all registered users
        const querySnapshot = await getDocs(collection(db, 'users'));
        const names = querySnapshot.docs.map(doc => doc.data().name?.toLowerCase().trim());
        setRegisteredNames(names);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !team || !project) {
      alert('Please fill in all fields.');
      return;
    }

    const lowerName = name.toLowerCase().trim();

    if (registeredNames.includes(lowerName)) {
      alert('You are already registered. Redirecting to home...');
      navigate('/home');
      return;
    }

    try {
      const newUserId = `${lowerName}-${Date.now()}`; // make unique doc ID
      await setDoc(doc(db, 'users', newUserId), {
        name,
        email,
        team,
        project,
        projectsAssigned: project,
        registeredAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'user',
        isRegistered: true,
      });

      alert('Registration successful!');
      navigate('/home');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team"
          className="w-full border p-2 rounded"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project Assigned"
          className="w-full border p-2 rounded"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          type="email"
          value={email}
          disabled
          className="w-full border p-2 rounded bg-gray-100 text-gray-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
       <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
};

export default UserRegister;
