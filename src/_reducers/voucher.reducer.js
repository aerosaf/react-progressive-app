import { voucherConstants } from '../_constants';

const items = JSON.parse(localStorage.getItem('vouchers'));
const initialState = items ? items : {
  items: null,
  total_price: 0,
  has_more: false,
  page: 1,
  total_transactions: 0,
  from: null,
  to: null
};

export function vouchers(state = initialState, action) {
  switch (action.type) {
    case voucherConstants.GETVOUCHER_REQUEST:
      return {
        loading: true
      };
    case voucherConstants.GETVOUCHER_SUCCESS:
      const { vouchers } = action;
      let response = {
        items: vouchers.page > 1 ? state.items.concat(vouchers.items) : vouchers.items,
        total_price: vouchers.total_price,
        has_more: vouchers.has_more,
        page: vouchers.page,
        total_transactions: vouchers.total_transactions,
        from: vouchers.from,
        to: vouchers.to
      };
      localStorage.setItem('vouchers', JSON.stringify(response));
      return response;
    case voucherConstants.GETVOUCHER_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}
