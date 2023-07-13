import React from 'react';
import '../styles/pages/Login.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  return (
    <div className="loginPage">
      <Header />
      <div className="loginContainer width60">
        <div className="loginHeader">
          <h1>Sign In</h1>
        </div>
        <div className="apiLogin"></div>
        <div className="emailpassLine">
          <input className="inputEmail" placeholder="Email .." type="text" />
          <input
            className="inputPassword"
            placeholder="Password .."
            type="password"
          />
        </div>
        <div className="forgetPassLine">
          <a className="loginLink" href="#">
            Forget Password
          </a>
        </div>
        <div className="submitLogin">
          <button className="submitBotton" type="submit">
            Sign In
          </button>
        </div>
        <div className="registerLinkLine">
          <a className="loginLink" href="/register">
            You haven't any account? Sign Up
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
