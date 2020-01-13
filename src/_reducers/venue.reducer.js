import { venueConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('venues'));
const initialVenueState = {
  loading: false,
  items: items ? items.items : null,
  company_id: items ? items.company_id : null,
  has_more: items ? items.has_more : false,
  page: items ? items.page: 1,
  error: null
};

export function venues(state = initialVenueState, action) {
  switch (action.type) {
    case venueConstants.GETVENUES_REQUEST:
      return {
        ...state,
        loading: true
      };

    case venueConstants.GETVENUES_SUCCESS:
      let response = {
        loading: false,
        items: action.venues.page > 1 ? state.items.concat(action.venues.items) : action.venues.items,
        company_id: action.venues.company_id,
        has_more: action.venues.has_more,
        page: action.venues.page
      };
      localStorage.setItem('venues', JSON.stringify(response));
      return response;

    case venueConstants.GETVENUES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state
  }
}

const initialClosingInfoState = {
  loading: false,
  items: null,
  is_edit: false,
  is_editable: false,
  venue: '',
  date: '',
  error: null
};

export function closing_info(state = initialClosingInfoState, action) {
  switch (action.type) {
    case venueConstants.GETCLOSINGINFO_REQUEST:
      return {
        ...initialClosingInfoState,
        loading: true
      };

    case venueConstants.GETCLOSINGINFO_SUCCESS:
      const data = action.response.data;
      return {
        ...state,
        loading: false,
        items: data.fields,
        is_edit: data.is_edit,
        is_editable: data.is_editable,
        venue: action.response.venue,
        date: action.response.date
      };

    case venueConstants.GETCLOSINGINFO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}