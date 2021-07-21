const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectMail = async (mailbox) => {
  let select = 'SELECT * FROM mail';
  if (mailbox) {
    select += ` WHERE mailbox = $1`;
  }
  const query = {
    text: select,
    values: mailbox ? [mailbox] : [],
  };
  const {rows} = await pool.query(query);
  const mail = [];
  for (const row of rows) {
    mail.push(row);
  }
  return mail;
};

exports.selectFrom = async (from, mailbox) => {
  from = from.toLowerCase();
  let select = 'SELECT * FROM mail ';
  select += `WHERE (mail->'from'->>'name'
    ~* $1 OR LOWER(mail->'from'->>'email') = $1)`;
  // PSQL LOWER https://w3resource.com/PostgreSQL/lower-function.php
  if (mailbox) {
    select += ` AND mailbox = $2`;
  }
  const query = {
    text: select,
    values: mailbox ? [from, mailbox] : [from],
  };
  const {rows} = await pool.query(query);
  const mail = [];
  for (const row of rows) {
    mail.push(row);
  }
  return mail;
};

exports.selectSearch = async (search, mailbox) => {
  search = search.toLowerCase();
  let select = 'SELECT * FROM mail ';
  select += `WHERE (mail->'from'->>'name'
    ~* $1 OR mail->>'content' ~* $1
    OR mail->>'subject' ~* $1)`;

  if (mailbox) {
    select += ` AND mailbox = $2`;
  }
  const query = {
    text: select,
    values: [search, mailbox],
  };
  const {rows} = await pool.query(query);
  const mail = [];
  for (const row of rows) {
    mail.push(row);
  }
  return mail;
};

exports.selectAllEmails = async () => {
  let select = 'SELECT *';
  select += ` FROM mail WHERE
    mailbox != 'sent'`;

  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);

  // https://alligator.io/js/sets-introduction/
  const emails = new Set();

  for (const row of rows) {
    emails.add(row['mail']['from']['email']);
  }
  // https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
  return [...emails];
};

exports.selectAllMailboxes = async () => {
  const select = 'SELECT * FROM mailboxes';

  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);

  // https://alligator.io/js/sets-introduction/
  const emails = new Set();

  for (const row of rows) {
    emails.add(row['mailbox']);
  }
  // https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
  return [...emails];
};

exports.selectUser = async (userid) => {
  const select = 'SELECT * FROM userInfo WHERE userid = $1';

  const query = {
    text: select,
    values: [userid],
  };
  const {rows} = await pool.query(query);
  const user = [];
  for (const row of rows) {
    user.push(row);
  }
  
  return user;
};

exports.selectUserByEmail = async (email) => {
  const select =
    `SELECT * FROM userInfo WHERE email ~* $1`;
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);

  return rows.length>0? {userid: rows[0].userid, username: rows[0].username, email: rows[0].email, password: rows[0].password}: null;
};

exports.updateUser = async (userBody) => {
  // https://www.postgresql.org/docs/9.1/sql-update.html
  let insert = 'UPDATE userInfo SET username = $1, ';
  insert += 'avatar = $2, showavatar = $3 WHERE ';
  insert += 'email = $4';

  const query = {
    text: insert,
    values: [userBody.username, userBody.avatar, userBody.showavatar,
      userBody.email],
  };
  await pool.query(query);
};

exports.selectMailById = async (id) => {
  const select = 'SELECT * FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};

exports.updateStarred = async (id, starred) => {
  // https://www.postgresql.org/docs/9.1/sql-update.html
  const select = 'UPDATE mail SET starred = $2 WHERE id = $1';
  const query = {
    text: select,
    values: [id, starred],
  };
  await pool.query(query);
};

exports.updateUnread = async (id, unread) => {
  // https://www.postgresql.org/docs/9.1/sql-update.html
  const select = 'UPDATE mail SET unread = $2 WHERE id = $1';
  const query = {
    text: select,
    values: [id, unread],
  };
  await pool.query(query);
};

exports.insertMail = async (mailBody) => {
  // https://www.postgresqltutorial.com/postgresql-insert/
  const insert = 'INSERT INTO mail(id, mailbox, mail) VALUES ($1, $2, $3)';
  const query = {
    text: insert,
    values: [mailBody.id, mailBody.mailbox.toLowerCase(), mailBody.mail],
  };
  await pool.query(query);
};

exports.insertMailbox = async (mailbox) => {
  // https://www.postgresqltutorial.com/postgresql-insert/
  const insert = 'INSERT INTO mailboxes(mailbox) VALUES ($1)';
  const query = {
    text: insert,
    values: [mailbox],
  };
  await pool.query(query);
};

exports.deleteMail = async (id) => {
  // https://www.postgresqltutorial.com/postgresql-delete/
  const del = 'DELETE FROM mail WHERE id = $1';
  const query = {
    text: del,
    values: [id],
  };
  await pool.query(query);
};

// https://www.postgresqltutorial.com/postgresql-count-function/
// https://stackoverflow.com/questions/5396498/postgresql-sql-count-of-true-values
exports.selectNumUnread = async () => {
  let select = 'SELECT mailbox, COUNT (CASE WHEN unread THEN 1 END) ';
  select += 'FROM mail GROUP BY mailbox';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  const unread = [];
  for (const row of rows) {
    unread.push(row);
  }
  return unread;
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
