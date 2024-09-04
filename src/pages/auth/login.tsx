import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { loginSuccess } from '../../redux/slices/authSlice';
import axios from 'axios';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token, role } = response.data;
      dispatch(loginSuccess({ token, role }));
      if (role === 'administrator') {
        router.push('/admin');
      } else {
        router.push('/customer');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
        <button onClick={handleLogin} className={styles.loginButton}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
