import http from "../common/http-common"

class authService {
  LoginUser() {
    return http.post("/api/auth/login");
  }

 

}

export default new authService();