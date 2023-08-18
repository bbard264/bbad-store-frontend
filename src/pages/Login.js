import React, { useReducer, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Login.css';
import Button from '../components/subcomponents/Button';

import Token from '../config/services/Token';
import RESTapi from '../config/services/RESTapi';

const initialState = {
  email: {
    value: '',
    isFill: false,
  },

  password: {
    value: '',
    isFill: false,
  },

  status: { isAllFill: false, canLogin: true },
  errorMessage: '',
  countLogin: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          value: action.payload.value,
          isFill: action.payload.value !== '',
        },
      };
    case 'UPDATE_STATUS':
      const { field, value } = action.payload;
      return {
        ...state,
        status: {
          ...state.status,
          [field]: value,
        },
      };
    case 'UPDATE_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload.value,
      };
    case 'UPDATE_COUNT_LOGIN':
      return {
        ...state,
        countLogin: action.payload.value,
      };

    default:
      return state;
  }
};

export default function Login(porps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousRoute, setPreviousRoute] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const isFormFilled = state.email.isFill && state.password.isFill;
    dispatch({
      type: 'UPDATE_STATUS',
      payload: { field: 'isAllFill', value: isFormFilled },
    });
  }, [state.email.isFill, state.password.isFill]);

  useEffect(() => {
    if (state.status.canLogin) {
      dispatch({
        type: 'UPDATE_COUNT_LOGIN',
        payload: { value: 0 },
      });
      dispatch({
        type: 'UPDATE_ERROR_MESSAGE',
        payload: { value: '' },
      });
    }
  }, [state.status.canLogin]);

  useEffect(() => {
    setPreviousRoute(location.state?.from || '/');
  }, [location.state]);

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { field: name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.status.isAllFill) {
      return;
    }

    if (state.countLogin > 5) {
      dispatch({
        type: 'UPDATE_STATUS',
        payload: { field: 'canLogin', value: false },
      });
      dispatch({
        type: 'UPDATE_ERROR_MESSAGE',
        payload: { value: 'Excess limit Login' },
      });
      return;
    }
    const loginData = {
      email: state.email.value,
      password: state.password.value,
    };

    dispatch({
      type: 'UPDATE_COUNT_LOGIN',
      payload: { value: state.countLogin + 1 },
    });

    const responseLogin = await RESTapi.login(loginData);

    if (responseLogin.token) {
      window.alert(responseLogin.message);
      Token.setToken(responseLogin.token);

      try {
        await RESTapi.fetchUserInfo();

        navigate(previousRoute);
        porps.setRole('user');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
      return;
    }

    dispatch({
      type: 'UPDATE_ERROR_MESSAGE',
      payload: { value: responseLogin.message },
    });
  };

  const onClikcloginDemo = async (user) => {
    const email = `${user}@bbad.com`;
    const password = '12341234';
    const loginData = {
      email: email,
      password: password,
    };

    const responseLogin = await RESTapi.login(loginData);

    if (responseLogin.token) {
      window.alert(responseLogin.message);
      Token.setToken(responseLogin.token);

      try {
        await RESTapi.fetchUserInfo();

        navigate(previousRoute);
        porps.setRole('user');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
      return;
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer width60">
        <div className="loginHeader">
          <h1>Sign In</h1>
        </div>
        <div className="apiLogin"></div>

        <form className="emailpassLine" onSubmit={handleSubmit} id="loginForm">
          <input
            className="inputEmail"
            name="email"
            placeholder="Email .."
            type="Email"
            autoComplete="email"
            onChange={handleValueChange}
          />
          <input
            className="inputPassword"
            name="password"
            placeholder="Password .."
            type="password"
            autoComplete="current-password"
            onChange={handleValueChange}
          />
        </form>

        <div className="forgetPassLine">
          <div className="loginLink" onClick={null}>
            Forget Password?
          </div>
        </div>
        <div className="submitLogin">
          <Button
            isDisabled={!(state.status.isAllFill && state.status.canLogin)}
            type="submit"
            form="loginForm"
          >
            Sign In
          </Button>
          <div
            className={`warningMessage-login${
              state.errorMessage === '' ? ' hide' : ''
            }`}
          >
            {state.errorMessage === '' ? 'HELLO' : state.errorMessage}
          </div>
        </div>
        <div className="registerLinkLine">
          <div className="loginLink" onClick={() => navigate('/register')}>
            You haven't any account? Sign Up
          </div>
        </div>
      </div>
      <div className="forDemoBox">
        <div>
          {`Demo version: block ability to [Create New User] and [Edit/Remove User
          Infomations]`}
        </div>
        <div>Choose this provided user to Explore website</div>
        <div>
          <Button onClick={() => onClikcloginDemo('fizri')}>USER: Fizri</Button>
          <Button onClick={() => onClikcloginDemo('burni')}>USER: Burni</Button>
          <Button onClick={() => onClikcloginDemo('kuri')}>USER: Kuri</Button>
        </div>
      </div>
    </div>
  );
}
