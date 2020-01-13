import { orderConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('orders'));
const initialState = items ? items : {
  loading: false,
  items: null,
  venue: '',
  keyword: '',
  has_more: false,
  page: 1
};

export function orders(state = initialState, action) {
  switch (action.type) {
    case orderConstants.GETORDERS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case orderConstants.GETORDERS_SUCCESS:
      let response = {
        loading: false,
        items: action.orders.page > 1 ? state.items.concat(action.orders.items) : action.orders.items,
        has_more: action.orders.has_more,
        keyword: action.orders.keyword,
        venue: action.orders.venue,
        page: action.orders.page
      };
      localStorage.setItem('orders', JSON.stringify(response));
      return response;
    case orderConstants.GETORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

const initialReceipt = { loading: false };

export function orderReceipt(state = initialReceipt, action) {
  switch (action.type) {
    case orderConstants.GETORDER_REQUEST:
      return {
        loading: true
      };
    case orderConstants.GETORDER_SUCCESS:
      return {
        detail: action.response.detail
      };
    case orderConstants.GETORDER_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}

const initialOrderStatus = { loading: false };

export function updateOrderStatus(state = initialOrderStatus, action) {
  switch (action.type) {
    case orderConstants.UPDATEORDERSTATUS_REQUEST:
      return {
        loading: true
      };
    case orderConstants.UPDATEORDERSTATUS_SUCCESS:
      return {
        response: action.response
      };
    case orderConstants.UPDATEORDERSTATUS_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}