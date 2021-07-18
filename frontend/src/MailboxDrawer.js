// Referenced from Professor Harrison's Assignment 6 example
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
// import Typography from '@material-ui/core/Typography';
import SharedContext from './SharedContext';
import MailboxList from './MailboxList';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer +200,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * @return {object} JSX
 */
function MailboxDrawer() {
  const {mailbox, setMailbox, drawerOpen,
    setDrawerOpen, toggleDrawerOpen, rerender,
    setWidth, setCard, editUser, setEditUser,
    compose} =
    React.useContext(SharedContext);

  const selectMailbox= (mailbox) => {
    setMailbox(mailbox);
    setDrawerOpen(false);
    setWidth('100vw'); // https://www.w3schools.com/cssref/css_units.asp
    setCard(false);
  };

  const classes = useStyles();
  return (
    <SharedContext.Provider value={{mailbox, selectMailbox, rerender,
      editUser, setEditUser, setDrawerOpen, compose}} >
      <Hidden smDown implementation="css">
        <Drawer // https://material-ui.com/components/drawers/#drawer
          className={classes.drawer}
          variant="permanent"
          classes={{paper: classes.drawerPaper}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css" // https://material-ui.com/components/hidden/#hidden
      >
        <Drawer
          style={{zIndex: '4000'}}
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawerOpen}
          ModalProps={{keepMounted: true}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
    </SharedContext.Provider>
  );
}

export default MailboxDrawer;
