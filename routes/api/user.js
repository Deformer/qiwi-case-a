const router = require('express').Router();
const userService = require('../../services/user');


router.post('/getByPhoneNumber', (req,res) => {
  const {phoneNumber} = req.body;
  userService.checkIfUserExist(phoneNumber).then(isExist => {
    res.status(200).send( {isExist} );
  })
});

module.exports = router;