import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const notificationService = {
  getNotification,
  readNotification
};

function getNotification(page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/notification/all.json`,
    params: {
      per_page: 100,
      page: page
    },
    headers: authHeader()
  })
  .then(notifications => {
    let new_notifications = notifications.data.data.filter(data => {
      return (data.event.match(/Booking/gi) !== null || data.event.match(/SendbirdMessage/gi) !== null);
    });
    return {
      items: new_notifications,
      has_more: notifications.data.has_morepages,
      page: page
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get notifications');
  });
}

function readNotification(notification) {
  const form = new FormData();
  form.append('notification_id', notification.code);
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/notification/read.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return response.data.data;
  })
  .catch(error => {
    let { response } = error;
    let { data, status } = response;
    let { msg } = data;
    if (status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(msg);
  });
}