const router = require('express').Router();
const userService = require('../../services/user');


router.post('/getByPhoneNumber', (req,res) => {
  const {phoneNumber} = req.body;
  userService.checkIfUserExist(phoneNumber).then(isExist => {
    res.sendStatus( isExist ? 200 : 404 );
  })
});

module.exports = router;