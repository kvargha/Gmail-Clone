export const getBearerToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).accessToken : null;
};

export const authenticate = (user) => {
  return fetch('http://localhost:3010/auth', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((token) => {
      localStorage.setItem('user', JSON.stringify(token));
      return user;
    })
    .catch((err) => {
      alert('Error logging in, please try again');
    });
};

export const getConfig = (method = 'get') => {
  return {
    method: method,
    headers: {
      'Authorization': `Bearer ${getBearerToken()}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getEmail = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).email : null;
};

export const getUserId = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).userid : null;
};

export const getUserName = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).username : null;
};

export const logout = () => {
  localStorage.clear()
};