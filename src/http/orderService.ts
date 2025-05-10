import HttpService from "./httpService";
class OrderService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'order';
  }
}

export default new OrderService();
