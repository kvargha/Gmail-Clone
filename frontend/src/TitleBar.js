// Referenced from Professor Harrison's Assignment 6 example
import React, {useContext, useState, useEffect} from 'react';
import {getConfig} from './services/auth';
import {getEmail, logout} from './services/auth';
import {useHistory} from 'react-router-dom';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import InputBase from '@material-ui/core/InputBase';
import SharedContext from './SharedContext';
import {Hidden} from '@material-ui/core';

// https://material-ui.com/components/material-icons/
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// https://material-ui.com/components/text-fields/
import TextField from '@material-ui/core/TextField';

// https://material-ui.com/components/avatars/
import Avatar from '@material-ui/core/Avatar';

// http://zetcode.com/javascript/axios/
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 300,
  },
  avatarAppBar: {
    position: 'relative',
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    marginRight: theme.spacing(2),
  },
  search: {
    // https://codesandbox.io/s/mwbwd?file=/demo.js:233-285
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    'marginLeft': theme.spacing(1),
    'flexGrow': '1',
  },
  searchIcon: {
    // https://codesandbox.io/s/mwbwd?file=/demo.js:233-285
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    // https://codesandbox.io/s/mwbwd?file=/demo.js:233-285
    color: 'inherit',
  },
  inputInput: {
    // https://codesandbox.io/s/mwbwd?file=/demo.js:233-285
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  clear: {
    'marginLeft': theme.spacing(1),
  },
  avatar: {
    'marginLeft': theme.spacing(3),
    'marginBottom': theme.spacing(2),
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

// https://material-ui.com/components/dialogs/#dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * @return {object} App Bar
 */
function TitleBar() {
  const {mailbox, toggleDrawerOpen} = useContext(SharedContext);
  const {search, setSearch} = useContext(SharedContext);
  const {searchVal, setSearchVal} = useContext(SharedContext);
  const {setCompose} = useContext(SharedContext);
  const {editUser, setEditUser} = useContext(SharedContext);
  const {setFromTitleBar} = useContext(SharedContext);

  const [avatar, setAvatar] = useState();
  const [avatarOn, setAvatarOn] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();

  const [prompt, setPrompt] = useState(false);
  const [editAvatar, changeAvatar] = useState(false);

  const classes = useStyles();
  const theme = useTheme();
  // https://material-ui.com/components/use-media-query/#usemediaquery
  const notFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const history = useHistory();

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchVal(input);
    if (input.length > 0) {
      setSearch(true);
    } else {
      setSearch(false);
    }
  };

  const handleClear = () => {
    setSearchVal('');
  };

  const handleCompose = () => {
    setFromTitleBar(true);
    setCompose(true);
  };

  const handleBack = () => {
    setSearchVal('');
    setSearch(false);
  };

  const handleClose = () => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/user', getConfig())
        .then((res) => {
          const userBody = res.data[0];
          if (avatar != userBody['avatar'] ||
            avatarOn != userBody['showavatar'] ||
            userName != userBody['username']) {
            setPrompt(true);
          } else {
            setEditUser(false);
          }
        });
  };

  const handleLogout = () => {
    handleClose();
    logout();
    history.push('/login');
  };

  const handleSave = () => {
    const userInfo = {
      'username': userName,
      'avatar': avatar,
      'showavatar': avatarOn,
    };
    // http://zetcode.com/javascript/axios/
    axios.post('http://localhost:3010/v0/user/', userInfo, {}, getConfig('post'))
        .then((res) => {
          setEditUser(false);
        });
  };

  const handleNo = () => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/user', {}, getConfig())
        .then((res) => {
          const userBody = res.data[0];
          setAvatar(userBody['avatar']);
          setAvatarOn(userBody['showavatar']);
          setUserName(userBody['username']);
          setPrompt(false);
          setEditUser(false);
        });
  };

  const handleYes = () => {
    setPrompt(false);
    handleSave();
  };

  const handleContent = (e) => {
    setAvatar(e.target.value);
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const closeAvatar = () => {
    changeAvatar(false);
  };

  // https://stackoverflow.com/questions/60592759/setting-state-without-re-rendering-with-useeffect-not-working
  useEffect(() => {
    // http://zetcode.com/javascript/axios/
    axios.get('http://localhost:3010/v0/user', getConfig())
        .then((res) => {
          const userBody = res.data[0];
          setEmail(getEmail())
          setAvatar(userBody['avatar']);
          setAvatarOn(userBody['showavatar']);
          setUserName(userBody['username']);
        });
  }, []);

  return (
    <div>
      <AppBar position='fixed' className={classes.appBar} // https://material-ui.com/components/app-bar/#app-bar
      >
        <Toolbar>
          {!search ? (
          <IconButton
            color='inherit'
            edge='start'
            onClick={toggleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        ): (
          <IconButton edge='start' color='inherit'
            onClick={handleBack} aria-label='close'>
            <ArrowBackIosIcon />
          </IconButton>
        )}
          <Hidden mdDown // https://material-ui.com/components/hidden/#hidden
          >
            {!search ? (
          <Typography variant='h6' noWrap className={classes.title} // https://material-ui.com/components/typography/#typography
          >
            Gmail - {mailbox}
          </Typography>): (null)}
          </Hidden>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase // https://codesandbox.io/s/mwbwd?file=/demo.js:233-285
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              fullWidth
              inputProps={{'aria-label': 'search'}}
              value={searchVal}
              onChange={(e) => {
                handleSearch(e);
              }}
            />
          </div>
          {search ? (
          <IconButton edge='start' color='inherit'
            onClick={handleClear} aria-label='close'
            className={classes.clear}>
            <CloseIcon />
          </IconButton>
        ): (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <IconButton edge='start' color='inherit'
              onClick={handleCompose} aria-label='close'
              className={classes.clear}>
              <CreateIcon />
            </IconButton>
            <IconButton edge='start' color='inherit'
              onClick={ () => {
                setEditUser(true);
              }}
              aria-label='close'
              className={classes.clear}>
              <Avatar alt = {userName} src = {avatarOn ? avatar : null}/>
            </IconButton>
          </div>
        )}
        </Toolbar>
      </AppBar>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 2401}}
        fullScreen={notFullScreen}
        fullWidth
        open={editUser} onClose={handleClose}
        TransitionComponent={Transition}>
        <AppBar // https://material-ui.com/components/app-bar/#app-bar
          className={classes.avatarAppBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit'
              onClick={handleClose} aria-label='close'>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" style={{flexGrow: 1}}>
            </Typography>
            <IconButton color='inherit'
              onClick={handleSave} aria-label='close'>
              <SaveIcon />
            </IconButton>
            <Button size='small' variant="contained" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <List component='nav' aria-label='main mailbox folders' // https://material-ui.com/components/lists/#lists
          style={{overflow: 'auto'}}>
          <ListItem // https://material-ui.com/components/text-fields/
          >
            <IconButton edge='start' color='inherit'
              onClick={() => {
                changeAvatar(true);
              }}
              aria-label='close'>
              <Avatar alt = {userName} src = {avatar}
                className={classes.large}/>
            </IconButton>

            <ListItemText className={classes.td}
              primary={<TextField style={{width: '50%'}} label='Edit Username'
                value={userName}
                onChange={(e) => {
                  handleUserName(e);
                }}/>}
              secondary={
                <div>
                  <Typography // https://material-ui.com/components/typography/#typography
                  >{email}</Typography>
                  <div>
                    <IconButton edge='start' color='inherit'
                      onClick={() => {
                        setAvatarOn(!avatarOn);
                      }} aria-label='close'>
                      {avatarOn ? <CheckBoxIcon /> :
                        <CheckBoxOutlineBlankIcon />}
                      <Typography>Show Avatar</Typography>
                    </IconButton>
                  </div>
                </div>} />
          </ListItem>
        </List>
      </Dialog>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 3000}}
        maxWidth={'lg'}
        open={prompt} onClose={handleNo}
        TransitionComponent={Transition}>
        <div className={classes.root}></div>
        <DialogTitle>{'Save changes?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleNo} color='primary'>
            No
          </Button>
          <Button onClick={handleYes} color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog // https://material-ui.com/components/dialogs/#dialog
        style={{zIndex: 3000}}
        maxWidth={'lg'}
        fullWidth
        open={editAvatar} onClose={closeAvatar}
        TransitionComponent={Transition}>
        <div className={classes.root}></div>
        <Toolbar>
          <IconButton edge='start' color='inherit'
            onClick={closeAvatar} aria-label='close'>
            <ArrowBackIosIcon />
          </IconButton>
        </Toolbar>
        <TextField style={{width: '95%'}} label='Avatar Link'
          value={avatar}
          className={classes.avatar}
          onChange={(e) => {
            handleContent(e);
          }}/>
      </Dialog>
    </div>
  );
}

export default TitleBar;
