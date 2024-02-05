const express = require('express');

const router = express.Router();
const {
  createUser,
  userSignIn,
  signOut,
  setDeviceId,
  getData,
} = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');



router.post('/create-user', validateUserSignUp, userVlidation, createUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
router.post('/sign-out', isAuth, signOut);
router.post('/set-device', isAuth, setDeviceId);
router.post('/get-data', isAuth, getData);



module.exports = router;
