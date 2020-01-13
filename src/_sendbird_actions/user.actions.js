import { sendbirdConstants } from '../_constants';
import { sendbirdUserService } from '../_sendbird_services';

export const sendbirdUserActions = {
  login
};

function login(user_id, access_token) {
  return dispatch => {
    dispatch({ type: sendbirdConstants.LOGIN_REQUEST });

    sendbirdUserService.connect(user_id, access_token)
      .then(
        user => dispatch({
          type: sendbirdConstants.LOGIN_SUCCESS,
          user: user
        }),
        error => dispatch({
          type: sendbirdConstants.LOGIN_FAIL,
          error: error
        })
      );
  };
}
