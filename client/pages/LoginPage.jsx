import React from 'react';
import './LoginPage.css';

const LoginPage = () => {

  return (
    <div>
      <div className="login-container">
        <form className="login-form">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your portal.</p>

          <div className="input-group">
            <i className="fas fa-user"></i>
            <input type="text" id="username" required placeholder=" " />
            <label htmlFor="username">Username</label>
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input type="password" id="password" required placeholder=" " />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="form-footer">
            <a href="#">Forgot Password?</a>
            <a href="#">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;