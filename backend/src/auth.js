const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const secrets = require('../sql/secrets');
// var users = require('../data/users.json');

exports.getPasswordHash = async () => {
  console.log(bcrypt.hashSync('Tehran', 1));
  console.log(await db.selectUserByEmail('t.y@gmail.com'));
},

exports.authenticate = async (req, res) => {
  console.log('inside authenticate');
  const {email, password} = req.body;
  console.log(req.body);
  const existingUser = await db.selectUserByEmail(email);
  console.log(existingUser);
  const user = existingUser &&
  bcrypt.compareSync(password,
      existingUser.password) ? existingUser : null;
  if (user) {
    const accessToken = jwt.sign(
        {email: user.email, id: user.id, name: user.name},
        secrets.accessToken, {
          expiresIn: '60m',
          algorithm: 'HS256',
        });
    res.json({name: user.name, accessToken: accessToken, url: user.url, email: user.email});
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

// Next will go to the next layer(Book.js)
exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secrets.accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log('userInfo');
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
