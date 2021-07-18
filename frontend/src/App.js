// Referenced from Professor Harrison's Assignment 6
import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './Login';

import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
import EmailViewerDesktop from './EmailViewerDesktop';
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  desktopBody: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    width: 'calc(100% - 300px)',
  },
  mobileBody: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    width: '100%',
  },
}));

/**
 * Main component
 *
 * @return {object} JSX
 */
function App() {
  const [mailbox, setMailbox] = useState('Inbox');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [card, setCard] = useState(false);
  const [windowWidth, setWidth] = useState('100vw'); // https://www.w3schools.com/cssref/css_units.asp
  const [search, setSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState();
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState();
  const [received, setReceived] = useState();
  const [content, setContent] = useState();
  const [emails, setEmails] = useState([]);
  const [rerender, setRerender] = useState(true);
  const [emailId, setId] = useState('');
  const [star, setStarred] = useState(false);
  const [view, setView] = useState();
  const [viewDesktop, setViewDesktop] = useState();
  const [compose, setCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editUser, setEditUser] = useState(false);
  const [fromTitleBar, setFromTitleBar] = useState(false);

  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const theme = useTheme();
  const classes = useStyles();
  // https://material-ui.com/components/use-media-query/#usemediaquery
  const notFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        toggleDrawerOpen,
        card, setCard,
        windowWidth, setWidth,
        search, setSearch,
        searchVal, setSearchVal,
        open, setOpen,
        email, setEmail,
        from, setFrom,
        subject, setSubject,
        received, setReceived,
        content, setContent,
        emails, setEmails,
        rerender, setRerender,
        emailId, setId,
        star, setStarred,
        view, setView,
        compose, setCompose,
        composeTo, setComposeTo,
        composeSubject, setComposeSubject,
        composeContent, setComposeContent,
        avatar, setAvatar,
        viewDesktop, setViewDesktop,
        editUser, setEditUser,
        fromTitleBar, setFromTitleBar,
      }}
      >
        <Router>
          <Switch>
            <Route exact path="/">
              <MailboxDrawer/>
              <TitleBar/>
              <div className = {notFullScreen ? classes.mobileBody : classes.desktopBody}>
                <Grid item xs={12}>
                  <Paper>
                    <Content/>
                  </Paper>
                </Grid>
                <Hidden mdDown // https://material-ui.com/components/hidden/#hidden
                >
                  <EmailViewerDesktop />
                </Hidden>
              </div>
            </Route>

            <Route path="/login">
              <Login></Login>
            </Route>
          </Switch>
        </Router>


      </SharedContext.Provider>
    </div>
  );
}

export default App;
