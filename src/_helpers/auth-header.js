export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { "Content-Type": "application/json,application/x-www-form-urlencoded,multipart/form-data", "Authorization": "Bearer " + user.token };
  } else {
    return {};
  }
}

export function userDetails() {
  let user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    return user;
  } else {
    return {};
  }
}
