const router = require('express').Router();
const userService = require('../../services/user');


router.post('/getByPhoneNumber', (req, res) => {
  const { phoneNumber } = req.body;
  userService.getUserWithPhoneNumber(phoneNumber).then((user) => {
    if (user) { return res.status(200).send({ isExist: true, userId: user.id }); }
    res.status(404).send({ isExist: false });
  });
});

module.exports = router;
