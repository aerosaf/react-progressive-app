import { orderConstants } from '../_constants';
import { orderService } from '../_services';
import { alertActions } from './alert.actions';

export const orderActions = {
  getOrders,
  getOrder,
  updateOrderStatus
};

function getOrders(venue, keyword, page = 1) {
  return dispatch => {
    if (page < 2) {
      dispatch(request());
    }
    orderService.getOrder(venue, keyword, page)
      .then(
        orders => dispatch(success(orders)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: orderConstants.GETORDERS_REQUEST } }
  function success(orders) { return { type: orderConstants.GETORDERS_SUCCESS, orders } }
  function failure(error) { return { type: orderConstants.GETORDERS_FAILURE, error } }
}

function getOrder(receipt_id) {
  return dispatch => {
    dispatch(request());
    orderService.getOrderDetail(receipt_id)
      .then(
        response => {
          dispatch(success(response));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: orderConstants.GETORDER_REQUEST } }
  function success(response) { return { type: orderConstants.GETORDER_SUCCESS, response } }
  function failure(error) { return { type: orderConstants.GETORDER_FAILURE, error } }
}

function updateOrderStatus(menu_id, status) {
  return dispatch => {
    dispatch(request());
    orderService.updateStatus(menu_id)
      .then(
        response => {
          dispatch(success(response));
          dispatch(alertActions.success(response.msg));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: orderConstants.UPDATEORDERSTATUS_REQUEST } }
  function success(response) { return { type: orderConstants.UPDATEORDERSTATUS_SUCCESS, response } }
  function failure(error) { return { type: orderConstants.UPDATEORDERSTATUS_FAILURE, error } }
}