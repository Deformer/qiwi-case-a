const router = require('express').Router();
const dialogService = require('../../services/dialog');
const messageService = require('../../services/message');

router.get('/',(req,res) => {
  dialogService.getAllDialogsToUser(req.user.id).then(dialogs => {
    res.status(200).send(dialogs);
  })
});
router.post('/', (req,res) => {
  const {members} = req.body;
  dialogService.createDialog(members).then((users) => {
    res.status(200).send();
  })
});

router.post('/postMessage',(req,res) => {
  const {user} = req;
  const {message} = req.body;

});

module.exports = router;