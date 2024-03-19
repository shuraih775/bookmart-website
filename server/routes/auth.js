const express = require('express');
const {auth} = require('../controllers/auth');
const {fetch} = require('../controllers/getusername');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/fetchusername', fetch.fetchUsername);

module.exports = router;
