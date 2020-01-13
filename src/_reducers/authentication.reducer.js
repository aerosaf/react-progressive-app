import { userConstants } from '../_constants';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = {
  loading: false,
  loggedIn: user ? true : false,
  user: user
};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loading: false,
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return state;
    case userConstants.LOGOUT:
      return {
        loading: false,
        loggedIn: false,
        user: null
      };
    case userConstants.SENDBIRD_CREATE_USER_SUCCESS:
      const { user } = action;
      return {
        ...state,
        user: {
          ...state.user,
          sendbird_access_token: user.data.data.access_token
        }
      };
    default:
      return state
  }
}