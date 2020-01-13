import { userConstants } from '../_constants';

const initialState = {
  loading: false,
  items: null,
  error: null
};

export function users(state = initialState, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        loading: false,
        items: action.users,
        error: null
      };
    case userConstants.GETALL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state
  }
}