import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Register.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const initialState = {
  registerInfo: {
    email: {
      value: '',
      validator: { required: true },
      error: { status: true, message: '', isTouched: false },
    },

    displayName: {
      value: '',
      validator: {
        required: true,

        minLength: 4,
      },
      error: { status: true, message: '', isTouched: false },
    },

    password: {
      value: '',
      validator: { required: true, minLength: 8, confirmPassword: '' },
      error: { status: true, message: '', isTouched: false },
    },
  },
  errorMessage: '',
  isPassValidate: false,
};

function checkValue(fieldCheck, validator) {
  const error = { status: true, message: '', isTouched: true };
  if (!validator) {
    error.status = false;
    error.isTouched = true;
    return;
  }
  let value = fieldCheck.value;
  let errorMessage = '';
  let validatorRequiredCheck = true;
  let validatorMinLengthCheck = true;
  let validatorConfirmPasswordCheck = true;

  if (validator.required) {
    if (value !== '') {
      validatorRequiredCheck = true;
    } else {
      validatorRequiredCheck = false;
      if (validator.required) {
        if (errorMessage === '') {
          errorMessage = 'Required';
        } else {
          errorMessage += ' | Required';
        }
      }
    }
  }

  if (validator.minLength) {
    if (value.length >= validator.minLength) {
      validatorMinLengthCheck = true;
    } else {
      validatorMinLengthCheck = false;
      if (validator.minLength) {
        if (errorMessage === '') {
          errorMessage = `Need more than ${validator.minLength - 1}`;
        } else {
          errorMessage += ` | Need more than ${validator.minLength - 1}`;
        }
      }
    }
  }

  if (validator.confirmPassword) {
    if (value === validator.confirmPassword) {
      validatorConfirmPasswordCheck = true;
    } else {
      validatorConfirmPasswordCheck = false;
      if (validator.confirmPassword) {
        if (errorMessage === '') {
          errorMessage = `Passwords didn't matched`;
        } else {
          errorMessage += ` | Passwords didn't matched`;
        }
      }
    }
  }

  error.status = !(
    validatorRequiredCheck &&
    validatorMinLengthCheck &&
    validatorConfirmPasswordCheck
  );
  error.message = errorMessage;
  error.isTouched = true;

  return error;
}

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
          updatedState.registerInfo.password,
          updatedState.registerInfo.password.validator
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
          updatedState.registerInfo[field],
          updatedState.registerInfo[field].validator
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

const postRegisterUser = async (registerData) => {
  console.log('sending registerData to backend');
  try {
    const response = await axios.post('/api/user/register', registerData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

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
      console.log('failed to validated by frontend');
      return;
    } else {
      console.log('validate pass by frontend');
      let registData = {
        email: state.registerInfo.email.value,
        displayName: state.registerInfo.displayName.value,
        password: state.registerInfo.password.value,
      };
      const confirmed = window.confirm('Confirm your infomation?');
      if (confirmed) {
        const response = await postRegisterUser(registData);
        if (response.registerSuccess) {
          window.alert(
            `Register Success!! Welcome ${state.registerInfo.displayName.value}`
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
          if (response.registerError.displayNameDup) {
            dispatch({
              type: 'UPDATE_ERROR',
              field: 'displayName',
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
          console.log(state.errorMessage);
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
      state.registerInfo.displayName.error.status ||
      state.registerInfo.password.error.status;
    dispatch({
      type: 'UPDATE_IsPassValidate',
      payload: { field: 'isPassvalidate', value: !isAllError },
    });
  }, [
    state.registerInfo.email.error.status ||
      state.registerInfo.displayName.error.status ||
      state.registerInfo.password.error.status,
  ]);

  // let [showInfo, setShowInfo] = useState(false);

  // function handleShowInfo() {
  //   setShowInfo(!showInfo);
  // }
  return (
    <div className="registerPage">
      <Header />
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
                    state.registerInfo.displayName.error.status &&
                    state.registerInfo.displayName.error.isTouched
                      ? ' isError'
                      : ''
                  }`}
                  type="text"
                  name="displayName"
                  value={state.registerInfo.displayName.value}
                  onChange={handleValueChange}
                  placeholder="Your name ..."
                />
              </label>
              <div className="warningMessage-register">
                {state.registerInfo.displayName.error.message}
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
          {/* <div className="pmiLine">
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
            <label>  
            <input
                className="registerInput"
                type="date"
                placeholder="dd/mm/yyyy"
              />
              </label>
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div>Phone</div>
            </div>
            <div className="inputRegisterColumn">
            <label>  
            <input
                className="registerInput"
                type="tel"
                placeholder="your phone number..."
              />
             </label> 
            </div>
          </div>
          <div className="registerLine">
            <div className="headRegisterColumn">
              <div className="height2">Address</div>
            </div>
            <div className="inputRegisterColumn">
            <label>  
            <textarea
                className="registerInput address"
                type="text"
                placeholder="your address"
              />
              </label>
            </div>
          </div>
        </div> */}
          <div className="buttonLine">
            <button className="submitBotton reset" type="reset">
              Reset
            </button>
            <button
              className={`submitBotton register ${
                state.isPassValidate ? '' : 'disbled-register'
              }`}
              type="submit"
            >
              Register
            </button>
          </div>
          <div className="warningMessage-register lastline">
            {state.errorMessage}
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
