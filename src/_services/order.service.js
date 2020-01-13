import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const orderService = {
  getOrder,
  getOrderDetail,
  updateStatus
};

function getOrder(venue_id, keyword, page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/booking/menu-order-list.json`,
    params: {
      per_page: 20,
      sort_type: 'booking_detail.created_at',
      page: page,
      venue_id: venue_id,
      keyword: keyword
    },
    headers: authHeader()
  })
  .then(orders => {
    return {
      items: orders.data.data,
      has_more: orders.data.has_morepages,
      page: page,
      venue: venue_id,
      keyword: keyword
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get orders');
  });
}

function getOrderDetail(receipt_id) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/booking/menu-order-detail.json`,
    params: {
      receipt_id: receipt_id
    },
    headers: authHeader()
  })
  .then(receipt => {
    const receiptJson = {
      detail: receipt.data.data
    };
    localStorage.setItem('receiptDetail', JSON.stringify(receiptJson));
    return receiptJson;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get booking detail');
  });
}

function updateStatus(booking_detail_id) {
    const form = new FormData();
    form.append('booking_detail_id', booking_detail_id);
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/booking/delivered-order.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not update order status');
  });
}