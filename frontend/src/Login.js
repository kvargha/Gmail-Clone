import React from 'react';
import {useHistory} from 'react-router-dom';
import {authenticate} from './services/auth';
import { Grid, Avatar, TextField, } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loginBox: {
    padding:20,
    marginTop: '50px',
    [theme.breakpoints.down(500)]: {
      height:'70vh',
      width:'85vw',
    },
    [theme.breakpoints.between(500, "sm")]: {
      height:'70vh',
      width:'60vw',
    },
    [theme.breakpoints.up("md")]: {
      height:'70vh',
      width:'40vw',
    },
    [theme.breakpoints.up("lg")]: {
      height:'70vh',
      width:'30vw',
    },
  },

  inputFields: {
    marginBottom: '50px',
  },

  avatarStyle: {
    backgroundColor:'grey'
  }
}));

/**
 * Component for login
 *
 * @return {object} JSX
 */
function Login() {
  const [user, setUser] = React.useState({
    email: '', password: '',
  });

  const history = useHistory();
  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    authenticate(user).then((authenticatedUser) => {
      if (authenticatedUser) {
        history.push('/');
      }
    });
  };

  const classes = useStyles();

  return (
    <Grid direction='column' container display='flex' alignItems='center'>
      <Card elevation={10} className={classes.loginBox}>
        <Grid align='center'>
              <Avatar className={classes.avatarStyle}><LockOutlinedIcon/></Avatar>
            <h2>Sign In</h2>
        </Grid>
        <form onSubmit={onSubmit} className='loginBox'>
          <TextField label='Email' type='email' name='email' id="email" placeholder='Enter your email' fullWidth required onChange={handleInputChange} className={classes.inputFields}/>
          <TextField label='Password' id='password' name='password' placeholder='Enter your password' type='password' fullWidth required onChange={handleInputChange} className={classes.inputFields}/>
          <Button type="submit" color="primary" variant="contained" value='Sign in' fullWidth>
            Sign in
          </Button>
        </form>
      </Card>
    </Grid>
  );
};
export default Login;

