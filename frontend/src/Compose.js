// Referenced from Professor Harrison's Assignment 6 example
import React, {useContext, useState} from 'react';
import {getConfig} from './services/auth';
import {useHistory} from 'react-router-dom';
import SharedContext from './SharedContext';

// Referenced https://material-ui.com/components/dialogs/#full-screen-dialogs
import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// https://material-ui.com/components/material-icons/
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SendIcon from '@material-ui/icons/Send';

// https://material-ui.com/components/text-fields/
import TextField from '@material-ui/core/TextField';

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
    marginLeft: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

// https://material-ui.com/components/dialogs/#dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * @return {object} Compose email
 */
function Compose() {
  // https://www.youtube.com/watch?v=lhMKvyLRWo0&feature=youtu.be&fbclid=IwAR10z8SwlO_a9VIjE2sxxoYNyd_LNa0-A6FRgZ4fMzzftO7SiKzMSWZm6Jc
  const {emailId} = useContext(SharedContext);
  const {compose, setCompose} = useContext(SharedContext);
  const {composeTo, setComposeTo} = useContext(SharedContext);
  const {composeSubject, setComposeSubject} = useContext(SharedContext);
  const {composeContent, setComposeContent} = useContext(SharedContext);
  const {rerender, setRerender} = useContext(SharedContext);
  const {fromTitleBar, setFromTitleBar} = useContext(SharedContext);
  const {mailbox} = useContext(SharedContext);
  const [invalidInput, setInvalidInput] = useState(false);
  const [save, setSave] = useState(false);
  const [emails, setEmails] = useState([]);
  const [changesMade, setChanges] = useState(false);

  // https://material-ui.com/components/drawers/
  const theme = useTheme();
  const classes = useStyles();
  // https://material-ui.com/components/use-media-query/#usemediaquery
  const notFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const clear = () => {
    setCompose(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeContent('');
    setChanges(false);
  };

  // https://material-ui.com/components/dialogs/#dialog
  const handleClose = () => {
    if (changesMade) {
      setSave(true);
    } else {
      clear();
    }
  };

  const handleInvalid = () => {
    setInvalidInput(false);
  };

  const handleSave = () => {
    setSave(false);
  };

  const handleNo = () => {
    clear();
    setSave(false);
  };

  const handleYes = () => {
    const name = composeTo.split('@');
    const email = {
      'to': {'name': name[0], 'email': composeTo},
      'subject': composeSubject,
      'content': composeContent,
    };
    // http://zetcode.com/javascript/axios/
    axios.post('http://localhost:3010/v0/drafts/', email, getConfig('post'))
        .then(() => {
          if (mailbox == 'Drafts' && fromTitleBar == false) {
            // http://zetcode.com/javascript/axios/
            axios.delete('http://localhost:3010/v0/mail/' + emailId, {}, getConfig('delete'))
                .then(() => {
                  setSave(false);
                  setRerender(!rerender);
                  clear();
                });
          } else {
            setFromTitleBar(false);
            setSave(false);
            setRerender(!rerender);
            clear();
          }
        })
        .catch(() => {
          setInvalidInput(true);
        });
  };

  const handleCompose = () => {
    const name = composeTo.split('@');
    const email = {
      'to': {'name': name[0], 'email': composeTo},
      'subject': composeSubject,
      'content': composeContent,
    };
    // http://zetcode.com/javascript/axios/
    axios.post('http://localhost:3010/v0/mail/', email, getConfig('post'))
        .then(() => {
          if (mailbox == 'Drafts' && fromTitleBar == false) {
            // http://zetcode.com/javascript/axios/
            axios.delete('http://localhost:3010/v0/mail/' + emailId, {}, getConfig('delete'))
                .then(() => {
                  setRerender(!rerender);
                  clear();
                });
          } else {
            setFromTitleBar(false);
            setRerender(!rerender);
            clear();
          }
        })
        .catch(() => {
          setInvalidInput(true);
        });
  };

  const grabEmails = () => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/emails', getConfig())
        .then((res) => {
          setEmails(res.data);
        });
  };

  const handleTo = (e) => {
    setChanges(true);
    setComposeTo(e.target.value);
  };

  const handleSubject = (e) => {
    setChanges(true);
    setComposeSubject(e.target.value);
  };

  const handleContent = (e) => {
    setChanges(true);
    setComposeContent(e.target.value);
  };

  // https://material-ui.com/components/menus/
  const [anchorEl, setAnchorEl] = useState();

  const handleClicked = (event) => {
    grabEmails();
    setAnchorEl(event.currentTarget);
    setRerender(!rerender);
  };

  const handleClosed = () => {
    setAnchorEl(null);
  };

  const handleSelect = (email) => {
    setChanges(true);
    setComposeTo(email);
    setAnchorEl(null);
  };

  return (
    <div>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 2401}}
        fullScreen={notFullScreen}
        fullWidth
        open={compose} onClose={handleClose}
        TransitionComponent={Transition}>
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
            <IconButton edge='start' color='inherit'
              onClick={handleCompose} aria-label='close'>
              <SendIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List component='nav' aria-label='main mailbox folders'
          style={{overflow: 'auto'}}>
          <ListItem // https://material-ui.com/components/text-fields/
          >
            <TextField style={{width: '100%'}} label='To'
              value={composeTo}
              onChange={(e) => {
                handleTo(e);
              }}/>
            <IconButton edge='right' color='inherit' // https://material-ui.com/api/icon-button/
              aria-label='close'
              onClick={handleClicked}>
              <ArrowDropDownIcon/>
            </IconButton>
            <Menu // https://material-ui.com/components/menus/#menus
              style={{zIndex: 4000}}
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClosed}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                },
              }}
            >
              {emails.map((email) => (
                <MenuItem key={email}
                  onClick={() => handleSelect(email)}>{email}</MenuItem>
              ))}
            </Menu>
          </ListItem>
          <ListItem>
            <TextField style={{width: '100%'}} label='Subject'
              value={composeSubject}
              onChange={(e) => {
                handleSubject(e);
              }}/>
          </ListItem>
          <ListItem>
            <TextField style={{width: '100%'}} label='Content'
              value={composeContent}
              multiline
              rows={35}
              onChange={(e) => {
                handleContent(e);
              }}/>
          </ListItem>
        </List>
      </Dialog>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 3000}}
        maxWidth={'lg'}
        open={invalidInput} onClose={handleInvalid}
        TransitionComponent={Transition}>
        <div className={classes.root}></div>
        <AppBar // https://material-ui.com/components/app-bar/#app-bar
          className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit'
              onClick={handleInvalid} aria-label='close'>
              <ArrowBackIosIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogTitle>{'Please enter a valid email address'}</DialogTitle>
      </Dialog>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 3000}}
        maxWidth={'lg'}
        open={save} onClose={handleSave}
        TransitionComponent={Transition}>
        <div className={classes.root}></div>
        <DialogTitle>{'Save as a draft?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleNo} color="primary">
            No
          </Button>
          <Button onClick={handleYes} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Compose;
