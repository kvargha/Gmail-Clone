// Referenced from Professor Harrison's Assignment 6 example
import React, {useContext, useEffect, useState} from 'react';
import {getConfig} from './services/auth';
import {useHistory} from 'react-router-dom';
import SharedContext from './SharedContext';

// Referenced https://material-ui.com/components/dialogs/#full-screen-dialogs
import {makeStyles} from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// https://material-ui.com/components/material-icons/
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';

// https://material-ui.com/components/avatars/
import Avatar from '@material-ui/core/Avatar';


// http://zetcode.com/javascript/axios/
const axios = require('axios');

// https://material-ui.com/components/dialogs/#dialog
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: 'white',
  },
  mailbox: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
  },
  row: {
    alignContent: 'left',
    display: 'flex',
  },
  td: {
    marginLeft: theme.spacing(2),
    flex: '1',
  },
  tdR: {
    textAlign: 'right',
    flex: '1',
  },
  content: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  x: {
    display: 'flex',
    marginLeft: 'auto',
    color: 'white',
  },
  card: {
    margin: 'auto',
  },
  cardHeader: {
    paddingTop: '10px',
    paddingBottom: '10px',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
  },
  bold: {
    color: 'black',
    fontWeight: 'bold',
  },
  pad: {
    display: 'flex',
  },
  titleDialogue: {
    // https://www.w3schools.com/cssref/css_colors.asp
    backgroundColor: 'LightGrey',
    padding: '5px',
  },
  toolbar: theme.mixins.toolbar,
}));

/**
 * @return {object} Email content
 */
function EmailViewerDesktop() {
  // https://www.youtube.com/watch?v=lhMKvyLRWo0&feature=youtu.be&fbclid=IwAR10z8SwlO_a9VIjE2sxxoYNyd_LNa0-A6FRgZ4fMzzftO7SiKzMSWZm6Jc
  const {setWidth} = useContext(SharedContext);
  const {mailbox} = useContext(SharedContext);
  const {searchVal} = useContext(SharedContext);
  // Referenced https://www.digitalocean.com/community/tutorials/how-to-manage-state-with-hooks-on-react-components
  const {email} = useContext(SharedContext);
  const {from} = useContext(SharedContext);
  const {subject} = useContext(SharedContext);
  const {received} = useContext(SharedContext);
  const {content} = useContext(SharedContext);
  const {rerender, setRerender} = useContext(SharedContext);
  const {emailId} = useContext(SharedContext);
  const {star, setStarred} = useContext(SharedContext);
  const {viewDesktop, setViewDesktop} = useContext(SharedContext);
  const {avatar} = useContext(SharedContext);
  const {card, setCard} = useContext(SharedContext);

  // https://material-ui.com/components/drawers/
  const theme = useTheme();
  const classes = useStyles();
  // https://material-ui.com/components/use-media-query/#usemediaquery
  const notFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // https://material-ui.com/components/dialogs/#dialog
  const handleClose = () => {
    setWidth('100vw');
    setCard(false);
    setRerender(!rerender);
  };

  const handleStar = (id) => {
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + id + '?mailbox=' + mailbox.toLowerCase() + '&starred=' + star, {}, getConfig('put'))
        .then(() => {
          setStarred(!star);
          setRerender(!rerender);
        });
  };

  const handleUnread = () => {
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + emailId + '?mailbox=' + mailbox.toLowerCase() + '&unread=' + true, {}, getConfig('put'))
        .then(() => {
          handleClose();
        });
  };

  const moveToTrash = () => {
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + emailId + '?mailbox=trash', {}, getConfig('put'))
        .then(() => {
          axios.put('http://localhost:3010/v0/mail/' + emailId + '?mailbox=trash&unread=' + false, {}, getConfig('put'))
              .then(() => {
                handleClose();
              });
        });
  };

  const moveToMail = (box) => {
    box = box.toLowerCase();
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + emailId + '?mailbox=' + box, {}, getConfig('put'))
        .then(() => {
          axios.put('http://localhost:3010/v0/mail/' + emailId + '?mailbox=' + box + '&unread=' + false, {}, getConfig('put'))
              .then(() => {
                setRerender(!rerender);
              });
        });
    handleClose();
  };

  // https://material-ui.com/components/menus/
  const [anchorEl, setAnchorEl] = useState();

  const handleClicked = (event) => {
    setAnchorEl(event.currentTarget);
    setRerender(!rerender);
  };

  const handleClosed = () => {
    setAnchorEl(null);
  };

  const handleMove = (box) => {
    setAnchorEl(null);
    moveToMail(box);
  };

  const mailboxes = [];

  // https://stackoverflow.com/questions/60592759/setting-state-without-re-rendering-with-useeffect-not-working
  useEffect(() => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/mailboxes/', getConfig())
        .then((res) => {
          const mailboxList = res.data;
          mailboxList.map((box) => {
            // Prevent user from moving Sent emails to inbox
            if (mailbox == 'Sent') {
                if (box.mailbox != 'Sent' && box.mailbox != 'Drafts' &&
                  box.mailbox != mailbox && box.mailbox != 'Inbox') {
                    mailboxes.push(box.mailbox);
                }
            }
            else if (box.mailbox != 'Sent' && box.mailbox != 'Drafts' &&
              box.mailbox != mailbox) {
                mailboxes.push(box.mailbox);
            }
          });
          console.log(mailboxes);
          const viewer = (<div style = {{minWidth: '44vw', maxWidth: '44vw'}}>
            <div className={classes.toolbar} />
            <div className={classes.root}></div>
            <AppBar // https://material-ui.com/components/app-bar/#app-bar
              className={classes.appBar}>
              <Toolbar>
                <IconButton edge='start' color='inherit'
                  onClick={handleClose} aria-label='close'>
                  <ArrowBackIosIcon />
                </IconButton>
                <Typography variant='h6' className={classes.title}>
                </Typography>
                {mailbox != 'Sent' &&
                        mailbox != 'Trash' ?
                <IconButton edge='end' color='inherit'
                  onClick={handleUnread} aria-label='close'>
                  <MailOutlineIcon />
                </IconButton> : null
                }
                {mailbox != 'Trash' ?
              (<IconButton edge='end' color='inherit'
                onClick={moveToTrash} aria-label='close'>
                <DeleteOutlineIcon />
              </IconButton>) :
              null
                }
                <IconButton edge='end' color='inherit'
                  aria-label='close'
                  onClick={handleClicked}>
                  <MoveToInboxIcon/>
                </IconButton>
                <Menu // https://material-ui.com/components/menus/#menus
                  style={{zIndex: 2402}}
                  id='simple-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClosed}
                >
                  {mailboxes.map((box) => (
                    <MenuItem key={box}
                      onClick={() => handleMove(box)}>{box}</MenuItem>
                  ))}
                </Menu>
              </Toolbar>
            </AppBar>
            <List component='nav' aria-label='main mailbox folders' // https://material-ui.com/components/lists/#lists
              style={{overflow: 'auto'}}>
              <ListItem>
                <h2 style={{marginBottom: '0px'}}>{subject}</h2>
              </ListItem>
              <ListItem>
                <div className={classes.titleDialogue}>{mailbox}</div>
                <ListItemText className={classes.tdR}
                  primary={
                    <IconButton edge='start' color='inherit'
                      aria-label='close'
                      // https://stackoverflow.com/questions/63749994/click-icon-button-in-the-card-component-without-clicking-the-whole-card
                      onClick={() => handleStar(emailId)}>
                      {star ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  }/>
              </ListItem>
              <ListItem>
                <Avatar alt={from.toUpperCase()} src={avatar} // https://material-ui.com/components/avatars/#avatar
                />
                <ListItemText
                  className={classes.td}
                  primary={<div className={classes.pad}>
                    <div style={{marginRight: '10px'}}>{from}</div>
                    <div>{received}</div>
                  </div>}
                  secondary={email}/>
              </ListItem>
              <ListItem>
                <div className={classes.content}
                  dangerouslySetInnerHTML={{__html: content}}
                  // https://medium.com/@uigalaxy7/how-to-render-html-in-react-7f3c73f5cafc
                />
              </ListItem>
            </List>
          </div>);
          setViewDesktop(viewer);
        });
  }, [mailbox, notFullScreen, searchVal, rerender, star, anchorEl]);

  return (
    <div>
      {card ? viewDesktop : null}
    </div>
  );
}

export default EmailViewerDesktop;
