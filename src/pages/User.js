import React, { useState, useEffect } from 'react';
import '../styles/pages/User.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import kuri from '../assets/ex_products/kuri.jpg';

let userData = {};

function userNavi(handleMenuClick, contentNow) {
  let isProfile = false;
  let isAccount = false;
  let isSettings = false;

  if (contentNow === 'Profile') {
    isProfile = true;
    isAccount = false;
    isSettings = false;
  }
  if (contentNow === 'Account') {
    isProfile = false;
    isAccount = true;
    isSettings = false;
  }
  if (contentNow === 'Settings') {
    isProfile = false;
    isAccount = false;
    isSettings = true;
  }

  return (
    <div className="userNaviBox">
      <div
        className={`${isProfile ? 'userCurrent' : ''}`}
        onClick={() => handleMenuClick('Profile')}
      >
        Profile
      </div>
      <div
        className={`${isAccount ? 'userCurrent' : ''}`}
        onClick={() => handleMenuClick('Account')}
      >
        Account
      </div>
      <div
        className={`${isSettings ? 'userCurrent' : ''}`}
        onClick={() => handleMenuClick('Settings')}
      >
        Settings
      </div>
    </div>
  );
}

function UserProfile({ userData }) {
  return (
    <div className="userProfileBox">
      <div className="uPPhotoLine">
        <div className="uHeadLine">photo</div>
        <div className="uPphotoContainer">
          <div className="uPphotoBox">
            <img src={kuri} alt="userData.photo" />
          </div>
          <button className="uButton">Change</button>
        </div>
      </div>
      <div className="uPPersonalLine">
        <div className="uPNameBox">
          <div className="uHeadLine">Name</div>
          <input className="uinput" type="text" defaultValue="userData.name" />
        </div>
        <div className="uPGenderBox">
          <div className="uHeadLine">Gender</div>
          <div className="radioChoiceBox">
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
        <div className="uPEmailBox">
          <div className="uHeadLine">Email</div>
          <input
            className="uinput"
            type="email"
            defaultValue="userData.email"
          />
        </div>
        <div className="uPDoBBox">
          <div className="uHeadLine">Date of Birth</div>
          <input className="uinput" type="date" defaultValue="1995-03-03" />
        </div>
        <div className="uPPhoneBox">
          <div className="uHeadLine">Phone</div>
          <input className="uinput" type="tel" defaultValue="userData.phone" />
        </div>
        <div className="uPAddressBox">
          <div className="uHeadLine">Address</div>
          <input
            className="uinput address"
            type="text"
            defaultValue="userData.address"
          />
        </div>
      </div>
      <div className="uButtonLine">
        <button className="uButton reset" type="reset">
          Reset
        </button>
        <button className="uButton register" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
}
function UserAccount({ userData }) {
  return (
    <div className="userAccountBox">
      <div className="cusIDLine">
        <div className="uAcusIDBox">
          <div className="uHeadLine">Customer ID</div>
          <input
            className="uinput account"
            type="text"
            defaultValue="userData.id"
            disabled
          />
        </div>
      </div>
      <div className="passwordLine">
        <div className="uAPasswordBox">
          <div className="uHeadLine">Password</div>
          <input
            className="uinput account"
            type="text"
            defaultValue="userData.password"
            disabled
          />
          <button className="uButton">Change</button>
        </div>
        <div className="changingPasswordLine">
          <div className="uAChangingPasswordBox">
            <div className="uHeadLine">Changing Password</div>
            <input
              className="uinput account"
              type="text"
              placeholder="Enter new password"
            />
          </div>
          <div className="uAConfirmNewPasswordBox">
            <input
              className="uinput account"
              type="text"
              placeholder="Confirm new password"
            />
            <button className="uButton" type="submit">
              Submit
            </button>
            <button className="uButton" type="reset">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="DeactivateLine">
        <div className="uPNameBox">
          <div className="uHeadLine">Deactivate account</div>
        </div>
      </div>
      <div className="DeleteAccountLine">
        <div className="uPNameBox">
          <div className="uHeadLine">Delete account</div>
        </div>
      </div>
    </div>
  );
}
function UserSettings({ userData }) {
  return (
    <div className="userSettingsBox">
      <div className="changeLanguageLine">
        <div className="uHeadLine">Language</div>
        <select>
          <option value="">userData.language</option>
          <option value="English">English</option>
          <option value="ไทย">ไทย</option>
        </select>
        <button className="uButton">Submit</button>
      </div>
    </div>
  );
}

export default function User() {
  let [contentNow, setContent] = useState('Profile');

  function handleMenuClick(state) {
    if (contentNow === state) {
      return;
    }
    setContent(state);
  }

  function showContent(contentNow) {
    if (contentNow === 'Profile') {
      return <UserProfile userData={userData} />;
    }
    if (contentNow === 'Account') {
      return <UserAccount userData={userData} />;
    }
    if (contentNow === 'Settings') {
      return <UserSettings userData={userData} />;
    } else {
      return;
    }
  }

  return (
    <div className="userPage">
      <Header />
      <div className="userContainer">
        <div className="userNaviContainer">
          {userNavi(handleMenuClick, contentNow)}
        </div>
        <div className="userContentContainer">{showContent(contentNow)}</div>
      </div>
      <Footer />
    </div>
  );
}
