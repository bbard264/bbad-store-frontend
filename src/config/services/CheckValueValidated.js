export default function checkValue(fieldCheck) {
  // const error = { status: true, message: '', isTouched: true };
  if (!fieldCheck.validator) {
    return { status: false, message: '', isTouched: true };
  }
  const validator = fieldCheck.validator;
  const value = fieldCheck.value;
  const errorMessage = [];

  if (value === '' && !validator.required) {
    return { status: false, message: '', isTouched: true };
  }

  if (validator.required && value === '') {
    errorMessage.push('Required');
  }

  if (validator.minLength && value.length < validator.minLength) {
    errorMessage.push(`Need more than ${validator.minLength - 1}`);
  }

  if (validator.maxLength && value.length > validator.maxLength) {
    errorMessage.push(`Not more than ${validator.maxLength}`);
  }

  if (validator.confirmPassword && value !== validator.confirmPassword) {
    errorMessage.push("Passwords didn't match");
  }

  if (validator.pattern) {
    const regex = new RegExp(validator.pattern);
    if (!regex.test(value)) {
      errorMessage.push('Invalid pattern');
    }
  }

  return {
    status: errorMessage.length > 0,
    message: errorMessage.join(' | '),
    isTouched: true,
  };
}
