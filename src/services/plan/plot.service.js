import http from "../common/http-common"

class plotService {
  getPlotByPlotId(plot_id) {
    return http.get(`/api/get-plot/${plot_id}`);
  }

}

export default new plotService();