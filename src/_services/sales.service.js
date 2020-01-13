import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const salesService = {
  getReceipt,
  getReceiptDetail
};

function getReceipt(date, venue) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/sales-report/all.json`,
    params: {
      venue_id: venue,
      paid: "true",
      per_page: 1000,
      page: 1,
      from: date,
      to: date
    },
    headers: authHeader()
  })
  .then(sales => {
    return {
      items: sales.data.data.receipts,
      date: date,
      venue: venue
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get sales report')
  });
}

function getReceiptDetail(receipt_id) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/sales-report/show.json`,
    params: {
      receipt_id: receipt_id
    },
    headers: authHeader()
  })
  .then(receipt => {
    const receiptJson = {
      receipt: receipt.data.data
    };
    localStorage.setItem('receipt', JSON.stringify(receiptJson));
    return receiptJson;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get receipt');
  });
}