const router = require('express').Router();
const authRouter = require('./auth');
const dialogRouter = require('./dialog');
const {checkAuth} = require('../../middlewares/auth');

router.use('/auth',authRouter);
router.use('/dialog',checkAuth, dialogRouter);

module.exports = router;