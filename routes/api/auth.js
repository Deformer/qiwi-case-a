const router = require('express').Router();
const generator = require('../../services/helpers/generator');
const userService = require('../../services/user');
const authService = require('../../services/auth');
const config = require('../../config');

router.post('/sendSms',(req,res) => {
  const phoneNumber = req.body.phoneNumber;
  const smsCode = generator.genSmsCode(6);
  userService.createNewUser(phoneNumber,smsCode).then((userId) => {
    res.status(200).send({userId});
  }).catch((err) => {
    res.sendStatus(500);
  })
});

router.post('/confirmUserAccount', (req,res) => {
  const userId = req.body.userId;
  const smsCode = req.body.smsCode;
  userService.confirmUserAccount(userId, smsCode).then((user) => {
    authService.createToken(user, config.secret).then((token) => {
      res.status(200).send({token});
    })
  }).catch(() => {
    res.sendStatus(500);
  });
});

module.exports = router;