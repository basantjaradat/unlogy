'use client';
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGoogle,
  faApple
} from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill in both username and password.');
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:5151/api/Accounts/login',
        {
          username,
          password
        }
      );

      toast.success('🎉 Login successful!');
      localStorage.setItem('token', response.data.token);
      // Redirect to dashboard or any other page
      // window.location.href = '/dashboard';
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(`Login failed: ${error.response.data.message}`);
      } else {
        toast.error('Login failed. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <header className="navbar">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <ul className="nav-links">
            <li><a href="/public">Home</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </header>

        <h2>Login to Your Account</h2>
        <p>Login with social network</p>

        <div className="social-icons">
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faGoogle} />
          <FontAwesomeIcon icon={faApple} />
        </div>

        <div className="divider">OR</div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="toggle-password"
              onClick={togglePasswordVisibility}
            />
          </div>

          <div className="password">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forget password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      <div className="login-right">
        <h2>New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities</p>
        <button className="sign-up-btn" onClick={handleSignUp}>Sign Up</button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
