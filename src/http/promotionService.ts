import HttpService from "./httpService";
class PromotionService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'promotion';
  }
}

export default new PromotionService();
