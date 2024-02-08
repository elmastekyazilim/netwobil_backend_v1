const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sharp = require('sharp');


exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: 'Bu E-Posta Kullanımda',
    });
  const mqttUrl=process.env.MQTT_URI;
  console.log(mqttUrl);
  const user = await User({
    fullname,
    email,
    password,
    mqttUrl,
  });
  await user.save();
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: 'user not found, with the given email!',
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: 'E-Posta ya da Şifre Hatalı',
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldTokens = oldTokens.filter(t => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return t;
      }
    });
  }

  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  const userInfo = {
    fullname: user.fullname,
    email: user.email,
    device: user.device ? user.device : '',
    mqttUrl: user.mqttUrl,
  };

  res.json({ success: true, user: userInfo, token });
};



exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter(t => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};

exports.createPost = async (req, res) => {

  const { deviceId } = req.body;
  console.log(deviceId);
  await User.findByIdAndUpdate(req.user._id, { device:deviceId });

  res.json({ success: true, message: 'create post' });
  
};

exports.getData = async (req, res) => {

  const userData=await User.findById(req.user._id);
  console.log(userData);
  res.json({ success: true, deviceId: userData.device ,fullname: userData.fullname, mqttUrl: userData.mqttUrl,email:userData.email});

};

exports.setDeviceId = async (req, res) => {

  const { deviceId } = req.body;
  console.log(deviceId);
  await User.findByIdAndUpdate(req.user._id, { device:deviceId });

  res.json({ success: true, message: 'Device Added' });

  console.log(deviceId);
  
};
