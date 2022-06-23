import http from "../common/http-common"

class planService {
  getAll() {
    return http.get("/api/get-all-plans");
  }

  getById(id) {
    return http.get(`/api/get-plan/${id}`);
  }

  getByDzongkhagId(id) {
    return http.get(`/api/get-plan/dzongkhag/${id}`);
  }

  create(data) {
    return http.post("/api/create-plan", data);
  }
  upload(id , data) {
    return http.put(`/api/upload/${id}`, data);
  }

  update(id, data) {
    return http.put(`/api/update-plan/${id}`, data);
  }

  delete(id) {
    return http.delete(`/api/delete-plan/${id}`);
  }

}

export default new planService();