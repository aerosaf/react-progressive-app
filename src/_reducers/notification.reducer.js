import { notificationConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('notifications'));
const initialState = items ? items : {
  loading: false,
  items: null,
  has_more: false,
  page: 1
};

export function notifications(state = initialState, action) {
  switch (action.type) {
    case notificationConstants.GETNOTIFICATION_REQUEST:
      let response = {
        ...state,
        loading: true
      };
      if (action.refresh) {
        response.items = null;
      }
      return response;
    case notificationConstants.GETNOTIFICATION_SUCCESS:
      response = {
        loading: false,
        items: action.notifications.page > 1 ? state.items.concat(action.notifications.items) : action.notifications.items,
        has_more: action.notifications.has_more,
        page: action.notifications.page
      };
      localStorage.setItem('notifications', JSON.stringify(response));
      return response;
    case notificationConstants.GETNOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case notificationConstants.READNOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true
      };
    case notificationConstants.READNOTIFICATION_SUCCESS:
      const { notification } = action;
      const items = state.items.map(item => {
        if (item.code === notification.code) {
          return notification;
        }
        return item;
      });
      response = {
        ...state,
        loading: false,
        items: items
      };
      localStorage.setItem('notifications', JSON.stringify(response));
      return response;
    case notificationConstants.READNOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state;
  }
}
