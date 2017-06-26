const router = require('express').Router();
const dialogService = require('../../services/dialog')

router.get('/',(req,res) => {
  dialogService.getAllDialogsToUser(req.user.id).then(dialogs => {
    res.status(200).send(dialogs);
  })
});
router.post('/', (req,res) => {
  dialogService.createDialog([req.user.id]).then(() => {
    res.sendStatus(200);
  })
})

module.exports = router;