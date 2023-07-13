import React, { useState } from 'react';
import '../styles/pages/Register.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  let [showInfo, setShowInfo] = useState(false);

  function handleShowInfo() {
    setShowInfo(!showInfo);
  }

  return (
    <div className="registerPage">
      <Header />
      <div className="registerContainer">
        <div className="loginHeader">
          <h1>Register</h1>
        </div>
        <div className="registerLine">
          <div className="headRegisterColumn">
            <div>Email*</div>
          </div>
          <div className="inputRegisterColumn">
            <input
              className="registerInput"
              type="email"
              placeholder="Your email ..."
            />
          </div>
        </div>
        <div className="registerLine">
          <div className="headRegisterColumn">
            <div>Display Name*</div>
          </div>
          <div className="inputRegisterColumn">
            <input
              className="registerInput"
              type="text"
              placeholder="Your name ..."
            />
          </div>
        </div>
        <div className="registerLine">
          <div className="headRegisterColumn">
            <div>Password*</div>
          </div>
          <div className="inputRegisterColumn">
            <input
              className="registerInput"
              type="password"
              placeholder="Password ..."
            />
          </div>
        </div>
        <div className="registerLine">
          <div className="headRegisterColumn">
            <div>Confirm Password*</div>
          </div>
          <div className="inputRegisterColumn">
            <input
              className="registerInput"
              type="password"
              placeholder="Confirm password ..."
            />
          </div>
        </div>
        <div className="pmiLine">
          <div
            className="pmitoggle"
            onClick={() => {
              handleShowInfo();
            }}
          >
            Provide more information
          </div>
        </div>
        <div className={`pmiHiddineLine ${showInfo ? 'show ' : ''}`}>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Gender</div>
            </div>
            <div className="inputRegisterColumn">
              <div className="genderRadioRegister">
                <label>
                  <input
                    className="radioChoice"
                    type="radio"
                    value="Male"
                    name="gender"
                  />{' '}
                  Male
                </label>
                <label>
                  <input
                    className="radioChoice"
                    type="radio"
                    value="Female"
                    name="gender"
                  />{' '}
                  Female
                </label>
                <label>
                  <input
                    className="radioChoice"
                    type="radio"
                    value="Others"
                    name="gender"
                  />{' '}
                  Others
                </label>
              </div>
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Date of Birth</div>
            </div>
            <div className="inputRegisterColumn">
              <input
                className="registerInput"
                type="date"
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Phone</div>
            </div>
            <div className="inputRegisterColumn">
              <input
                className="registerInput"
                type="tel"
                placeholder="your phone number..."
              />
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div className="height2">Address</div>
            </div>
            <div className="inputRegisterColumn">
              <textarea
                className="registerInput address"
                type="text"
                placeholder="your address"
              />
            </div>
          </div>
        </div>
        <div className="buttonLine">
          <button className="submitBotton reset" type="reset">
            Reset
          </button>
          <button className="submitBotton register" type="submit">
            Register
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
