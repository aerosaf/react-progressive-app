import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { sendbirdUserActions } from '../_sendbird_actions';

export const userActions = {
  login,
  logout,
  createSendBirdUser
};

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password)
      .then(
        user => {
          dispatch(success(user));
          dispatch(sendbirdUserActions.login(user.id, user.sendbird_access_token));
          history.push('/bookings');
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function createSendBirdUser() {
  return dispatch => {
    dispatch({ type: userConstants.LOGIN_REQUEST });

    userService.createSendBirdUser()
      .then(
        user => {
          dispatch({
            type: userConstants.SENDBIRD_CREATE_USER_SUCCESS,
            user: user
          });
          dispatch(sendbirdUserActions.login(user.id, user.sendbird_access_token));
        },
        error => {
          dispatch({
            type: userConstants.LOGIN_FAILURE,
            error: error
          });
        }
      );
  };
}