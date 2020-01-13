import config from 'config';
import axios from 'axios';
import { authHeader } from '../_helpers';

export const floorPlanService = {
  getRelatedFloorPlan
}

function getRelatedFloorPlan(key, value, date, page = 1) {
  return axios({
    method: 'GET',
    url: `${config.apiUrl}/api/floor-plan/related-floor-plans.json`,
    params: {
      key: key,
      value: value,
      date: date,
      include: 'elements.ref',
      page: page,
      per_page: 100
    },
    headers: authHeader()
  })
  .then(floors => {
    let data = floors.data.data.map(function(main) {
      let elements = main.elements.data.map(function(element) {
        return {
          key: element.id,
          value: element.id,
          text: element.name
        };
      })
      return {
        elements: elements,
        key: main.id,
        value: main.id,
        text: main.name
      };
    });

    const floorJson = {
      items: data
    };

    localStorage.setItem('floors', JSON.stringify(floorJson));
    return floorJson;
  })
  .catch(error => {
    if (error.response.status === 401) {
      logout();
      window.location.reload();
    }
    return Promise.reject(error.response.data ? error.response.data.msg : 'Could not get floor plans');
  });
}