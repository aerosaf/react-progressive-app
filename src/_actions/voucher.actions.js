import { voucherConstants } from '../_constants';
import { voucherService } from '../_services';
import { alertActions } from './alert.actions';

export const voucherActions = {
  getVouchers,
};

function getVouchers(venue_id, from, to, page = 1) {
  return dispatch => {
    if (page < 2) {
      dispatch(request());
    }
    voucherService.getVoucher(venue_id, from, to, page)
      .then(
        vouchers => dispatch(success(vouchers)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: voucherConstants.GETVOUCHER_REQUEST } }
  function success(vouchers) { return { type: voucherConstants.GETVOUCHER_SUCCESS, vouchers } }
  function failure(error) { return { type: voucherConstants.GETVOUCHER_FAILURE, error } }
}