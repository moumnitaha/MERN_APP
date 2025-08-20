const { refreshTokenService } = require("./auth.service");

exports.refresh = async (req, res) => {
  return refreshTokenService(req, res);
};
