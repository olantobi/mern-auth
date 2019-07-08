"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _users = _interopRequireDefault(require("./routes/users"));

var _passport2 = _interopRequireDefault(require("./config/passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
var MONGODB_URI = process.env.MONGODB_URI;

_mongoose["default"].connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: true
}).then(function () {
  return console.log('Mongodb successfully connected');
})["catch"](function (err) {
  return console.log(err);
});

app.use(_passport["default"].initialize());
(0, _passport2["default"])(_passport["default"]);
app.use('/api/users', _users["default"]);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server up and running on port ".concat(PORT));
});