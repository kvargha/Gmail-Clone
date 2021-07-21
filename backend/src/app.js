const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const mail = require('./mail');
const auth = require('./auth');
//auth.getPasswordHash();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

// Your routes go here
app.post('/auth', auth.authenticate);
app.get('/v0/mail', mail.getMail);
app.get('/v0/mail/:id', mail.getById);
app.get('/v0/emails', mail.getEmails);
app.get('/v0/mailboxes', mail.getMailboxes);
app.get('/v0/user', mail.getUser);
app.get('/v0/unread', mail.getUnreadCount);
app.post('/v0/mailboxes', mail.addMailbox);
app.post('/v0/user', mail.postUser);
app.post('/v0/mail', mail.post);
app.post('/v0/drafts', mail.drafts);
app.put('/v0/mail/:id', mail.put);
app.delete('/v0/mail/:id', mail.delete);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
