import HttpService from "./httpService";
class ProductService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'product';
  }
}

export default new ProductService();
