import { salesConstants } from '../_constants';
import { salesService } from '../_services';
import { alertActions } from '../_actions';

export const salesActions = {
  getSalesReport,
  getBreakdown
};

function getSalesReport(date, venue) {
  return dispatch => {
    dispatch(request());
    return salesService.getReceipt(date, venue)
      .then(
        sales => dispatch(success(sales)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: salesConstants.GETSALES_REQUEST } }
  function success(sales) { return { type: salesConstants.GETSALES_SUCCESS, sales } }
  function failure(error) { return { type: salesConstants.GETSALES_FAILURE, error } }
}

function getBreakdown(receiptId) {
  return dispatch => {
    dispatch(request({ receiptId }));

    return salesService.getReceiptDetail(receiptId)
      .then(
        receipt => {
          dispatch(success(receipt));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(receipt) { return { type: salesConstants.GETRECEIPT_REQUEST, receipt } }
  function success(receipt) { return { type: salesConstants.GETRECEIPT_SUCCESS, receipt } }
  function failure(error) { return { type: salesConstants.GETRECEIPT_FAILURE, error } }
}