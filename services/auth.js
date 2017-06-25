const jwt = require('jsonwebtoken');

const AuthService = {
  createToken: (user, secretKey) => Promise.resolve(jwt.sign(user, secretKey, {
      expiresIn: "365d"
    }))
};

module.exports = AuthService;