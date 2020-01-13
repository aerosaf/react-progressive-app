import { reservationConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('reservations'));
const initialState = items ? items : {
  loading: false,
  items: null,
  has_more: false,
  company_id: '',
  date: '',
  venue_id: '',
  is_gem: false,
  status: '',
  keyword: '',
  page: ''
};

export function reservations(state = initialState, action) {
  switch (action.type) {
    case reservationConstants.GETBOOKINGS_REQUEST:
      return {
        ...state,
        loading: true,
        items: null
      };
    case reservationConstants.GETBOOKINGS_SUCCESS:
      let response = {
        loading: false,
        items: action.reservations.page > 1 ? state.items.concat(action.reservations.items) : action.reservations.items,
        has_more: action.reservations.has_more,
        company_id: action.reservations.company_id,
        date: action.reservations.date,
        venue_id: action.reservations.venue_id,
        is_gem: action.reservations.is_gem,
        status: action.reservations.status,
        keyword: action.reservations.keyword,
        page: action.reservations.page
      };
      localStorage.setItem('reservations', JSON.stringify(response));
      return response;
    case reservationConstants.GETBOOKINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case reservationConstants.UPDATEBOOKING_LIST:
      const booking = action.booking.data.data;
      const items = state.items.map(item => {
        if (item.id === booking.id) {
          return { ...item, ...booking };
        }
        return item;
      });
      response = {
        ...state,
        items: items
      };
      localStorage.setItem('reservations', JSON.stringify(response));
      return response;
    default:
      return state
  }
}
