import React, { useReducer, useEffect } from 'react';
import RESTapi from '../config/services/RESTapi';
import { useNavigate } from 'react-router-dom';
import checkValue from '../config/services/CheckValueValidated';
import '../styles/pages/Register.css';
import Button from '../components/subcomponents/Button';

const initialState = {
  registerInfo: {
    email: {
      value: '',
      validator: { required: true, maxLength: 100 },
      error: { status: true, message: '', isTouched: false },
    },

    displayname: {
      value: '',
      validator: {
        required: true,
        maxLength: 50,
        minLength: 4,
      },
      error: { status: true, message: '', isTouched: false },
    },

    password: {
      value: '',
      validator: {
        required: true,
        minLength: 8,
        maxLength: 50,
        confirmPassword: '',
      },
      error: { status: true, message: '', isTouched: false },
    },
  },
  errorMessage: '',
  isPassValidate: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      const { field, value } = action.payload;
      let updatedState;
      if (field === 'confirmPassword') {
        updatedState = {
          ...state,
          registerInfo: {
            ...state.registerInfo,
            password: {
              ...state.registerInfo.password,
              validator: {
                ...state.registerInfo.password.validator,
                confirmPassword: value,
              },
            },
          },
        };

        updatedState.registerInfo.password.error = checkValue(
          updatedState.registerInfo.password
        );
      } else {
        updatedState = {
          ...state,
          registerInfo: {
            ...state.registerInfo,
            [field]: {
              ...state.registerInfo[field],
              value: value,
            },
          },
        };

        updatedState.registerInfo[field].error = checkValue(
          updatedState.registerInfo[field]
        );
      }

      return updatedState;

    case 'UPDATE_ERROR':
      const { field: errorField, payload: errorPayload } = action;
      return {
        ...state,
        registerInfo: {
          ...state.registerInfo,
          [errorField]: {
            ...state.registerInfo[errorField],
            error: {
              ...state.registerInfo[errorField].error,
              ...errorPayload,
            },
          },
        },
      };

    case 'RESET':
      return initialState;
    case 'UPDATE_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload.value,
      };
    case 'UPDATE_IsPassValidate':
      return {
        ...state,
        isPassValidate: action.payload.value,
      };
    default:
      return state;
  }
}

export default function Register() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { field: name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.isPassValidate) {
      return;
    } else {
      let registData = {
        email: state.registerInfo.email.value,
        displayname: state.registerInfo.displayname.value,
        password: state.registerInfo.password.value,
      };
      const confirmed = window.confirm('Confirm your infomation?');
      if (confirmed) {
        const response = await RESTapi.postRegisterUser(registData);
        if (response.registerSuccess) {
          window.alert(
            `Register Success!! Welcome ${state.registerInfo.displayname.value}`
          );
          navigate('/login');
          return;
        }
        if (response.registerError) {
          if (response.registerError.emailIsDup) {
            dispatch({
              type: 'UPDATE_ERROR',
              field: 'email',
              payload: {
                status: true,
                message: 'This Email is already taked',
                isTouched: true,
              },
            });
          }
          if (response.registerError.displaynameDup) {
            dispatch({
              type: 'UPDATE_ERROR',
              field: 'displayname',
              payload: {
                status: true,
                message: 'This Name is already taked',
                isTouched: true,
              },
            });
          }
          return;
        } else {
          dispatch({
            type: 'UPDATE_ERROR_MESSAGE',
            payload: { value: `Can't Register, Please try again later` },
          });
        }
      }
    }
  };

  const handleReset = () => {
    // Reset the form values and error statuses
    dispatch({ type: 'RESET' });
  };

  useEffect(() => {
    const isAllError =
      state.registerInfo.email.error.status ||
      state.registerInfo.displayname.error.status ||
      state.registerInfo.password.error.status;
    dispatch({
      type: 'UPDATE_IsPassValidate',
      payload: { field: 'isPassvalidate', value: !isAllError },
    });
  }, [
    state.registerInfo.email.error.status,
    state.registerInfo.displayname.error.status,
    state.registerInfo.password.error.status,
  ]);

  return (
    <div className="registerPage">
      <form onSubmit={handleSubmit} onReset={handleReset} autoComplete="off">
        <div className="registerContainer">
          <div className="loginHeader">
            <h1>Register</h1>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Email*</div>
            </div>
            <div className="inputRegisterColumn">
              <label>
                <input
                  className={`registerInput${
                    state.registerInfo.email.error.status &&
                    state.registerInfo.email.error.isTouched
                      ? ' isError'
                      : ''
                  }`}
                  type="email"
                  name="email"
                  value={state.registerInfo.email.value}
                  onChange={handleValueChange}
                  placeholder="Your email ..."
                />
              </label>
              <div className="warningMessage-register">
                {state.registerInfo.email.error.message}
              </div>
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Display Name*</div>
            </div>
            <div className="inputRegisterColumn">
              <label>
                <input
                  className={`registerInput${
                    state.registerInfo.displayname.error.status &&
                    state.registerInfo.displayname.error.isTouched
                      ? ' isError'
                      : ''
                  }`}
                  type="text"
                  name="displayname"
                  value={state.registerInfo.displayname.value}
                  onChange={handleValueChange}
                  placeholder="Your name ..."
                />
              </label>
              <div className="warningMessage-register">
                {state.registerInfo.displayname.error.message}
              </div>
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Password*</div>
            </div>
            <div className="inputRegisterColumn">
              <label>
                <input
                  className={`registerInput${
                    state.registerInfo.password.error.status &&
                    state.registerInfo.password.error.isTouched
                      ? ' isError'
                      : ''
                  }`}
                  type="password"
                  name="password"
                  value={state.registerInfo.password.value}
                  onChange={handleValueChange}
                  placeholder="Password ..."
                  autoComplete="off"
                />
              </label>
              <div className="warningMessage-register">
                {state.registerInfo.password.error.message}
              </div>
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Confirm Password*</div>
            </div>
            <div className="inputRegisterColumn">
              <label>
                <input
                  className={`registerInput${
                    state.registerInfo.password.error.status &&
                    state.registerInfo.password.error.isTouched
                      ? ' isError'
                      : ''
                  }`}
                  type="password"
                  name="confirmPassword"
                  value={state.registerInfo.password.validator.confirmPassword}
                  onChange={handleValueChange}
                  placeholder="Confirm password ..."
                  autoComplete="off"
                />
              </label>
            </div>
          </div>
          <div className="buttonLineRegister">
            <Button type="reset">Reset</Button>
            <Button isDisabled={!state.isPassValidate} type="submit">
              Register
            </Button>
          </div>
          <div className="warningMessage-register lastline">
            {state.errorMessage}
          </div>
        </div>
      </form>
    </div>
  );
}
