const router = require('express').Router();
const dialogService = require('../../services/dialog');
const messageService = require('../../services/message');

router.get('/', (req, res) => {
  dialogService.getAllDialogsToUser(req.user.id).then((dialogs) => {
    res.status(200).send(dialogs);
  });
});
router.post('/', (req, res) => {
  const { members } = req.body;
  dialogService.createDialog(members).then((users) => {
    res.status(200).send();
  });
});

/* {
  "message":{
  "type": "online",
    "money": 100,
    "comment": "your mom",
    "to":2,
    "dialogId": 6
}
}*/
router.post('/postMessage', (req, res) => {
  const { user } = req;
  const { message } = req.body;
  message.from = user.id;
  messageService.saveMessage(message).then((response) => {
    res.sendStatus(200);
  });
});

module.exports = router;
