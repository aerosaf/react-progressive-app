import { floorPlanConstants } from '../_constants';

const initialState = {
  loading: false,
  items: null,
  error: null
};

export function floors(state = initialState, action) {
  switch (action.type) {
    case floorPlanConstants.GETFLOORPLAN_REQUEST:
      return {
        ...state,
        loading: true,
        items: null
      };
    case floorPlanConstants.GETFLOORPLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.floors.items,
        error: null
      };
    case floorPlanConstants.GETFLOORPLAN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}