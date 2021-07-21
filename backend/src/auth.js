const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const secrets = require('../sql/secrets');

/*
exports.getPasswordHash = async () => {
  console.log(bcrypt.hashSync('Tehran', 1));
  console.log(await db.selectUserByEmail('kvargha@ucsc.edu'));
},
*/

exports.authenticate = async (req, res) => {
  console.log('inside authenticate');
  const {email, password} = req.body;
  const existingUser = await db.selectUserByEmail(email);
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
    user['accessToken'] = accessToken;
    delete user.password;
    
    res.json(user);
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

// Check if JWT is valid
exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secrets.accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
