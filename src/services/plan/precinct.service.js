import http from "../common/http-common"

class precinctService {

  getByPlanId(planid) {
    return http.get(`/api/get-precinct/${planid}`);
  }


}

export default new precinctService();