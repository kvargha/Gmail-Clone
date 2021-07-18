import React from 'react';
import './Login.css';
import {useHistory} from 'react-router-dom';
import {authenticate} from './services/auth';

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
  return (
    <form onSubmit={onSubmit}>
      <div className='loginBox'>
        <h2 id='welcome'>Gmail Clone</h2>
        <div className='textBox'>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Email'
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='textBox'>
          <input
            type='password'
            id='email'
            name='password'
            placeholder='Password'
            onChange={handleInputChange}
            required
          />
        </div>
        <input className='checkBox' type='checkbox'/>
        <label>Remember me</label>
        <input
          className='button'
          type='submit'
          value='Sign in'
        />
      </div>
    </form>
  );
};
export default Login;

