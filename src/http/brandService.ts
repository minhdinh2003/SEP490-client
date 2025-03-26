import HttpService from './httpService';

class BrandService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'brand';
  }
}

export default new BrandService();
