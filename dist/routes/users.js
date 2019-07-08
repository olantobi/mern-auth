"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _register = _interopRequireDefault(require("../validation/register"));

var _login = _interopRequireDefault(require("../validation/login"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var router = _express["default"].Router();

var secretKey = process.env.SECRET_KEY;
router.post('/register', function (req, res) {
  var _validateRegisterInpu = (0, _register["default"])(req.body),
      errors = _validateRegisterInpu.errors,
      isValid = _validateRegisterInpu.isValid;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  _User["default"].findOne({
    email: req.body.email
  }).then(function (user) {
    if (user) {
      return res.status(409).json('Email already exists');
    }

    var newUser = new _User["default"]({
      name: req.body.name,
      email: req.body.email
    });

    _bcryptjs["default"].genSalt(10, function (err, salt) {
      _bcryptjs["default"].hash(req.body.password, salt, function (error, hash) {
        if (error) throw error;
        newUser.password = hash;
        newUser.save().then(function (savedUser) {
          return res.json(savedUser);
        })["catch"](function (saveError) {
          return console.log(saveError);
        });
      });
    });
  });
});
router.post('/login', function (req, res) {
  var _validateLoginInput = (0, _login["default"])(req.body),
      errors = _validateLoginInput.errors,
      isValid = _validateLoginInput.isValid;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  _User["default"].findOne({
    email: email
  }).then(function (user) {
    if (!user) {
      return res.status(400).json('Invalid email/password');
    }

    _bcryptjs["default"].compare(password, user.password).then(function (isMatch) {
      if (!isMatch) {
        return res.status(400).json('Invalid email/password');
      }

      console.log('Secret', secretKey);
      var payload = {
        id: user.id,
        name: user.name
      };

      _jsonwebtoken["default"].sign(payload, secretKey, {
        expiresIn: 86400
      }, function (err, token) {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        console.log('Token', token);
        res.json({
          success: true,
          token: 'Bearer ' + token
        });
      });
    });
  });
});
router.get('/:email', function (req, res) {
  var email = req.params.email;

  _User["default"].findOne({
    email: email
  }).then(function (user) {
    if (!user) {
      return res.status(404).json('Email address doesn\'t exist');
    }

    return res.json({
      sucess: true,
      user: user
    });
  });
});
var _default = router;
exports["default"] = _default;