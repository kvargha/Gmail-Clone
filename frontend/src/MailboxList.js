// Referenced from Professor Harrison's Assignment 6 example
import React, {useContext, useEffect, useState} from 'react';
import {getConfig} from './services/auth';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

// https://material-ui.com/components/material-icons/
import DeleteIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/Inbox';
import InputIcon from '@material-ui/icons/Input';
import DraftsIcon from '@material-ui/icons/Drafts';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import ForwardIcon from '@material-ui/icons/Forward';

import SharedContext from './SharedContext';

// https://material-ui.com/components/text-fields/
import TextField from '@material-ui/core/TextField';

// http://zetcode.com/javascript/axios/
const axios = require('axios');

// https://material-ui.com/components/dialogs/#dialog
const useStyles = makeStyles((theme) => ({
  unread: {
    marginLeft: theme.spacing(19),
    textAlign: 'right',
  },
  title: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    flex: 1,
  },
  addMailbox: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '95%',
  },
}));

const otherMailboxes = [
  {name: 'Inbox', unread: 0},
  {name: 'Starred', starred: 0},
];

const boxes = [
  {name: 'Sent', icon: <InputIcon/>},
  {name: 'Drafts', icon: <DraftsIcon/>, unread: 0},
  {name: 'Trash', icon: <DeleteIcon/>},
];

let unreadList = [];

let newMailboxes = [];

// https://material-ui.com/components/dialogs/#dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * @return {object} List of mailboxes
 */
function MailboxList() {
  const {mailbox, selectMailbox} = useContext(SharedContext);
  const {rerender} = useContext(SharedContext);
  const {compose} = useContext(SharedContext);
  const {open, drawerOpen, setDrawerOpen} = useContext(SharedContext);
  const {setEditUser} = useContext(SharedContext);
  const [mailList, setMailList] = useState();
  const [addMailbox, setAddMailbox] = useState(false);
  const [mailboxName, setMailboxName] = useState(false);
  const classes = useStyles();

  const handleSubmit = () => {
    const mailboxInfo = {
      'mailbox': mailboxName,
    };
    // http://zetcode.com/javascript/axios/
    axios.post('http://localhost:3010/v0/mailboxes/', mailboxInfo, {}, getConfig('post'))
        .then((res) => {
          setAddMailbox(false);
        });
  };

  const handleContent = (e) => {
    setMailboxName(e.target.value);
  };

  // https://stackoverflow.com/questions/60592759/setting-state-without-re-rendering-with-useeffect-not-working
  useEffect(() => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/mailboxes/', getConfig())
        .then((res) => {
          newMailboxes = res.data.slice(4);
          axios.get('http://localhost:3010/v0/unread', getConfig())
              .then((res) => {
                unreadList = res.data;
                for (let i = 0; i < newMailboxes.length; i++) {
                  for (let j = 0; j < unreadList.length; j++) {
                    if (newMailboxes[i]['mailbox'].toLowerCase() ==
                      unreadList[j]['mailbox']) {
                      newMailboxes[i]['unread'] = unreadList[j]['count'];
                      break;
                    }
                  }
                }
                axios.get('http://localhost:3010/v0/mail', getConfig())
                    .then((res) => {
                      const emails = res.data;
                      boxes.map((mailbox) => {
                        const mailboxName = mailbox['name'].toLowerCase();
                        for (let i = 0; i < emails.length; i++) {
                          if (emails[i]['name'] == ('drafts')) {
                            mailbox['unread'] = emails[i]['mail'].length;
                            break;
                          } else if (emails[i]['name'] ==
                            (mailboxName + 'Unread')) {
                            mailbox['unread'] = emails[i]['mail'].length;
                            break;
                          } else if (emails[i]['name'] ==
                            ('inboxUnread')) {
                            otherMailboxes[0]['unread'] =
                              emails[i]['mail'].length;
                          } else if (emails[i]['name'] ==
                            ('starred')) {
                            otherMailboxes[1]['starred'] =
                              emails[i]['mail'].length;
                          }

                          if (mailboxName == 'drafts') {
                            mailbox['unread'] = 0;
                          }
                        }
                      });

                      const mailboxList = (
                        <div>
                          <Hidden mdUp // https://material-ui.com/components/hidden/#hidden
                          >
                            <Typography variant='h6' className={classes.title} // https://material-ui.com/components/typography/#typography
                              style={{fontWeight: 'bold'}}>
                              Gmail
                            </Typography>
                          </Hidden>
                          <Hidden mdDown>
                            <Toolbar/>
                          </Hidden>
                          <List // https://material-ui.com/components/lists/#lists
                          >
                            <ListItem button
                              key={'Inbox'}
                              disabled={mailbox == 'Inbox'}
                              onClick={() => selectMailbox('Inbox')}
                            >
                              <ListItemIcon>
                                <InboxIcon/>
                              </ListItemIcon>
                              <ListItemText primary={'Inbox'}/>
                              <ListItemText className={classes.unread}
                                primary={otherMailboxes[0].unread}/>
                            </ListItem>
                            <Divider/>
                            <ListItem
                              key={'Starred'}
                            >
                              <ListItemIcon>
                                <StarIcon/>
                              </ListItemIcon>
                              <ListItemText primary={'Starred'}/>
                              <ListItemText className={classes.unread}
                                primary={otherMailboxes[1].starred}/>
                            </ListItem>
                            {boxes.map((box) => (
                              <ListItem button
                                key={box.name}
                                disabled={mailbox == box.name}
                                onClick={() => selectMailbox(box.name)}
                              >
                                <ListItemIcon>
                                  {box.icon}
                                </ListItemIcon>
                                <ListItemText primary={box.name}/>
                                {box.name == 'Drafts' ?
                                  <ListItemText className={classes.unread}
                                    primary={box.unread}/> : null}

                              </ListItem>
                            ))}
                            <Divider/>
                            {newMailboxes.length > 0 ?
                (newMailboxes.map((box) => (
                  <ListItem button
                    key={box.mailbox}
                    disabled={mailbox == box.mailbox}
                    onClick={() => selectMailbox(box.mailbox)}
                  >
                    <ListItemIcon>
                      <ForwardIcon/>
                    </ListItemIcon>
                    <ListItemText primary={box.mailbox}/>
                    <ListItemText className={classes.unread}
                      primary={box.unread}/>
                  </ListItem>
                ))) :
                null
                            }
                            {newMailboxes.length > 0 ?
                (<Divider/>) :
                null
                            }
                            <ListItem button
                              key={'New Mailbox'}
                              onClick={() =>{
                                setDrawerOpen(false);
                                setAddMailbox(true);
                              }}
                            >
                              <ListItemIcon>
                                <AddIcon/>
                              </ListItemIcon>
                              <ListItemText primary={'New Mailbox'}/>
                            </ListItem>
                            <Divider/>
                            <ListItem button
                              key={'Settings'}
                              onClick={() => {
                                setDrawerOpen(false);
                                setEditUser(true);
                              }}
                            >
                              <ListItemIcon>
                                <SettingsIcon/>
                              </ListItemIcon>
                              <ListItemText primary={'Settings'}/>
                            </ListItem>
                          </List>
                        </div>
                      );
                      setMailList(mailboxList);
                    });
              });
        });
  }, [mailbox, rerender, open, drawerOpen, addMailbox, compose]);

  return (
    <div>
      {mailList}
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 3000}}
        maxWidth={'lg'}
        fullWidth
        open={addMailbox}
        onClose={() => {
          setAddMailbox(false);
        }}
        TransitionComponent={Transition}>
        <div className={classes.root}></div>
        <TextField label='Mailbox Name' // https://material-ui.com/components/text-fields/#text-field
          className={classes.addMailbox}
          onChange={(e) => {
            handleContent(e);
          }}/>
        <DialogActions>
          <Button onClick={() => {
            setAddMailbox(false);
          }} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MailboxList;
