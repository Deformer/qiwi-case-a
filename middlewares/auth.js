const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');

module.exports = {
  checkAuth: (req,res,next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          User.findOne({where:{id: decoded.id}}).then(user => {
            if(user) {
              req.user = user.toJSON();
              next();
            }
            else
              res.status(404).send('User doesnt found');
          }).catch((err) => {
            res.sendStatus(500);
          })
        }
      });

    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }
};