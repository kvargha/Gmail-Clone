export const getBearerToken =() =>{
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).accessToken : null;
};

export const authenticate = (user)=>{
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
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
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
