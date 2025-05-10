import { ServiceResponse } from "@/type/service.response";
import HttpService from "./httpService";
class UserService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'user';
  }

  
  async getCurrentUser(): Promise<ServiceResponse> {
    try {
        const response = await this.get<ServiceResponse>("/currentUser");
        return response;
    } catch (error) {
        throw error;
    }
}
}

export default new UserService();
