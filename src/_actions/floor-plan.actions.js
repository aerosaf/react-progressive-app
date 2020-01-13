import { floorPlanConstants } from '../_constants';
import { floorPlanService } from '../_services';
import { alertActions } from '../_actions';

export const floorPlanActions = {
  getRelatedFloorPlan
};

function getRelatedFloorPlan(key, value, date, page = 1) {
  return dispatch => {
    if (page < 2) {
      dispatch(request());
    }
    floorPlanService.getRelatedFloorPlan(key, value, date, page)
      .then(
        floors => dispatch(success(floors)),
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request() { return { type: floorPlanConstants.GETFLOORPLAN_REQUEST } };
  function success(floors) { return { type: floorPlanConstants.GETFLOORPLAN_SUCCESS, floors } };
  function failure(error) { return { type: floorPlanConstants.GETFLOORPLAN_FAILURE, error } };
}