import React, { useReducer, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMediaContext } from '../config/services/MediaContext';
import axios from '../config/axios';
import checkValue from '../config/services/CheckValueValidated';
import Token from '../config/services/Token';
import '../styles/pages/User.css';
import Button from '../components/subcomponents/Button';
import Backdrop from '../components/subcomponents/Backdrop';
import ReviewingBox from '../components/ReviewingBox';
import ProductImage from '../components/subcomponents/ProductImage';

import Cropping from '../components/Cropping';
import UserDataStorage from '../config/services/UserDataStorage';
import RESTapi from '../config/services/RESTapi';

import fullStar from '../assets/icon/star2.png';

import profileSettingIcon from '../assets/icon/user.png';
import accountSettingIcon from '../assets/icon/settings.png';
import reviewSettingIcon from '../assets/icon/satisfaction.png';
import IconContainer from '../components/subcomponents/IconContainer';

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
    case 'UPDATE_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload.value,
      };
    case 'RESET':
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function UserNavi({ pageNow, pageList }) {
  const navigate = useNavigate();
  return (
    <div className="userNaviBox">
      {pageList.map((page, index) => (
        <div
          key={index}
          className={`${pageNow === page ? 'userCurrent' : ''}`}
          onClick={() => navigate(`/user/${page}`)}
        >
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </div>
      ))}
    </div>
  );
}

function UserNaviMobile({ pageList }) {
  const navigate = useNavigate();
  const listOfIcon = [
    profileSettingIcon,
    accountSettingIcon,
    reviewSettingIcon,
  ];
  return (
    <div className="userNaviBoxMobile">
      {pageList.map((page, index) => (
        <div
          className="userNaviMobile"
          key={index}
          onClick={() => navigate(`/user/${page}`)}
        >
          <IconContainer
            className={'userMobileIcon'}
            src={listOfIcon[index]}
            alt={`icon_${page}`}
          />
          {page.charAt(0).toUpperCase() + page.slice(1) + ' Settings'}
        </div>
      ))}
    </div>
  );
}

const fetchUpdateUser = async (props) => {
  const { userId, newImg, newInfo } = props;
  const apilink = '/api/user/updateUser';

  try {
    if (newImg && !newInfo) {
      // If newImg exists but newInfo is null, send only the image data
      const imageResponse = await axios.get(newImg, { responseType: 'blob' });
      const imageBlob = imageResponse.data;

      // Create a new FormData object and append the image blob as a file
      const formData = new FormData();
      formData.append('img', imageBlob, `${userId}-profile100x100.jpg`);
      formData.append('photo', `${userId}-profile100x100.jpg`);

      await axios.put(apilink, formData);
      UserDataStorage.setUserImage(newImg);
    } else if (newImg && newInfo) {
      // If both newImg and newInfo exist, send both image and other data

      // Fetch the image using Axios to get the image blob data
      const imageResponse = await axios.get(newImg, { responseType: 'blob' });
      const imageBlob = imageResponse.data;

      // Create a new FormData object and append the image blob as a file
      const formData = new FormData();
      formData.append('img', imageBlob, `${userId}-profile100x100.jpg`); // Set the image name to the value of newInfo.photo

      // Append other data from newInfo as fields
      formData.append('photo', `${userId}-profile100x100.jpg`);
      formData.append('displayname', newInfo.displayname);
      formData.append('email', newInfo.email);
      formData.append('phone', newInfo.phone);
      formData.append('gender', newInfo.gender);
      formData.append('birthdate', newInfo.birthdate);
      formData.append('address[address1]', newInfo.address.address1);
      formData.append('address[address2]', newInfo.address.address2);
      formData.append('address[district]', newInfo.address.district);
      formData.append('address[province]', newInfo.address.province);
      formData.append('address[postcode]', newInfo.address.postcode);

      const response = await axios.put(apilink, formData);
      UserDataStorage.setUserImage(newImg);
      if (response.data.updateResult) {
        RESTapi.fetchUserInfo();
      }
    } else if (!newImg && newInfo) {
      // If newImg is null, send only newInfo
      const response = await axios.put(apilink, newInfo);
      if (response.data.updateResult) {
        RESTapi.fetchUserInfo();
      }
    }
    window.location.reload();
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

function UserProfile({ userData, media = 'desktop' }) {
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
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [croppedImg, setCroppedImgage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const file = document.querySelector('.inputUploadPhoto');

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setUploadedPhoto(objectURL);
      setShowCrop(true);
    } else {
      setUploadedPhoto();
      setCroppedImgage();
    }
  };

  const onCanclePhotoCrop = () => {
    setUploadedPhoto();
    setShowCrop(false);

    file.value = '';
  };

  const handleValueChange = async (e) => {
    const { name, value } = e.target;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userProInfo.isPassValidate) {
      window.alert("..don't pass validate..");
      return;
    }

    const isInfoChanged =
      JSON.stringify(userProInfo) !== JSON.stringify(originUserProfileInfo);

    if (!isInfoChanged && !croppedImg) {
      window.alert("..don't pass validate..");
      return;
    }

    if (!window.confirm('Confirm your information?')) {
      return;
    }

    const newInfo = isInfoChanged
      ? {
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
        }
      : undefined;

    fetchUpdateUser({
      userId: userData._id,
      newImg: croppedImg,
      newInfo: newInfo,
    });
  };

  const handleReset = () => {
    setCroppedImgage();
    setUploadedPhoto();
    dispatch({ type: 'RESET', payload: originUserProfileInfo });
  };

  return (
    <div className="userProfileBox">
      <div className="uPPhotoLine">
        <div className="uHeadLine">User Profile</div>
        <div className="uPphotoContainer">
          {showCrop ? (
            <Cropping
              uploadedPhoto={uploadedPhoto}
              setCroppedImage={setCroppedImgage}
              onCanclePhotoCrop={onCanclePhotoCrop}
              setShowCrop={setShowCrop}
            />
          ) : (
            <></>
          )}
          <div className="uPphotoBox">
            <img
              className="userPhoto"
              src={croppedImg ? croppedImg : UserDataStorage.getUserImage()}
              alt="user"
            />
          </div>

          <label htmlFor="uploadPhoto" className="uploadButton">
            <div>+</div>
          </label>
          <input
            className="inputUploadPhoto"
            type="file"
            name="uploadPhoto"
            id="uploadPhoto"
            onChange={(event) => {
              const selectedFile = event.target.files[0];
              if (selectedFile && selectedFile.type.startsWith('image/')) {
                handlePhotoChange(event);
              } else {
                window.alert('Please select an image file');
              }
            }}
            title="Upload a photo"
            accept="image/*"
            placeholder="Choose a photo to upload"
            onClick={(event) => {
              event.currentTarget.value = null;
            }}
          />
          <div id="fileName" className="file-name">
            {croppedImg ? file.value.slice(12) : 'upload new photo'}
          </div>
        </div>
      </div>
      <form
        className="uPPersonalLine"
        id="personalForm"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <div className="uPNameBox">
          <label htmlFor="displayname" className="uHeadLine">
            Name
          </label>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.displayname.error.message}
          </div>
          <input
            className="uinput"
            type="text"
            name="displayname"
            id="displayname"
            value={userProInfo.userProfileInfo.displayname.value || ''}
            onChange={handleValueChange}
            placeholder="your name...."
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
              <div className="customRadio"></div>
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
              <div className="customRadio"></div>
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
              <div className="customRadio"></div>
              Others
            </label>
          </div>
        </div>
        <div className="uPEmailBox">
          <label htmlFor="email" className="uHeadLine">
            Email
          </label>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.email.error.message}
          </div>
          <input
            className="uinput"
            type="email"
            name="email"
            id="email"
            value={userProInfo.userProfileInfo.email.value || ''}
            onChange={handleValueChange}
            placeholder="your email...."
          />
        </div>
        <div className="uPDoBBox">
          <label htmlFor="birthdate" className="uHeadLine">
            Date of Birth
          </label>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.birthdate.error.message}
          </div>
          <input
            className="uinput"
            type="date"
            id="birthdate"
            name="birthdate"
            value={
              new Date(userProInfo.userProfileInfo.birthdate.value)
                .toISOString()
                .split('T')[0] || ''
            }
            onChange={handleValueChange}
            placeholder="MM-DD-YYYY"
          />
        </div>
        <div className="uPPhoneBox">
          <label htmlFor="phone" className="uHeadLine">
            Phone
          </label>
          <div className="uWarningMessage">
            {userProInfo.userProfileInfo.phone.error.message}
          </div>
          <input
            className="uinput"
            type="tel"
            name="phone"
            id="phone"
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
            <label htmlFor="address1" />
            <input
              className="uinput uaddress"
              type="text"
              name="address1"
              id="address1"
              value={userProInfo.userProfileInfo.address.address1.value || ''}
              onChange={handleValueChange}
              placeholder="your address...."
            />
            <label htmlFor="address2" />
            <input
              className="uinput uaddress"
              type="text"
              name="address2"
              id="address2"
              value={userProInfo.userProfileInfo.address.address2.value || ''}
              onChange={handleValueChange}
              placeholder="your address...."
            />
            <label htmlFor="district" />
            <input
              className="uinput uaddress"
              type="text"
              name="district"
              id="district"
              value={userProInfo.userProfileInfo.address.district.value || ''}
              onChange={handleValueChange}
              placeholder="district...."
            />
            <label htmlFor="province" />
            <input
              className="uinput uaddress"
              type="text"
              name="province"
              id="provinc"
              value={userProInfo.userProfileInfo.address.province.value || ''}
              onChange={handleValueChange}
              placeholder="province...."
            />
            <label htmlFor="postcode" />
            <input
              className="uinput uaddress"
              type="num"
              name="postcode"
              id="postcode"
              value={userProInfo.userProfileInfo.address.postcode.value || ''}
              onChange={handleValueChange}
              placeholder="postcode...."
            />
          </div>
        </div>
      </form>
      <div className="uButtonLine">
        <Button type="reset" form="personalForm">
          Reset
        </Button>
        <Button type="submit" form="personalForm">
          Submit
        </Button>
      </div>
    </div>
  );
}

const fetchChangeUserPassword = async (props) => {
  const apilink = '/api/user/changePassword';
  try {
    const response = await axios.put(apilink, props);
    return response.data;
  } catch (error) {
    window.alert(`Can't change password, Please try again later`);
    window.location.reload();
    console.error('Failed to fetch user information:', error);
  }
};

function UserAccount({ userData, media = 'desktop' }) {
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
    if (userAccInfo.errorMessage !== '') {
      userAccInfo.errorMessage = '';
    }
    dispatch({ type: 'UPDATE_USERACC', payload: { field: name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !userAccInfo.isPassValidate ||
      userAccInfo.userAccountInfo.oldPassword.value === '' ||
      userAccInfo.userAccountInfo.newPassword.value === ''
    ) {
      dispatch({
        type: 'UPDATE_ERROR_MESSAGE',
        payload: { value: 'Password have no change' },
      });
      return;
    }
    if (
      userAccInfo.userAccountInfo.oldPassword.value ===
      userAccInfo.userAccountInfo.newPassword.value
    ) {
      dispatch({
        type: 'UPDATE_ERROR_MESSAGE',
        payload: {
          value: `Old password can't be New password`,
        },
      });
      return;
    }

    if (window.confirm('Confirm your infomation?')) {
      let newInfo = {
        oldPassword: userAccInfo.userAccountInfo.oldPassword.value,
        newPassword: userAccInfo.userAccountInfo.newPassword.value,
      };
      const isChangePassword = await fetchChangeUserPassword(newInfo);
      if (isChangePassword.changePassword) {
        window.alert(isChangePassword.message);
        window.location.reload();
      } else {
        window.alert(isChangePassword.message);
        dispatch({
          type: 'UPDATE_ERROR_MESSAGE',
          payload: {
            value: isChangePassword.message,
          },
        });
      }

      return;
    } else {
      setShowChangingPassword(false);
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
      <form className="passwordLine" onSubmit={handleSubmit}>
        <div className="uAPasswordBox">
          <div className="uHeadLine">Password</div>
          <div className="passLineBox">
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
                type="password"
                name="FakePassword"
                value="******************************"
                disabled
              />
            )}
            <Button
              className={showChangingPassword ? 'showPassChange' : ''}
              onClick={() => {
                setShowChangingPassword((e) => !e);
                handleReset();
              }}
            >
              Change
            </Button>
          </div>
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
                    ? userAccInfo.userAccountInfo.newPassword.error.message ===
                      ''
                      ? userAccInfo.errorMessage
                      : userAccInfo.userAccountInfo.newPassword.error.message
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
                <Button type="submit">Submit</Button>
                <Button
                  type="reset"
                  onClick={() => {
                    setShowChangingPassword((e) => !e);
                    handleReset();
                  }}
                >
                  Cancel
                </Button>
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

function ReviewCard({
  item,
  itemFocus,
  setItemFocus,
  media = 'desktop',
  setshowBackDropReview,
}) {
  return (
    <div
      className={`reviewCardBox${
        itemFocus === item && media !== 'mobile' ? ' isFocus' : ''
      }`}
      onClick={() => {
        setItemFocus(item);
        if (media === 'mobile') {
          setshowBackDropReview(true);
        }
      }}
    >
      <div className="productPhotoCol">
        <ProductImage
          src={item.thumb_photo}
          alt={item.product_name}
          type={'thumb_photo'}
        />
      </div>
      <div className="nameRatingCol">
        <div className="productNameLine">{item.product_name}</div>
        <div className="ratingLine">
          {Object.keys(item.review).length > 0 ? (
            <>
              {Array.from(
                { length: Math.floor(item.review.rating) },
                (_, index) => (
                  <img key={'star' + index} src={fullStar} alt="Full Star" />
                )
              )}
            </>
          ) : (
            <div className="reviewProductButton">
              {media === 'mobile'
                ? 'TOUCH TO REVIEW'
                : itemFocus === item
                ? ''
                : 'CLICK TO REVIEW!'}
              <div className="backDropClickReview"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserReviews({ media = 'desktop' }) {
  const [userReviewsList, setUserReviewsList] = useState({});
  const [showReviewCard, setShowReviewCard] = useState({
    name: '',
  });
  const [isLoadReviewCard, setIsLoadReviewCard] = useState(false);
  const [itemFocus, setItemFocus] = useState({});
  const [showBackDropReview, setshowBackDropReview] = useState(false);

  useEffect(() => {
    let prepareObj = {};
    let newObj = {};

    let storedData = UserDataStorage.getUserReviews();

    if (!storedData) {
      UserDataStorage.setUserReviews()
        .then((result) => {
          if (result.isSuccess) {
            storedData = UserDataStorage.getUserReviews();
          }
        })
        .catch((error) => {
          return;
        });
      window.location.reload();
    } else {
      prepareObj.showAll = storedData;
      const filterReviewList = prepareObj.showAll.reduce(
        (acc, review) => {
          const reviewsList =
            Object.keys(review.review).length === 0
              ? 'showNoReview'
              : 'showOnlyReview';
          acc[reviewsList].push(review);
          return acc;
        },
        { showNoReview: [], showOnlyReview: [] }
      );

      newObj.showNoReview = filterReviewList.showNoReview;
      newObj.showOnlyReview = filterReviewList.showOnlyReview;
      setUserReviewsList(newObj);
      setShowReviewCard({
        name: 'showNoReview',
      });
    }
  }, []);

  if (Object.keys(userReviewsList).length === 0) {
    return <></>; //Loading;
  }

  async function onClickChangeShowReviewList(e) {
    setIsLoadReviewCard(true);
    setShowReviewCard({
      name: e.target.id,
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoadReviewCard(false);
  }

  const filteredItems =
    showReviewCard.name === 'showNoReview'
      ? userReviewsList.showNoReview
      : userReviewsList.showOnlyReview;

  return (
    <div className="userReviewBox">
      {media === 'mobile' ? (
        showBackDropReview ? (
          <Backdrop onCancel={() => setshowBackDropReview(false)}>
            <div className="ReviewingContainerUser">
              <ReviewingBox
                item={itemFocus}
                onCancel={() => {
                  setshowBackDropReview(false);
                  setItemFocus({});
                }}
              />
            </div>
          </Backdrop>
        ) : (
          <></>
        )
      ) : (
        <div className="currentUserReviewContainer">
          <div className="ReviewingContainer">
            <ReviewingBox item={itemFocus} onCancel={() => setItemFocus({})} />
          </div>
        </div>
      )}

      <div className="filterUserReview">
        <div
          className={`filterNavi${
            showReviewCard.name === 'showNoReview' ? ' isActive' : ''
          }`}
          onClick={onClickChangeShowReviewList}
          id="showNoReview"
        >
          Need Review
        </div>
        <div
          className={`filterNavi${
            showReviewCard.name === 'showOnlyReview' ? ' isActive' : ''
          }`}
          onClick={onClickChangeShowReviewList}
          id="showOnlyReview"
        >
          Already Review
        </div>
        <div className={`circleSelect ${showReviewCard.name ?? ''}`}></div>
      </div>
      <div className="listUserReviewContainer">
        {isLoadReviewCard ? (
          <></> //Loading
        ) : (
          <div className="listUserReviewBox">
            {filteredItems.map((item) => (
              <ReviewCard
                item={item}
                key={item._id}
                itemFocus={itemFocus}
                setItemFocus={setItemFocus}
                media={media}
                setshowBackDropReview={setshowBackDropReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShowUserContent({
  contentNow,
  userPageList,
  userData,
  media = 'desktop',
}) {
  if (contentNow === userPageList[0]) {
    return <UserProfile userData={userData} media={media} />;
  }
  if (contentNow === userPageList[1]) {
    return <UserAccount userData={userData} media={media} />;
  }
  if (contentNow === userPageList[2]) {
    return <UserReviews media={media} />;
  } else {
    return;
  }
}

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
  const navigate = useNavigate();
  const [userInfo, dispatch] = useReducer(reducer, emptyUser);
  const [isLoaded, setIsLoaded] = useState(false);

  const { page } = useParams();
  const mobilePage = page;
  let desktopPage = page;
  const userPageList = ['profile', 'account', 'review'];
  if (!page) {
    desktopPage = userPageList[0];
  }
  const { isDesktop, isTablet, isMobile } = useMediaContext();

  useEffect(() => {
    if (!Token.getToken()) {
      UserDataStorage.removeUserData();
      window.location.reload();
    } else {
      if (UserDataStorage.getUserData()) {
        dispatch({
          type: 'SET_USER',
          payload: UserDataStorage.getUserData(),
        });
        setIsLoaded(true);
      } else {
        RESTapi.fetchUserInfo();
        dispatch({
          type: 'SET_USER',
          payload: UserDataStorage.getUserData(),
        });
      }
    }
  }, []);
  if (!isLoaded) {
    return <></>; //Loading;
  } else if (isDesktop || isTablet) {
    return (
      <div className="userPage">
        <div className="userContainer">
          {isLoaded ? (
            <>
              <div className="userNaviContainer">
                <UserNavi pageNow={desktopPage} pageList={userPageList} />
              </div>
              <div className="userContentContainer">
                <ShowUserContent
                  contentNow={desktopPage}
                  userPageList={userPageList}
                  userData={userInfo}
                />
              </div>
            </>
          ) : (
            <></> //Loading
          )}
        </div>
      </div>
    );
  } else if (isMobile) {
    return (
      <div className="userPageMobile">
        <div className="userContainerMobile">
          {mobilePage ? (
            <>
              <Button
                className="backUserButton"
                onClick={() => navigate('/user')}
              >
                Back
              </Button>
              <div className="userHeadMobile">{`USER ${mobilePage.toUpperCase()} SETTINGS`}</div>
              <div className="line"></div>
              <ShowUserContent
                contentNow={mobilePage}
                userPageList={userPageList}
                userData={userInfo}
                media={'mobile'}
              />
            </>
          ) : (
            <UserNaviMobile pageList={userPageList} />
          )}
        </div>
      </div>
    );
  } else {
    return;
  }
}
