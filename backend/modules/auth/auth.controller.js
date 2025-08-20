const {
  loginService,
  signupService,
  logoutService,
  verifyUserService,
} = require("./auth.service");

exports.login = async (req, res) => {
  return loginService(req, res);
};

exports.signup = async (req, res) => {
  return signupService(req, res);
};

exports.logout = async (req, res) => {
  return logoutService(req, res);
};

exports.verify = async (req, res) => {
  // The token is expected as a query parameter
  const token = req.query.token;
  return verifyUserService(token, req, res);
};
