const jwt = require('jsonwebtoken');

const AuthService = {
  createToken: (userId, secretKey) => Promise.resolve(jwt.sign(userId, secretKey))
};

module.exports = AuthService;