// Referenced book example from Professsor Harrison
const db = require('./db');

exports.getMail = async (req, res) => {
  // https://expressjs.com/en/api.html
  const queryMailbox = req.query.mailbox;
  const queryFrom = req.query.from;
  const querySearch = req.query.search;
  const searchEnabled = req.query.searchOn;

  let mailbox = [];
  if (querySearch != undefined) {
    mailbox = await db.selectSearch(querySearch, queryMailbox);
  } else if (queryFrom != undefined) {
    mailbox = await db.selectFrom(queryFrom, queryMailbox);
  } else {
    mailbox = await db.selectMail(queryMailbox);
  }

  if (mailbox.length == 0 && (searchEnabled == true ||
      queryMailbox == 'starred')) {
    res.status(200).json([]);
  } else if (mailbox.length == 0 && queryFrom == undefined) {
    res.status(404).send();
  } else if (mailbox.length == 0 && queryFrom != undefined) {
    if (searchEnabled) {
      res.status(200).json([]);
    } else {
      const check = await db.selectMail(queryMailbox);
      if (check.length == 0) {
        res.status(404).send();
      } else {
        res.status(200).json([]);
      }
    }
  } else {
    const mail = {'starred': []};
    mailbox.map((content) => {
      content['mail']['id'] = content['id'];
      content['mail']['unread'] = content['unread'];
      content['mail']['starred'] = content['starred'];
      content['mail']['avatar'] = content['avatar'];

      if (mail[content['mailbox']] == undefined) {
        mail[content['mailbox']] = [];
      }

      if (content['mailbox'] != 'trash' && content['mailbox'] != 'sent') {
        if (mail[content['mailbox'] + 'Unread'] == undefined) {
          mail[content['mailbox'] + 'Unread'] = [];
        }
        if (content['unread'] == true) {
          (mail[content['mailbox'] + 'Unread']).push(content['mail']);
        }
      }

      mail[content['mailbox']].push(content['mail']);
      if (content['starred'] == true) {
        mail['starred'].push(content['mail']);
      }
    });

    if (queryMailbox != undefined) {
      res.status(200).json([{name: queryMailbox, mail: mail[queryMailbox]}]);
    } else {
      const response = [];
      const keys = Object.keys(mail);

      for (let i = 0; i < keys.length; i++) {
        response.push({name: keys[i], mail: mail[keys[i]]});
      }
      res.status(200).json(response);
    }
  }
};

exports.getUnreadCount = async (req, res) => {
  const unread = await db.selectNumUnread();
  res.status(200).json(unread);
};

exports.getEmails = async (req, res) => {
  const emails = await db.selectAllEmails();
  res.status(200).json(emails);
};

exports.getMailboxes = async (req, res) => {
  const emails = await db.selectAllMailboxes();
  const formattedEmails = [];
  emails.map((mailbox) => {
    formattedEmails.push({'mailbox': mailbox});
  });
  res.status(200).json(formattedEmails);
};

exports.addMailbox = async (req, res) => {
  await db.insertMailbox(req.body['mailbox']);
  res.status(201).send();
};

exports.getUser= async (req, res) => {
  const user = await db.selectUser(req.query.userid);
  res.status(200).json(user);
};

exports.postUser= async (req, res) => {
  await db.updateUser(req.body);
  res.status(201).send();
};

exports.getById = async (req, res) => {
  const email = await db.selectMailById(req.params.id);
  if (email) {
    email['mail']['id'] = email['id'];
    res.status(200).json(email['mail']);
  } else {
    res.status(404).send();
  }
};

exports.post = async (req, res) => {
  // https://expressjs.com/en/api.html
  const body = req.body;
  const email = {};
  // https://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
  const date = new Date().toISOString();
  email['mailbox'] = 'sent';
  email['id'] = uuid();
  email['mail'] = {};
  email['mail']['to'] = body['to'];
  email['mail']['subject'] = body['subject'];
  email['mail']['received'] = body['received'];
  email['mail']['content'] = body['content'];
  email['mail']['from'] =
    {'name': 'CSE183 Student', 'email': 'cse183student@ucsc.edu'};
  email['mail']['sent'] = date;
  email['mail']['received'] = date;
  await db.insertMail(email);
  res.status(201).send(email);
};

exports.drafts = async (req, res) => {
  // https://expressjs.com/en/api.html
  const body = req.body;
  const email = {};
  // https://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
  const date = new Date().toISOString();
  email['mailbox'] = 'drafts';
  email['id'] = uuid();
  email['mail'] = {};
  email['mail']['to'] = body['to'];
  email['mail']['subject'] = body['subject'];
  email['mail']['received'] = body['received'];
  email['mail']['content'] = body['content'];
  email['mail']['from'] =
    {'name': 'CSE183 Student', 'email': 'cse183student@ucsc.edu'};
  email['mail']['sent'] = date;
  email['mail']['received'] = date;
  await db.insertMail(email);
  res.status(201).send(email);
};

exports.put = async (req, res) => {
  // https://expressjs.com/en/api.html
  const query = req.query.mailbox;
  const id = req.params.id;
  const starred = req.query.starred;
  const unread = req.query.unread;

  if (starred != undefined) {
    await db.updateStarred(id, !starred);
    res.status(204).send();
  } else if (unread != undefined) {
    await db.updateUnread(id, unread);
    res.status(204).send();
  } else {
    // Taken from Professor Harrison's book example
    const email = await db.selectMailById(id);

    if (email == undefined) {
      // Email doesn't exist
      res.status(404).send();
    } else {
      if (query == 'sent' && email['mailbox'] != 'sent') {
        res.status(409).send();
      } else if (query == email['mailbox']) {
        // Don't do anything
        res.status(204).send();
      } else {
        const emailInsert = {};
        emailInsert['id'] = email['id'];
        emailInsert['mailbox'] = query;
        emailInsert['mail'] = email['mail'];
        emailInsert['mail']['id'] = email['id'];
        await db.deleteMail(id);
        await db.insertMail(emailInsert);
        res.status(204).send();
      }
    }
  }
};

exports.delete = async (req, res) => {
  // https://expressjs.com/en/api.html
  const id = req.params.id;
  // Taken from Professor Harrison's book example
  const email = await db.selectMailById(id);

  if (email == undefined) {
    // Email doesn't exist
    res.status(404).send();
  } else {
    await db.deleteMail(id);
    res.status(204).send();
  }
};

// https://stackoverflow.com/a/2117523/109538
/**
 * @function uuid
 * @return {string} uuid
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0; const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
