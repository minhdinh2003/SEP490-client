import HttpService from './httpService';

class VoucherService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'voucher';
  }
}

export default new VoucherService();
