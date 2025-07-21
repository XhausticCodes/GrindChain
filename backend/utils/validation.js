const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

const validateSignupData = (data) => {
  const errors = [];
  
  if (!data.username) {
    errors.push('Username is required');
  } else if (!validateUsername(data.username)) {
    errors.push('Username must be between 3 and 30 characters');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  } else if (!validatePassword(data.password)) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginData = (data) => {
  const errors = [];
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateSignupData,
  validateLoginData
};