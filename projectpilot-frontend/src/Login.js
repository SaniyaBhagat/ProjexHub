import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [loginRole, setLoginRole] = useState(''); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async () => {
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Save role and email to localStorage (optional)
      localStorage.setItem('currentUser', JSON.stringify({ email, role: loginRole }));

      // Logic: check hardcoded login emails
      if (loginRole === 'admin' && email === 'admin@project.com') {
        navigate('/dashboard');
      } else if (loginRole === 'user' && email === 'user@project.com') {
        navigate('/user-register');
      } else {
        setError('Email does not match selected role.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 20, textAlign: 'center' }}>
      <h2>🔐Login</h2>

      {!loginRole && (
        <>
          <p>Please select your role to continue:</p>
          <button
            onClick={() => setLoginRole('user')}
            style={{ margin: '10px', padding: '10px 20px' }}
          >
            User Login
          </button>
          <button
            onClick={() => setLoginRole('admin')}
            style={{ margin: '10px', padding: '10px 20px' }}
          >
            Admin Login
          </button>
        </>
      )}

      {/* Step 2: Show Login Form */}
      {loginRole && (
        <>
          <p style={{ fontWeight: 'bold' }}>
            {loginRole === 'admin' ? 'Admin Login' : 'User Login'}
          </p>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, marginBottom: 10, width: '100%' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, marginBottom: 10, width: '100%' }}
          />
          <button onClick={handleLogin} style={{ padding: 10, width: '100%' }}>
            Login
          </button>
          <br />
          <button
            onClick={() => {
              setLoginRole('');
              setEmail('');
              setPassword('');
              setError('');
            }}
            style={{ marginTop: 10 }}
          >
            ⬅ Back
          </button>
        </>
      )}
       <footer style={{ marginTop: '20px', padding: '10px 0', borderTop: '1px solid #ccc' }}>
      © {new Date().getFullYear()} ProjexHub | Saniya Bhagat • All Rights Reserved
    </footer>
    </div>
  );
}

export default Login;
