import { venueConstants } from '../_constants';
import { venueService } from '../_services';
import { alertActions } from './alert.actions';

export const venueActions = {
  getVenues,
  getClosingInfoForm,
  submitClosingInfo
};

function getVenues(page = 1) {
  return dispatch => {
    dispatch(request());
    return venueService.getVenues(page)
      .then(
        venues => dispatch(success(venues)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        },
      );
  };

  function request() { return { type: venueConstants.GETVENUES_REQUEST } }
  function success(venues) { return { type: venueConstants.GETVENUES_SUCCESS, venues } }
  function failure(error) { return { type: venueConstants.GETVENUES_FAILURE, error } }
}

function getClosingInfoForm(venue_id, date) {
  return dispatch => {
    dispatch(request());
    return venueService.getClosingInfoForm(venue_id, date)
      .then(
        response => dispatch(success(response)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: venueConstants.GETCLOSINGINFO_REQUEST } }
  function success(response) { return { type: venueConstants.GETCLOSINGINFO_SUCCESS, response } }
  function failure(error) { return { type: venueConstants.GETCLOSINGINFO_FAILURE, error } }
}

function submitClosingInfo(venue_id, date, fields) {
  return dispatch => {
    dispatch(request());
    return venueService.submitClosingInfo(venue_id, date, fields)
      .then(
        response => {
          dispatch(success(response));
          dispatch(alertActions.success(response.msg));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        },
      );
  };

  function request() { return { type: venueConstants.GETCLOSINGINFO_REQUEST } }
  function success(response) { return { type: venueConstants.GETCLOSINGINFO_SUCCESS, response } }
  function failure(error) { return { type: venueConstants.GETCLOSINGINFO_FAILURE, error } }
}
