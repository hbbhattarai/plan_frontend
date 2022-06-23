import http from "../common/http-common"

class activityService {
  getAll() {
    return http.get("/api/get-all-activities");
  }

  getById(id) {
    return http.get(`/api/get-activity/${id}`);
  }

  getByPlanId(id) {
    return http.get(`/api/get-activity/plan/${id}`);
  }

  create(data) {
    return http.post("/api/create-activity", data);
  }
  upload(id , data) {
    return http.put(`/api/upload/${id}`, data);
  }

  update(id, data) {
    return http.put(`/api/update-activity/${id}`, data);
  }

  delete(id) {
    return http.delete(`/api/delete-activity/${id}`);
  }

}

export default new activityService();