"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validateRegisterInput;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("is-empty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function validateRegisterInput(data) {
  var errors = {};
  data.name = (0, _isEmpty["default"])(data.name) ? '' : data.name;
  data.email = (0, _isEmpty["default"])(data.email) ? '' : data.email;
  data.password = (0, _isEmpty["default"])(data.password) ? '' : data.password;
  data.password2 = (0, _isEmpty["default"])(data.password2) ? '' : data.password2;

  if (_validator["default"].isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (_validator["default"].isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!_validator["default"].isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (_validator["default"].isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (_validator["default"].isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (!_validator["default"].isLength(data.password, {
    min: 6,
    max: 30
  })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!_validator["default"].equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors: errors,
    isValid: (0, _isEmpty["default"])(errors)
  };
}