import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const venueService = {
  getVenues,
  getClosingInfoForm,
  submitClosingInfo
};

function getVenues(page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/venue/all-options.json`,
    params: {
      page: page,
      per_page: 1000
    },
    headers: authHeader()
  })
  .then(venues => {
    const select = [];
    venues.data.data.map(venue => {
      select.push({key: venue.id, value: venue.id , text: venue.name});
    });

    return {
      items: select,
      company_id: venues.data.company_id,
      has_more: venues.data.has_morepages,
      page: page
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get venues');
  });
}

function getClosingInfoForm(venue_id, date) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/venue/closing-info-form.json`,
    params: {
      venue_id: venue_id,
      date: date
    },
    headers: authHeader()
  })
  .then(response => {
    return {
      ...response.data,
      date: date,
      venue: venue_id
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get closing info fields');
  });
}

function submitClosingInfo(venue_id, date, fields) {
  const form = new FormData();
    form.append('venue_id', venue_id);
    form.append('date', date);
    form.append('fields', JSON.stringify(fields));
  return axios({
    method: 'POST',
    url: `${config.apiUrl}/api/venue/submit-closing-info-form.json`,
    data: form,
    headers: authHeader()
  })
  .then(response => {
    return {
      ...response.data,
      date: date,
      venue: venue_id
    };
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Update form failed');
  });
}
