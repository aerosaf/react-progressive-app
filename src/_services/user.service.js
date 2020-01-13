import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const userService = {
  login,
  logout,
  createSendBirdUser
};

function login(username, password) {
  const form = new FormData();
    form.append('username', username);
    form.append('password', password);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded,multipart/form-data"
  };

  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/auth/login.json`,
    data: form,
    headers: headers
  })
  .then(user => {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    const userJson = {
      id: user.data.data.id,
      username: user.data.data.username,
      name: user.data.data.name,
      type: user.data.data.type,
      token: user.data.token,
      companyId: user.data.data.companyId,
      avatar: user.data.data.avatar.full_path,
      sendbird_access_token: user.data.data.sendbird_access_token
    };
    localStorage.setItem('user', JSON.stringify(userJson));
    localStorage.setItem('app_version', process.env.APP_VERSION);

    return userJson;
  })
  .catch(error => {
    // if (error.response.status === 401) {
    //   logout();
    //   location.reload(true);
    // }
    return Promise.reject('Username or password is incorrect');
  });
}

function logout() {
  // remove user from local storage to log user out
  // localStorage.removeItem('user');
  localStorage.clear();
}

function getUser(userId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/team/show.json?user_id=${userId}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function createSendBirdUser() {
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/sendbird/create-user.json`,
    headers: authHeader()
  })
  .then(response => {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({ ...user, sendbird_access_token: response.data.data.access_token }));
    return response;
  })
  .catch(error => {
    return Promise.reject(error.response.data.msg);
  });
}