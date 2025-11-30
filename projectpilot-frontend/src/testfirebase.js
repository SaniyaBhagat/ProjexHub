// src/TestFirebase.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function TestFirebase() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);

  // Function to add a document
  const addData = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'testCollection'), {
        text: message,
        createdAt: new Date(),
      });
      setMessage('');
      alert('Document added successfully!');
    } catch (e) {
      alert('Error adding document: ' + e.message);
    }
    setLoading(false);
  };

  // Function to get documents
  const getData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'testCollection'));
      const allDocs = [];
      querySnapshot.forEach((doc) => {
        allDocs.push({ id: doc.id, ...doc.data() });
      });
      setDocs(allDocs);
    } catch (e) {
      alert('Error fetching documents: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Firebase Firestore Test</h2>
      <input
        type="text"
        placeholder="Enter some text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: 10, width: '100%', marginBottom: 10 }}
      />
      <button onClick={addData} disabled={loading || !message} style={{ marginRight: 10 }}>
        Add Data
      </button>
      <button onClick={getData} disabled={loading}>
        Get Data
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Documents:</h3>
        {docs.length === 0 && <p>No documents found.</p>}
        {docs.map((doc) => (
          <div key={doc.id} style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
            {doc.text} <br />
            <small>{doc.createdAt?.toDate ? doc.createdAt.toDate().toString() : doc.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestFirebase;
