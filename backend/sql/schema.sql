DROP TABLE IF EXISTS mail;
CREATE TABLE mail(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    mailbox VARCHAR(32),
    mail jsonb,
    unread BOOLEAN DEFAULT TRUE,
    starred BOOLEAN DEFAULT FALSE,
    avatar text DEFAULT 'placeholder'
);
--- https://stackoverflow.com/questions/219569/best-database-field-type-for-a-url --- 

DROP TABLE IF EXISTS userInfo;
CREATE TABLE userInfo(userid SERIAL PRIMARY KEY,
    username text DEFAULT 'Gmail User',
    avatar text DEFAULT '',
    showavatar BOOLEAN DEFAULT FALSE,
    email text,
    password text
);

DROP TABLE IF EXISTS mailboxes;
CREATE TABLE mailboxes(mailbox text);