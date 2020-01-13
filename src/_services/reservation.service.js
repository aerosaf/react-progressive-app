import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const reservationService = {
  getBookings,
  getBooking,
  updateBooking,
  confirmBooking,
  cancelBooking
};

function getBookings(venue_id, date, is_gem, keyword, status, page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/booking/all.json`,
    params: {
      venue_id: venue_id,
      date: date,
      is_gem: is_gem,
      keyword: keyword,
      status: status,
      include: 'table, user, receipts, details, booth',
      page: page,
      per_page: 100
    },
    headers: authHeader()
  })
  .then(bookings => {
    return {
      items: bookings.data.data,
      has_more: bookings.data.has_morepages,
      company_id: bookings.data.company_id,
      date: date,
      venue_id: venue_id,
      is_gem: is_gem,
      status: status,
      keyword: (keyword !== null) ? keyword : '',
      page: page
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject('Could not get bookings');
  });
}

function getBooking(booking_id) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/booking/show.json`,
    params: {
      booking_id: booking_id,
      include: 'table, user, receipts, details, booth, venue'
    },
    headers: authHeader()
  })
  .then(booking => {
    const bookingJson = {
      booking: booking.data.data
    };
    localStorage.setItem('booking', JSON.stringify(bookingJson));
    return bookingJson;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject('Could not get booking detail');
  });
}

function updateBooking(reservation) {
  const form = new FormData();
    form.append('booking_id', reservation.id);
    form.append('booking_date', reservation.booking_date);
    form.append('table_id', reservation.table.data.floor_plan_element_id);
    form.append('unisex_pax', reservation.pax);
    form.append('female_pax', 0);
    form.append('male_pax', 0);
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/booking/edit.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return response;
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

function confirmBooking(booking_id) {
  const form = new FormData();
    form.append('booking_id', booking_id);
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/booking/confirm-booking.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return response;
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

function cancelBooking(booking_id, reason) {
  const form = new FormData();
    form.append('booking_id', booking_id);
    form.append('cancellation_reason', reason);

  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/booking/cancel.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return response;
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
