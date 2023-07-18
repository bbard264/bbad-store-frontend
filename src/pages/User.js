import React, { useReducer, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import checkValue from '../config/services/CheckValueValidated';
import Token from '../config/services/Token';
import '../styles/pages/User.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import kuri from '../assets/ex_products/kuri.jpg';

const userPageList = ['profile', 'account'];

function userNavi(handleMenuClick, contentNow, pagelist) {
  return (
    <div className="userNaviBox">
      {pagelist.map((page, index) => (
        <div
          key={index}
          className={`${contentNow === page ? 'userCurrent' : ''}`}
          onClick={() => handleMenuClick(page)}
        >
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </div>
      ))}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.payload };
    case 'UPDATE_USERPROFILE':
      const updatedState = {
        ...state,
        userProfileInfo: {
          ...state.userProfileInfo,
          [action.payload.field]: {
            ...state.userProfileInfo[action.payload.field],
            value: action.payload.value,
          },
        },
      };

      updatedState.userProfileInfo[action.payload.field].error = checkValue(
        updatedState.userProfileInfo[action.payload.field]
      );

      // check validate is PASS?
      let isPassValidateProfile = true;

      // Loop through each field and check its error status
      for (const fieldName of Object.keys(updatedState.userProfileInfo)) {
        if (fieldName === 'address') {
          for (const addressField of Object.keys(
            updatedState.userProfileInfo[fieldName]
          )) {
            const addfield = updatedState.userProfileInfo.address[addressField];
            if (addfield.error.status) {
              isPassValidateProfile = false;
              break; // Exit the loop if any error status is true
            }
          }
        } else {
          const field = updatedState.userProfileInfo[fieldName];

          if (field.error.status) {
            isPassValidateProfile = false;
            break; // Exit the loop if any error status is true
          }
        }
      }

      return { ...updatedState, isPassValidate: isPassValidateProfile };

      return updatedState;
    case 'UPDATE_ADDRESS':
      const updatedAddress = {
        ...state,
        userProfileInfo: {
          ...state.userProfileInfo,
          address: {
            ...state.userProfileInfo.address,
            [action.payload.field]: {
              ...state.userProfileInfo.address[action.payload.field],
              value: action.payload.value,
            },
          },
        },
      };

      updatedAddress.userProfileInfo.address[action.payload.field].error =
        checkValue(
          updatedAddress.userProfileInfo.address[action.payload.field]
        );

      // check validate is PASS?
      let isPassValidateAddress = true;

      // Loop through each field and check its error status
      for (const fieldName of Object.keys(updatedAddress.userProfileInfo)) {
        if (fieldName === 'address') {
          for (const addressField of Object.keys(
            updatedAddress.userProfileInfo[fieldName]
          )) {
            const addfield =
              updatedAddress.userProfileInfo.address[addressField];
            if (addfield.error.status) {
              isPassValidateAddress = false;
              break; // Exit the loop if any error status is true
            }
          }
        } else {
          const field = updatedAddress.userProfileInfo[fieldName];

          if (field.error.status) {
            isPassValidateAddress = false;
            break; // Exit the loop if any error status is true
          }
        }
      }

      return { ...updatedAddress, isPassValidate: isPassValidateAddress };
    case 'UPDATE_USERACC':
      const { field, value } = action.payload;
      let updatedUserAcc;
      if (field === 'confirmPassword') {
        updatedUserAcc = {
          ...state,
          userAccountInfo: {
            ...state.userAccountInfo,
            newPassword: {
              ...state.userAccountInfo.newPassword,
              validator: {
                ...state.userAccountInfo.newPassword.validator,
                confirmPassword: value,
              },
            },
          },
        };

        updatedUserAcc.userAccountInfo.newPassword.error = checkValue(
          updatedUserAcc.userAccountInfo.newPassword
        );
      } else {
        updatedUserAcc = {
          ...state,
          userAccountInfo: {
            ...state.userAccountInfo,
            [field]: {
              ...state.userAccountInfo[field],
              value: value,
            },
          },
        };

        updatedUserAcc.userAccountInfo[field].error = checkValue(
          updatedUserAcc.userAccountInfo[field]
        );
      }
      // check validate is PASS?
      let isPassValidateACC = true;

      // Loop through each field and check its error status
      for (const fieldName of Object.keys(updatedUserAcc.userAccountInfo)) {
        if (fieldName === 'address') {
          for (const addressField of Object.keys(
            updatedUserAcc.userAccountInfo[fieldName]
          )) {
            const addfield =
              updatedUserAcc.userAccountInfo.address[addressField];
            if (addfield.error.status) {
              isPassValidateACC = false;
              break; // Exit the loop if any error status is true
            }
          }
        } else {
          const field = updatedUserAcc.userAccountInfo[fieldName];

          if (field.error.status) {
            isPassValidateACC = false;
            break; // Exit the loop if any error status is true
          }
        }
      }

      return { ...updatedUserAcc, isPassValidate: isPassValidateACC };
    case 'RESET':
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function UserProfile({ userData }) {
  const originUserProfileInfo = {
    userProfileInfo: {
      displayname: {
        value: userData.displayname,
        validator: {
          required: true,
          maxLength: 50,
          minLength: 4,
        },
        error: { status: false, message: '', isTouched: false },
      },
      email: {
        value: userData.email,
        validator: { required: true, maxlength: 100 },
        error: { status: false, message: '', isTouched: false },
      },
      phone: {
        value: userData.phone,
        validator: {
          pattern: '^[0-9]{10}$',
        },
        error: { status: false, message: '', isTouched: false },
      },
      gender: {
        value: userData.gender,
        error: { status: false, message: '', isTouched: false },
      },
      birthdate: {
        value: userData.birthdate,
        error: { status: false, message: '', isTouched: false },
      },
      address: {
        address1: {
          value: userData.address.address1,
          validator: { maxlength: 100 },
          error: { status: false, message: '', isTouched: false },
        },
        address2: {
          value: userData.address.address2,
          validator: { maxlength: 100 },
          error: { status: false, message: '', isTouched: false },
        },
        district: {
          value: userData.address.district,
          validator: { maxlength: 50 },
          error: { status: false, message: '', isTouched: false },
        },
        province: {
          value: userData.address.province,
          validator: { maxlength: 50 },
          error: { status: false, message: '', isTouched: false },
        },
        postcode: {
          value: userData.address.postcode,
          validator: { pattern: '^[0-9]{5}$' },
          error: { status: false, message: '', isTouched: false },
        },
      },
    },
    errorMessage: '',
    isPassValidate: true,
  };
  const [userProInfo, dispatch] = useReducer(reducer, originUserProfileInfo);

  const handleValueChange = async (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    if (
      Object.keys(originUserProfileInfo.userProfileInfo.address).includes(name)
    ) {
      dispatch({
        type: 'UPDATE_ADDRESS',
        payload: { field: name, value },
      });
    } else {
      dispatch({
        type: 'UPDATE_USERPROFILE',
        payload: { field: name, value },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProInfo.isPassValidate) {
      console.log("..don't pass validate..");
      return;
    }
    if (JSON.stringify(userProInfo) === JSON.stringify(originUserProfileInfo)) {
      console.log("..don't pass validate..");
      return;
    }
    const confirmed = window.confirm('Confirm your infomation?');
    if (confirmed) {
      let newInfo = {
        displayname: userProInfo.userProfileInfo.displayname.value,
        email: userProInfo.userProfileInfo.email.value,
        phone: userProInfo.userProfileInfo.phone.value,
        gender: userProInfo.userProfileInfo.gender.value,
        birthdate: userProInfo.userProfileInfo.birthdate.value,
        address: {
          address1: userProInfo.userProfileInfo.address.address1.value,
          address2: userProInfo.userProfileInfo.address.address2.value,
          district: userProInfo.userProfileInfo.address.district.value,
          province: userProInfo.userProfileInfo.address.province.value,
          postcode: userProInfo.userProfileInfo.address.postcode.value,
        },
      };
      console.log(newInfo);
      console.log('sending new info to backend..');
      return;
    } else {
      return;
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET', payload: originUserProfileInfo });
  };

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
      <form
        className="uPPersonalLine"
        id="personalForm"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <div className="uPNameBox">
          <div className="uHeadLine">Name</div>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.displayname.error.message}
          </div>
          <input
            className="uinput"
            type="text"
            name="displayname"
            value={userProInfo.userProfileInfo.displayname.value || ''}
            onChange={handleValueChange}
          />
        </div>
        <div className="uPGenderBox">
          <div className="uHeadLine">Gender</div>
          <div className="radioChoiceBox">
            <label className="labelRadioChoiceBox">
              <input
                className="radioChoice"
                type="radio"
                value="Male"
                name="gender"
                checked={userProInfo.userProfileInfo.gender.value === 'Male'}
                onChange={handleValueChange}
              />
              Male
            </label>
            <label className="labelRadioChoiceBox">
              <input
                className="radioChoice"
                type="radio"
                value="Female"
                name="gender"
                checked={userProInfo.userProfileInfo.gender.value === 'Female'}
                onChange={handleValueChange}
              />
              Female
            </label>
            <label className="labelRadioChoiceBox">
              <input
                className="radioChoice"
                type="radio"
                value="Others"
                name="gender"
                checked={userProInfo.userProfileInfo.gender.value === 'Others'}
                onChange={handleValueChange}
              />
              Others
            </label>
          </div>
        </div>
        <div className="uPEmailBox">
          <div className="uHeadLine">Email</div>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.email.error.message}
          </div>
          <input
            className="uinput"
            type="email"
            name="email"
            value={userProInfo.userProfileInfo.email.value || ''}
            onChange={handleValueChange}
          />
        </div>
        <div className="uPDoBBox">
          <div className="uHeadLine">Date of Birth</div>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.birthdate.error.message}
          </div>
          <input
            className="uinput"
            type="date"
            name="date"
            value={userProInfo.userProfileInfo.birthdate.value || ''}
            onChange={handleValueChange}
          />
        </div>
        <div className="uPPhoneBox">
          <div className="uHeadLine">Phone</div>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.phone.error.message}
          </div>
          <input
            className="uinput"
            type="tel"
            name="phone"
            value={userProInfo.userProfileInfo.phone.value || ''}
            onChange={handleValueChange}
            placeholder="your phone...."
          />
        </div>
        <div className="uPAddressBox">
          <div className="uHeadLine">Address</div>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.address.postcode.error.message}
          </div>
          <div className="uPAddressContainer">
            <input
              className="uinput uaddress"
              type="text"
              name="address1"
              value={userProInfo.userProfileInfo.address.address1.value || ''}
              onChange={handleValueChange}
              placeholder="your address...."
            />
            <input
              className="uinput uaddress"
              type="text"
              name="address2"
              value={userProInfo.userProfileInfo.address.address2.value || ''}
              onChange={handleValueChange}
              placeholder="your address...."
            />
            <input
              className="uinput uaddress"
              type="text"
              name="district"
              value={userProInfo.userProfileInfo.address.district.value || ''}
              onChange={handleValueChange}
              placeholder="district...."
            />
            <input
              className="uinput uaddress"
              type="text"
              name="province"
              value={userProInfo.userProfileInfo.address.province.value || ''}
              onChange={handleValueChange}
              placeholder="province...."
            />
            <input
              className="uinput uaddress"
              type="num"
              name="postcode"
              value={userProInfo.userProfileInfo.address.postcode.value || ''}
              onChange={handleValueChange}
              placeholder="postcode...."
            />
          </div>
        </div>
      </form>
      <div className="uButtonLine">
        <button className="uButton reset" type="reset" form="personalForm">
          Reset
        </button>
        <button className="uButton submit" type="submit" form="personalForm">
          Submit
        </button>
      </div>
    </div>
  );
}

function UserAccount({ userData }) {
  const originalUserAccountInfo = {
    userAccountInfo: {
      oldPassword: {
        value: '',
        validator: {
          minLength: 8,
          maxLength: 50,
        },
        error: { status: true, message: '', isTouched: false },
      },
      newPassword: {
        value: '',
        validator: {
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
  const [userAccInfo, dispatch] = useReducer(reducer, originalUserAccountInfo);
  const [showChangingPassword, setShowChangingPassword] = useState(false);

  const handleValueChange = async (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_USERACC', payload: { field: name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userAccInfo.isPassValidate ||
      userAccInfo.userAccountInfo.oldPassword.value === '' ||
      userAccInfo.userAccountInfo.newPassword.value === ''
    ) {
      console.log("..don't pass validate..");
      return;
    }
    if (
      userAccInfo.userAccountInfo.oldPassword.value ===
      userAccInfo.userAccountInfo.newPassword.value
    ) {
      console.log("..don't pass validate..");
      return;
    }
    const confirmed = window.confirm('Confirm your infomation?');
    if (confirmed) {
      console.log('sending new info to backend..');
      let newInfo = {
        oldPassword: userAccInfo.userAccountInfo.oldPassword.value,
        newPassword: userAccInfo.userAccountInfo.newPassword.value,
      };
      console.log(newInfo);
      return;
    } else {
      return;
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET', payload: originalUserAccountInfo });
  };

  const handleLogOut = () => {
    const confirmed = window.confirm('Are you sure to logout?');
    if (confirmed) {
      Token.removeToken();
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure to Delete your account?');
    if (confirmed) {
      // console.log('Toggle password input');
      // console.log(
      //   'check password is correct? use same api as changing password to check'
      // );
      // console.log('if check pass, add that user {deactivated:true}');
      // console.log('for {deactivated:true}, user cannot login anymore');
    }
  };
  return (
    <div className="userAccountBox">
      <div className="cusIDLine">
        <div className="uAcusIDBox">
          <div className="uHeadLine">Customer ID</div>
          <input
            className="uinput account cusid"
            type="text"
            value={userData._id}
            disabled
          />
        </div>
      </div>
      <form
        className="passwordLine"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <div className="uAPasswordBox">
          <div className="uHeadLine">Password</div>
          {showChangingPassword ? (
            <input
              className="uinput account"
              type="password"
              name="oldPassword"
              value={userAccInfo.userAccountInfo.oldPassword.value}
              onChange={handleValueChange}
              placeholder="Enter your old password.."
              autoComplete="off"
            />
          ) : (
            <input
              className="uinput account  cusid"
              type="text"
              name="FakePassword"
              value="******************************"
              disabled
            />
          )}
          <button
            className="uButton"
            type="button"
            onClick={() => setShowChangingPassword(!showChangingPassword)}
          >
            Change
          </button>
        </div>
        <div
          className={`changingPasswordLine${
            showChangingPassword ? '' : ' hidding'
          }`}
        >
          {showChangingPassword && (
            <div className="uAChangingPasswordLine">
              <div className="uHeadLine">Changing Password</div>

              <div className="uAChangingPasswordBox">
                <input
                  className="uinput account"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password..."
                  value={userAccInfo.userAccountInfo.newPassword.value}
                  onChange={handleValueChange}
                  autoComplete="off"
                />
                <div className="uAWarningMessage">
                  {userAccInfo.userAccountInfo.oldPassword.error.message === ''
                    ? userAccInfo.userAccountInfo.newPassword.error.message
                    : `old password is not valid`}
                </div>
              </div>
              <div className="uAConfirmNewPasswordBox">
                <input
                  className="uinput account"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password..."
                  value={
                    userAccInfo.userAccountInfo.newPassword.validator
                      .confirmPassword
                  }
                  autoComplete="off"
                  onChange={handleValueChange}
                />
                <button className="uButton submit" type="submit">
                  Submit
                </button>
                <button
                  className="uButton reset"
                  type="reset"
                  onClick={() => setShowChangingPassword(!showChangingPassword)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
      <div className="LogoutLine">
        <div className="uPNameBox">
          <div className="uHeadLine onClick" onClick={handleLogOut}>
            Logout
          </div>
        </div>
      </div>
      <div className="DeleteAccountLine">
        <div className="uPNameBox">
          <div className="uHeadLine onClick" onClick={handleDeleteAccount}>
            Delete account
          </div>
        </div>
      </div>
    </div>
  );
}

// function UserSettings({ userData }) {
//   const [userSettingsInfo, dispatch] = useReducer(reducer, {
//     userSettingsInfo: {
//       language: {
//         value: 'English',
//         validator: {
//           LanguageBasket: ['Thai', 'English'],
//         },
//         error: { status: false, message: '', isTouched: false },
//       },
//     },
//   });

//   return (
//     <div className="userSettingsBox">
//       <div className="changeLanguageLine">
//         <div className="uHeadLine">Language</div>
//         <select>
//           <option value="">userData.language</option>
//           <option value="English">English</option>
//           <option value="ไทย">ไทย</option>
//         </select>
//         <button className="uButton">Submit</button>
//       </div>
//     </div>
//   );
// }

function showContent(contentNow, userPageList, userData) {
  if (contentNow === userPageList[0]) {
    return <UserProfile userData={userData} />;
  }
  if (contentNow === userPageList[1]) {
    return <UserAccount userData={userData} />;
  }
  // if (contentNow === userPageList[2]) {
  //   return <UserSettings userData={userData} />;
  // }
  else {
    return;
  }
}

const fetchUserInfo = async (dispatch, setIsLoaded) => {
  const apilink = '/api/user/getUserById';

  try {
    console.log('Request API:', apilink);
    const response = await axios.get(apilink);
    dispatch({
      type: 'SET_USER',
      payload: response.data.userInfo,
    });
    setIsLoaded(true);
  } catch (error) {
    console.error('Failed to fetch user information:', error);
  }
};

export default function User() {
  const emptyUser = {
    _id: '',
    email: '',
    displayname: '',
    password: '',
    photo: '',
    phone: '',
    gender: 'Others',
    birthdate: null,
    address: {
      address1: '',
      address2: '',
      district: '',
      province: '',
      postcode: '',
    },
    favorite: [],
    create_date: null,
  };
  const [userInfo, dispatch] = useReducer(reducer, emptyUser);
  const [isLoaded, setIsLoaded] = useState(false);
  let { page } = useParams();
  const navigate = useNavigate();
  if (!page) {
    page = userPageList[0];
  }

  useEffect(() => {
    fetchUserInfo(dispatch, setIsLoaded);
  }, []);

  function handleMenuClick(page) {
    if (page) navigate(`/user/${page}`);
  }

  return (
    <div className="userPage">
      <Header />
      <div className="userContainer">
        {isLoaded ? (
          <>
            <div className="userNaviContainer">
              {userNavi(handleMenuClick, page, userPageList)}
            </div>
            <div className="userContentContainer">
              {showContent(page, userPageList, userInfo)}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
