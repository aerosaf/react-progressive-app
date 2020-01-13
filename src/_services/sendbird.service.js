import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const sendbirdService = {
  createChannel,
  addMember
};

function createChannel(booking_id) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
      form.append('booking_id', booking_id);
    return axios({
      method: 'POST',
      url: `${config.apiUrl}/api/sendbird/create-channel.json`,
      data: form,
      headers: authHeader()
    })
    .then(response => {
      resolve(response.data.data.channel_url);
    })
    .catch(error => {
      let { response } = error;
      let { data, status } = response;
      let { msg } = data;
      if (status === 401) {
        logout();
        window.location.reload();
      }
      reject(msg);
    });
  });
}

function addMember(booking_id) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
      form.append('booking_id', booking_id);
    return axios({
      method: 'POST',
      url: `${config.apiUrl}/api/sendbird/add-member.json`,
      data: form,
      headers: authHeader()
    })
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      reject(error)
    });
  });
}
