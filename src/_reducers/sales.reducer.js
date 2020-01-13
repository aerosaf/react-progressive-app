import { salesConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('sales'));
const initialSalesState = items ? items : {
  loading: false,
  items: null,
  date: null,
  venue: '',
  error: null
};

export function sales(state = initialSalesState, action) {
  switch (action.type) {
    case salesConstants.GETSALES_REQUEST:
      return {
        ...state,
        loading: true,
        items: null
      };
    case salesConstants.GETSALES_SUCCESS:
      let response = {
        ...state,
        loading: false,
        items: action.sales.items,
        date: action.sales.date,
        venue: action.sales.venue
      };
      localStorage.setItem('sales', JSON.stringify(response));
      return response;
    case salesConstants.GETSALES_FAILURE:
      return {
        ...state,
        loading: false,
        items: null,
        error: action.error
      };
    default:
      return state
  }
}

const initialReceiptState = {
  loading: false,
  item: null,
  error: null
};

export function receipt(state = initialReceiptState, action) {
  switch (action.type) {
    case salesConstants.GETRECEIPT_REQUEST:
      return {
        ...state,
        loading: true,
        item: null
      };
    case salesConstants.GETRECEIPT_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.receipt.receipt
      };
    case salesConstants.GETRECEIPT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
