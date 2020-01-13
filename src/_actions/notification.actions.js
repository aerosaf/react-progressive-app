import { notificationConstants } from '../_constants';
import { notificationService } from '../_services';
import { alertActions } from './alert.actions';

export const notificationActions = {
  getNotifications,
  readNotification
};

function getNotifications(page = 1, refresh = false) {
  return dispatch => {
    if (page === 1) {
      dispatch(request(refresh));
    }
    notificationService.getNotification(page)
      .then(
        notifications => dispatch(success(notifications)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(refresh) { return { type: notificationConstants.GETNOTIFICATION_REQUEST, refresh } }
  function success(notifications) { return { type: notificationConstants.GETNOTIFICATION_SUCCESS, notifications } }
  function failure(error) { return { type: notificationConstants.GETNOTIFICATION_FAILURE, error } }
}

function readNotification(notification) {
  return dispatch => {
    dispatch(request());
    notificationService.readNotification(notification)
      .then(
        response => {
          dispatch(success(response));
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request() { return { type: notificationConstants.READNOTIFICATION_REQUEST } }
  function success(notification) { return { type: notificationConstants.READNOTIFICATION_SUCCESS, notification } }
  function failure(error) { return { type: notificationConstants.READNOTIFICATION_FAILURE, error } }
}
