import { reservationConstants } from '../_constants';
import { reservationService } from '../_services';
import { alertActions } from './alert.actions';

export const reservationActions = {
  getBookings,
  getBooking,
  clearBooking,
  updateBooking,
  confirmBooking,
  cancelBooking
};

function getBookings(venue_id, date, is_gem, keyword, status, page = 1) {
  return dispatch => {
    if (page === 1) {
      dispatch(request());
    }
    reservationService.getBookings(venue_id, date, is_gem, keyword, status, page)
      .then(
        reservations => dispatch(success(reservations)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error))
        }
      );
  };

  function request() { return { type: reservationConstants.GETBOOKINGS_REQUEST } }
  function success(reservations) { return { type: reservationConstants.GETBOOKINGS_SUCCESS, reservations } }
  function failure(error) { return { type: reservationConstants.GETBOOKINGS_FAILURE, error } }
}

function getBooking(bookingId) {
  return dispatch => {
    dispatch(request());

    return reservationService.getBooking(bookingId)
      .then(
        booking => {
          dispatch(success(booking));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: reservationConstants.GETBOOKING_REQUEST } }
  function success(booking) { return { type: reservationConstants.GETBOOKING_SUCCESS, booking } }
  function failure(error) { return { type: reservationConstants.GETBOOKING_FAILURE, error } }
}

function clearBooking() {
  return dispatch => {
    dispatch({ type: reservationConstants.CLEAR_BOOKING });
  };
}

function updateBooking(reservation) {
  return dispatch => {
    dispatch(request());
    reservationService.updateBooking(reservation)
      .then(
        response => {
          dispatch(success(response));
          dispatch({ type: reservationConstants.UPDATEBOOKING_LIST, booking: response });
          dispatch(alertActions.success(response.data.msg));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: reservationConstants.UPDATEBOOKING_REQUEST } }
  function success(response) { return { type: reservationConstants.UPDATEBOOKING_SUCCESS, response } }
  function failure(error) { return { type: reservationConstants.UPDATEBOOKING_FAILURE, error } }
}

function confirmBooking(booking_id) {
  return dispatch => {
    dispatch(request());
    reservationService.confirmBooking(booking_id)
      .then(
        response => {
          dispatch(success(response));
          dispatch({ type: reservationConstants.UPDATEBOOKING_LIST, booking: response });
          dispatch(alertActions.success(response.data.msg));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: reservationConstants.UPDATEBOOKING_REQUEST } }
  function success(response) { return { type: reservationConstants.UPDATEBOOKING_SUCCESS, response } }
  function failure(error) { return { type: reservationConstants.UPDATEBOOKING_FAILURE, error } }
}

function cancelBooking(booking_id, reason) {
  return dispatch => {
    dispatch({ type: reservationConstants.UPDATEBOOKING_REQUEST });
    reservationService.cancelBooking(booking_id, reason)
      .then(
        response => {
          dispatch({ type: reservationConstants.UPDATEBOOKING_SUCCESS, response: response });
          dispatch({ type: reservationConstants.UPDATEBOOKING_LIST, booking: response });
          dispatch(alertActions.success(response.data.msg));
        },
        error => {
          dispatch({ type: reservationConstants.UPDATEBOOKING_FAILURE, error: error });
          dispatch(alertActions.error(error));
        }
      )
  }
}
