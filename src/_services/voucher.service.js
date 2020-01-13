import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const voucherService = {
  getVoucher
};

function getVoucher(venue_id, from, to, page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/voucher/all.json?include=user`,
    params: {
      per_page: 100,
      page: page,
      venue_id: venue_id,
      from: from,
      to: to
    },
    headers: authHeader()
  })
  .then(vouchers => {
    const voucherJson = {
      items: vouchers.data.data,
      total_price: vouchers.data.total_price,
      has_more: vouchers.data.has_morepages,
      page: page,
      total_transactions: vouchers.data.total_transactions,
      from: from,
      to: to
    };

    return voucherJson;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get voucher');
  });
}