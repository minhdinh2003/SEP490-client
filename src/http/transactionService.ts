import HttpService from "./httpService";
class TransactionService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'transaction';
  }
}

export default new TransactionService();
