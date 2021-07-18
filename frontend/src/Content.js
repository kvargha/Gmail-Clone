// Referenced from Professor Harrison's Assignment 6 example
import React, {useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {getConfig} from './services/auth';
import EmailViewer from './EmailViewer';
import Compose from './Compose';
import SharedContext from './SharedContext';

// Referenced https://material-ui.com/components/dialogs/#full-screen-dialogs
import {makeStyles} from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';

// https://material-ui.com/components/material-icons/
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

// https://material-ui.com/components/avatars/
import Avatar from '@material-ui/core/Avatar';

// http://zetcode.com/javascript/axios/
const axios = require('axios');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// https://material-ui.com/components/dialogs/#dialog
const useStyles = makeStyles((theme) => ({
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
  },
  content: {
    marginLeft: theme.spacing(2),
  },
  bold: {
    color: 'black',
    fontWeight: 'bold',
  },
  center: {
    justifyContent: 'center',
  },
  toolbar: theme.mixins.toolbar,
}));

const date = new Date();

/**
 * @return {object} Email body
 */
function Content() {
  const history = useHistory();
  // https://www.youtube.com/watch?v=lhMKvyLRWo0&feature=youtu.be&fbclid=IwAR10z8SwlO_a9VIjE2sxxoYNyd_LNa0-A6FRgZ4fMzzftO7SiKzMSWZm6Jc
  const {setCard} = useContext(SharedContext);
  const {windowWidth, setWidth} = useContext(SharedContext);
  const {mailbox} = useContext(SharedContext);
  const {search} = useContext(SharedContext);
  const {searchVal} = useContext(SharedContext);
  // Referenced https://www.digitalocean.com/community/tutorials/how-to-manage-state-with-hooks-on-react-components
  const {setOpen} = useContext(SharedContext);
  const {setEmail} = useContext(SharedContext);
  const {setFrom} = useContext(SharedContext);
  const {setSubject} = useContext(SharedContext);
  const {setReceived} = useContext(SharedContext);
  const {setContent} = useContext(SharedContext);
  const {emails, setEmails} = useContext(SharedContext);
  const {rerender, setRerender} = useContext(SharedContext);
  const {setId} = useContext(SharedContext);
  const {star, setStarred} = useContext(SharedContext);
  const {setCompose} = useContext(SharedContext);
  const {setComposeTo} = useContext(SharedContext);
  const {setComposeSubject} = useContext(SharedContext);
  const {setComposeContent} = useContext(SharedContext);
  const {setAvatar} = useContext(SharedContext);
  let emailArray = [];

  // https://material-ui.com/components/drawers/
  const theme = useTheme();
  const classes = useStyles();
  // https://material-ui.com/components/use-media-query/#usemediaquery
  const notFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // https://material-ui.com/components/dialogs/#dialog
  const handleClickOpen = (id) => {
    // Find index of email
    let index = 0;
    for (let i = 0; i < emailArray.length; i++) {
      if (emailArray[i].id == id) {
        index = i;
        break;
      }
    }
    setId(id);
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + id + '?mailbox=' + mailbox.toLowerCase() + '&unread=' + false, {}, getConfig('put'))
        .then(() => {
          setRerender(!rerender);
        });
    // Referenced https://www.digitalocean.com/community/tutorials/how-to-manage-state-with-hooks-on-react-components
    setFrom(((mailbox == 'Sent' || mailbox == 'Drafts') ?
      emailArray[index].to.name : emailArray[index].from.name));
    setEmail(((mailbox == 'Sent' || mailbox == 'Drafts') ?
      emailArray[index].to.email : emailArray[index].from.email));
    setReceived(emailArray[index].newReceived);
    setSubject(emailArray[index].subject);
    setContent(emailArray[index].content);
    setStarred(emailArray[index].starred);
    setAvatar(emailArray[index].avatar);
    if (notFullScreen) {
      setOpen(true);
    } else {
      setWidth('40vw');
      setCard(true);
    }
  };

  const handleStar = (e, id) => {
    // https://stackoverflow.com/questions/35914680/how-to-call-stoppropagation-in-reactjs
    e.stopPropagation();
    let index = 0;
    for (let i = 0; i < emailArray.length; i++) {
      if (emailArray[i].id == id) {
        index = i;
        break;
      }
    }
    const starred = emailArray.length == 0 ? star : emailArray[index].starred;
    // http://zetcode.com/javascript/axios/
    console.log('test')
    axios.put('http://localhost:3010/v0/mail/' + id + '?starred=' + starred, {}, getConfig('put'))
        .then(() => {
          setRerender(!rerender);
        });
  };

  const handleCompose = (id) => {
    // Find index of email
    let index = 0;
    for (let i = 0; i < emailArray.length; i++) {
      if (emailArray[i].id == id) {
        index = i;
        break;
      }
    }
    setId(id);
    // http://zetcode.com/javascript/axios/
    axios.put('http://localhost:3010/v0/mail/' + id + '?unread=' + false, {}, getConfig('put'))
        .then(() => {
          setRerender(!rerender);
        });
    setComposeTo(emailArray[index].to.email);
    setComposeSubject(emailArray[index].subject);
    setComposeContent(emailArray[index].content);
    setCompose(true);
  };

  // https://stackoverflow.com/questions/15180173/convert-html-to-plain-text-in-js-without-browser-environment
  const removeHTML = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  // https://stackoverflow.com/questions/60592759/setting-state-without-re-rendering-with-useeffect-not-working
  useEffect(() => {
    // http://zetcode.com/javascript/axios/
    (search ? axios.get('http://localhost:3010/v0/mail?mailbox=' + mailbox.toLowerCase() + '&search=' + searchVal + '&searchOn=true', getConfig('get')) :
      axios.get('http://localhost:3010/v0/mail?mailbox=' + mailbox.toLowerCase(), getConfig('get')))
        .then((res) => {
          if (res.data.length == 0) {
            setEmails([]);
          } else {
            const temp = res.data[0]['mail'];
            emailArray = temp;
            // Referenced https://stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property
            temp.sort(function(a, b) {
              return new Date(b.sent) - new Date(a.sent);
            });
            // Change received content
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            for (let i = 0; i < temp.length; i++) {
              const receivedDate = new Date(temp[i].sent);
              if (receivedDate.getFullYear() == date.getFullYear() &&
              receivedDate.getMonth() == date.getMonth() &&
              receivedDate.getDate() == date.getDate()) {
                // https://stackoverflow.com/a/36271652/14503257
                const options = {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                };
                temp[i].newReceived =
                  receivedDate.toLocaleString('en-US', options);
              } else if (receivedDate.getFullYear() == date.getFullYear() &&
              receivedDate.getMonth() == date.getMonth() &&
              receivedDate.getDate() == (date.getDate() - 1)) {
                temp[i].newReceived = 'Yesterday';
              } else if (receivedDate.getFullYear() == date.getFullYear()) {
                temp[i].newReceived =
                months[receivedDate.getMonth()] + ' ' + receivedDate.getDate();
              } else {
                temp[i].newReceived = receivedDate.getFullYear();
              }
            }
            const emailList = temp.map((email) => {
            // Referenced https://material-ui.com/components/lists/
            // https://material-ui.com/api/typography/
              return (<ListItem button key={email.id}
                onClick={() =>(mailbox == 'Drafts' ?
                  handleCompose(email.id) : handleClickOpen(email.id))}
                className={classes.row}>
                <Avatar alt = {((mailbox == 'Sent' || mailbox == 'Drafts') ? // https://material-ui.com/components/avatars/#avatar
                  email.to.name.toUpperCase() : email.from.name.toUpperCase())}
                src = {email.avatar}/>
                <ListItemText className={classes.td}
                  primary={
                    <div>
                      <Typography noWrap // https://material-ui.com/components/typography/#typography
                        className={email.unread && mailbox != 'Sent' &&
                        mailbox != 'Trash' ? classes.bold : null}>
                        {mailbox == 'Sent' || mailbox == 'Drafts' ?
                          email.to.name : email.from.name}
                      </Typography>
                    </div>}
                  secondary={
                    <div>
                      <div>
                        <Typography noWrap
                          className={email.unread && mailbox != 'Sent' &&
                          mailbox != 'Trash' ? classes.bold : null}>
                          {email.subject}
                        </Typography>
                      </div>
                      <div>
                        <Typography noWrap>
                          {removeHTML(email.content)} </Typography>
                      </div>
                    </div>} />
                <ListItemText className={classes.tdR}
                  primary={email.newReceived}
                  secondary={
                    <IconButton edge='end' color='inherit'
                      aria-label='close'
                      // https://stackoverflow.com/questions/63749994/click-icon-button-in-the-card-component-without-clicking-the-whole-card
                      onClick={(e) => handleStar(e, email.id)}>
                      {email.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  }/>
              </ListItem>);
            });
            setEmails(emailList);
          }
        })
        .catch((error) => {
          if (error.status === 403) {
            history.push('/login');
          } else {
            setEmails([]);
          }
        });
  }, [search, mailbox, notFullScreen, searchVal, rerender]);

  return (
    <div>
      <div className={classes.toolbar} />
      {notFullScreen ? (
        <div>
          <Typography variant="h6" noWrap className={classes.mailbox} // https://material-ui.com/components/typography/#typography
          >
            {mailbox}
          </Typography>
        </div>) : (
          null
        )}

      <List component='nav' aria-label='main mailbox folders' // https://material-ui.com/components/lists/#lists
        style={{maxHeight: '100vh', maxWidth: windowWidth,
          overflow: 'auto'}}>
        {emails}
      </List>
      <div>
        <EmailViewer/>
        <Compose/>
      </div>
    </div>
  );
}

export default Content;
