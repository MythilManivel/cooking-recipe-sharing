// client/src/components/Auth/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot_password', {
        email,
        new_password: newPassword
      });
      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setMessage('Failed to reset password.');
      setSuccess(false);
    }
  };

  return (
    <div
      className="forgot-password-container"
      style={{
        backgroundImage:
          "url('https://www.instacart.com/company/wp-content/uploads/2022/10/buffet-food-1050x525.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(6px)',
        padding: '2rem'
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.65)',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="logo" style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <a href="/" title="Home" style={{ color: 'white' }}>
            <i className="fas fa-home"></i>
          </a>
          <i className="fas fa-seedling"></i>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Reset Password</h2>
        {message && (
          <div
            style={{
              backgroundColor: success ? '#4caf50' : '#f44336',
              color: 'white',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              textAlign: 'center'
            }}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none' }}
            />
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: 'none' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              backgroundColor: '#ff9800',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
