import { reservationConstants } from '../_constants';

const initialState = {
  loading: false,
  item: null,
  error: null
};

export function booking(state = initialState, action) {
  switch (action.type) {
    case reservationConstants.CLEAR_BOOKING:
      return {
        ...state,
        item: null
      };

    case reservationConstants.GETBOOKING_REQUEST:
      return {
        ...state,
        loading: true,
        item: null
      };

    case reservationConstants.GETBOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.booking.booking,
        error: null
      };

    case reservationConstants.GETBOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case reservationConstants.UPDATEBOOKING_REQUEST:
      return {
        ...state,
        loading: true
      };

    case reservationConstants.UPDATEBOOKING_SUCCESS:
      const response = action.response.data.data;
      return {
        ...state,
        loading: false,
        item: {
          ...state.item,
          ...response
        },
        error: null
      };

    case reservationConstants.UPDATEBOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}
