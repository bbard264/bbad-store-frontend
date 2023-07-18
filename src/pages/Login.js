import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Login.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Token from '../config/services/Token';

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

const login = async (loginData) => {
  try {
    const apilink = '/api/user/login';
    const response = await axios.post(apilink, loginData);
    console.log('requestAPI', apilink);
    return response.data;
  } catch (error) {
    if (error.response.status === 500) {
      return {
        canLogin: false,
        message: "Can't Login, Please try again later",
      };
    }
    return error.response.data;
  }
};

export default function Login(porps) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { field: name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.status.isAllFill) {
      console.log('please fill');
      return;
    }

    if (state.countLogin > 5) {
      console.log('Excess limit login');
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

    const responseLogin = await login(loginData);
    dispatch({
      type: 'UPDATE_COUNT_LOGIN',
      payload: { value: state.countLogin + 1 },
    });

    if (responseLogin.token) {
      window.alert(responseLogin.message);
      Token.setToken(responseLogin.token);
      porps.setRole('user');
      navigate('/');
      return;
    }

    dispatch({
      type: 'UPDATE_ERROR_MESSAGE',
      payload: { value: responseLogin.message },
    });
  };

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

  return (
    <div className="loginPage">
      <Header />
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
          <div
            className="loginLink"
            onClick={() => navigate('/login/forget-password')}
          >
            Forget Password
          </div>
        </div>
        <div className="submitLogin">
          <button
            className={`submitBotton ${
              state.status.isAllFill && state.status.canLogin
                ? ''
                : 'disbled-login'
            }`}
            type="submit"
            form="loginForm"
          >
            Sign In
          </button>
          <div className="warningMessage-login">{state.errorMessage}</div>
        </div>
        <div className="registerLinkLine">
          <div className="loginLink" onClick={() => navigate('/register')}>
            You haven't any account? Sign Up
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
