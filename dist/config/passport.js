"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passportJwt = require("passport-jwt");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var User = _mongoose["default"].model('users');

var opts = {};
opts.jwtFromRequest = _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

var _default = function _default(passport) {
  passport.use(new _passportJwt.Strategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload.id).then(function (user) {
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    })["catch"](function (err) {
      return console.log(err);
    });
  }));
};

exports["default"] = _default;